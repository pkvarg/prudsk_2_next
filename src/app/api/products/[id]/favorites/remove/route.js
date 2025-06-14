import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import isAdmin from '@/lib/isAdmin'

// @desc    Remove from favorites
// @route   PUT /api/products/:id/favorites/remove
// @access  Private

export async function PUT(request, { params }) {
  try {
    const user = await isAdmin()

    const { id } = await params

    // Parse request body
    const body = await request.json()
    const { userId } = body

    console.log('remove back', id, userId)

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (user.id !== userId) {
      return new Response('Unauthorized', { status: 401 })
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
        favoriteOf: userId,
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
