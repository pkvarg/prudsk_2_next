import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import isAdmin from '@/lib/isAdmin'

// @desc    Get review
// @route   GET /api/products/:id/reviews
// @access  Public
export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Find the review by comment
    const reviews = await prisma.review.findMany({
      where: {
        productId: id,
      },
    })

    if (!reviews) {
      return NextResponse.json({ error: 'Recenze nebyly nalezeny' }, { status: 404 })
    }

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error deleting review:', error)

    return NextResponse.json(
      { error: 'Nepodařilo se smazat recenzi', details: error.message },
      { status: 500 },
    )
  }
}

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
      return NextResponse.json({ error: 'Hodnocení a komentář jsou povinné' }, { status: 400 })
    }

    const user = await isAdmin()
    if (!user) {
      return NextResponse.json({ error: 'Uživatel není ověřen' }, { status: 401 })
    }

    if (!user.id || !user.name) {
      return NextResponse.json({ error: 'Neplatná uživatelská data' }, { status: 400 })
    }

    const { name: userName, id: userId } = user

    console.log('user in rew', userName, userId)

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: { reviews: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Produkt nebyl nalezen' }, { status: 404 })
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
      return NextResponse.json({ error: 'Recenze už existuje' }, { status: 400 })
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

    const newReview = {
      userName,
      comment,
    }

    console.log('before sending', userName, comment)

    // TODO

    // SEND HONO EMAIL
    //const apiUrl = 'http://localhost:3013/api/prudsk2next/new-review'

    const apiUrl = 'https://hono-api.pictusweb.com/api/prudsk2next/new-review'

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(newReview),
    })

    const data = await response.json()
    console.log('data admin new review', data.success)

    return NextResponse.json({ message: 'Recenze byla přidána' }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)

    return NextResponse.json(
      { error: 'Nepodařilo se vytvořit recenzi', details: error.message },
      { status: 500 },
    )
  }
}

// @desc    Delete review
// @route   DELETE /api/products/:id/reviews
// @access  Private
export async function DELETE(request, { params }) {
  const user = await isAdmin()

  if (!user.isAdmin) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { id } = await params

    const body = await request.json() // Parse JSON object
    const { comment } = body // Extract comment from object

    if (!comment) {
      return NextResponse.json(
        { error: 'Komentář je vyžadován pro identifikaci recenze' },
        { status: 400 },
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: { reviews: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Produkt nebyl nalezen' }, { status: 404 })
    }

    // Find the review by comment
    const review = await prisma.review.findFirst({
      where: {
        productId: id,
        comment: comment,
      },
    })

    if (!review) {
      return NextResponse.json({ error: 'Recenze nebyla nalezena' }, { status: 404 })
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

    return NextResponse.json({ message: 'Recenze byla úspěšně smazána' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting review:', error)

    return NextResponse.json(
      { error: 'Nepodařilo se smazat recenzi', details: error.message },
      { status: 500 },
    )
  }
}
