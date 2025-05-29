import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'

const prisma = new PrismaClient()

// @desc    Remove from favorites
// @route   PUT /api/products/:id/remove/favorites
// @access  Private

export async function PUT(request, { params }) {
  try {
    // In Next.js 15, we need to await the id
    const { id } = await params

    // Parse request body
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: { favoriteOf: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Find and delete the favorite entry
    // In Prisma, we use the relationship model instead of array splicing
    await prisma.favorite.deleteMany({
      where: {
        productId: id,
        favoriteOf: parseInt(userId), // Ensure it's the right type (assuming favoriteOf is an integer)
      },
    })

    // Get the updated product
    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: { favoriteOf: true },
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error removing from favorites:', error)

    return NextResponse.json(
      { error: 'Failed to remove from favorites', details: error.message },
      { status: 500 },
    )
  }
}
