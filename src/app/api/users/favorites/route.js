// app/api/user/favorites/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'
import { auth } from '../../../../lib/auth'

const prisma = new PrismaClient()

// Add to favorites
export async function POST(request) {
  try {
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { productId } = await request.json()
    const userId = session.user.id

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, favorites: true },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Check if product already in favorites
    const favorites = user.favorites || []
    if (favorites.includes(productId)) {
      return NextResponse.json({
        message: 'Product already in favorites',
        favorites,
      })
    }

    // Add to favorites
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        favorites: {
          push: productId,
        },
      },
      select: { favorites: true },
    })

    return NextResponse.json({
      message: 'Added to favorites',
      favorites: updatedUser.favorites,
    })
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// Get all favorites
export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const userId = session.user.id

    // Get user favorites
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { favorites: true },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ favorites: user.favorites || [] })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
