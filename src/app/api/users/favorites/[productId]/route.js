// app/api/user/favorites/[productId]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Remove from favorites
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 })
    }

    const { productId } = params
    const userId = session.user.id

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, favorites: true },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Remove from favorites
    const favorites = user.favorites || []
    const updatedFavorites = favorites.filter((id) => id !== productId)

    // Update user favorites
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        favorites: updatedFavorites,
      },
      select: { favorites: true },
    })

    return NextResponse.json({
      message: 'Removed from favorites',
      favorites: updatedUser.favorites,
    })
  } catch (error) {
    console.error('Error removing from favorites:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
