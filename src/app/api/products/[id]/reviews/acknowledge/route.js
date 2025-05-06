import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'

const prisma = new PrismaClient()

// @desc    Acknowledge review
// @route   PUT /api/products/:id/reviews/acknowledge
// @access  Private
export async function PUT(request, { params }) {
  try {
    // In Next.js 15, we need to await the id
    const id = await params.id

    // Parse request body
    const body = await request.json()
    const { comment } = body

    if (!comment) {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: { reviews: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Find the review by comment text
    const review = await prisma.review.findFirst({
      where: {
        productId: id,
        comment: comment,
      },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Update the review to acknowledge it
    await prisma.review.update({
      where: { id: review.id },
      data: { isAcknowledged: true },
    })

    // Get the updated product with all its reviews
    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: { reviews: true },
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error acknowledging review:', error)

    return NextResponse.json(
      { error: 'Failed to acknowledge review', details: error.message },
      { status: 500 },
    )
  }
}
