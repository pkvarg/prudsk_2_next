import { NextResponse } from 'next/server'
import prisma from '@/db/db'

// @desc    Acknowledge review
// @route   PUT /api/products/:id/reviews/acknowledge
// @access  Private
export async function PUT(request, { params }) {
  try {
    const { id } = await params

    const body = await request.json()
    const { comment } = body

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: { reviews: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

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

    return NextResponse.json({ message: 'Review acknowledged' }, { status: 200 })
  } catch (error) {
    console.error('Error acknowledging review:', error)

    return NextResponse.json(
      { error: 'Failed to acknowledge review', details: error.message },
      { status: 500 },
    )
  }
}
