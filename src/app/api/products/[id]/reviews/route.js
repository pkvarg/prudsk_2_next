import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export async function POST(request, { params }) {
  try {
    // Get the authenticated user from the session
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // In Next.js 15, we need to await the id
    const id = await params.id

    // Parse request body
    const body = await request.json()
    const { rating, comment } = body

    // Validate input
    if (!rating || !comment) {
      return NextResponse.json({ error: 'Rating and comment are required' }, { status: 400 })
    }

    // Get user information from session
    const userId = session.user.id
    const userName = session.user.name

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

    if (existingReview) {
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
    const id = await params.id

    // Parse URL parameters and request body
    const { searchParams } = new URL(request.url)
    const comment = searchParams.get('comment')

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
