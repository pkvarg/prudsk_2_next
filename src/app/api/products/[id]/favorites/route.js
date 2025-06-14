// app/api/products/[id]/favorites/route.js
import { NextResponse } from 'next/server'
import isAdmin from '@/lib/isAdmin'
import prisma from '@/db/db'

// @desc    Add to favorites
// @route   PUT /api/products/[id]/favorites
// @access  Private

// app/api/products/[id]/favorites/route.js
export async function PUT(request, { params }) {
  try {
    const user = await isAdmin()

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id
    const { id: productId } = await params

    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        productId: productId,
        favoriteOf: userId,
      },
    })

    if (existingFavorite) {
      return NextResponse.json({ message: 'Product already in favorites' }, { status: 400 })
    }

    const newFavorite = await prisma.favorite.create({
      data: {
        favoriteOf: userId,
        productId: productId,
      },
    })

    console.log('New favorite created successfully:', newFavorite)

    return NextResponse.json(
      {
        message: 'Added to favorites successfully',
        favorite: newFavorite,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Add to favorites error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 },
    )
  }
}
