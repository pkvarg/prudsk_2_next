import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import { auth } from '@/lib/auth'
import isAdmin from '@/lib/isAdmin'

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export async function POST(request, { params }) {
  try {
    const { id } = await params

    // Parse request body
    const body = await request.json()
    const { rating, comment } = body

    // Validate input
    if (typeof rating !== 'number' || rating < 0 || !comment) {
      return NextResponse.json({ error: 'Rating and comment are required' }, { status: 400 })
    }

    const user = await isAdmin()
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    if (!user.id || !user.name) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 })
    }

    const { name: userName, id: userId } = user

    console.log('user in rew', userName, userId)

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: { reviews: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: id,
        userId: userId,
      },
    })

    console.log('existing?', existingReview)

    if (existingReview) {
      console.log('exist')
      return NextResponse.json({ error: 'Recenzia už existuje' }, { status: 400 })
    }

    // Create the review
    await prisma.review.create({
      data: {
        name: userName,
        rating: Number(rating),
        comment,
        user: {
          connect: { id: userId },
        },
        product: {
          connect: { id },
        },
      },
    })

    // Get all reviews for the product to calculate new average
    const updatedReviews = await prisma.review.findMany({
      where: { productId: id },
    })

    // Calculate new rating average and count
    const numReviews = updatedReviews.length
    const newRating = updatedReviews.reduce((acc, item) => item.rating + acc, 0) / numReviews

    // Update the product with new rating data
    await prisma.product.update({
      where: { id },
      data: {
        numReviews,
        rating: newRating,
      },
    })

    // Send email notification
    // Uncomment when you have the Email utility set up
    // await new Email({ name: userName, comment }).sendReviewNotification();

    return NextResponse.json({ message: 'Review added' }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)

    return NextResponse.json(
      { error: 'Failed to create review', details: error.message },
      { status: 500 },
    )
  }
}

// @desc    Delete review
// @route   DELETE /api/products/:id/reviews
// @access  Private
export async function DELETE(request, { params }) {
  try {
    // In Next.js 15, we need to await the id
    const { id } = await params

    // Parse URL parameters and request body
    const { searchParams } = new URL(request.url)
    let comment = searchParams.get('comment')

    if (!comment) {
      // If not in URL, try to get from request body
      try {
        const body = await request.json()
        if (body.comment) {
          comment = body.comment
        }
      } catch (e) {
        // If we can't parse JSON, continue with null comment
      }
    }

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment is required to identify the review' },
        { status: 400 },
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: { reviews: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Find the review by comment
    const review = await prisma.review.findFirst({
      where: {
        productId: id,
        comment: comment,
      },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: review.id },
    })

    // Recalculate review count and average rating
    const updatedReviews = await prisma.review.findMany({
      where: { productId: id },
    })

    const numReviews = updatedReviews.length
    const newRating =
      numReviews > 0 ? updatedReviews.reduce((acc, item) => item.rating + acc, 0) / numReviews : 0

    // Update the product with new rating data
    await prisma.product.update({
      where: { id },
      data: {
        numReviews,
        rating: newRating,
      },
    })

    // Get the updated product with all remaining reviews
    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: { reviews: true },
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error deleting review:', error)

    return NextResponse.json(
      { error: 'Failed to delete review', details: error.message },
      { status: 500 },
    )
  }
}
