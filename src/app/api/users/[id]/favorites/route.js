// app/api/users/[id]/favorites/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'
import { auth } from '../../../../lib/auth'

const prisma = new PrismaClient()

// @desc Add a product to user favorites
// @desc POST /api/users/:id/favorites
// @access Private
export async function POST(request, { params }) {
  try {
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params
    const { productId } = await request.json()

    // Verify if the requesting user is the same as the target user or is an admin
    if (session.user.id !== id && !session.user.isAdmin) {
      return NextResponse.json(
        { message: 'Not authorized to modify other user favorites' },
        { status: 403 },
      )
    }

    // Find user first to verify existence
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        favorites: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    console.log(user)

    // Update user favorites
    // Option 1: If favorites is a relation to Product model
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        favorites: {
          connect: { id: productId },
        },
      },
      include: {
        favorites: true,
      },
    })

    /* 
    // Option 2: If favorites is a simple array of product IDs
    // First check if product already exists in favorites
    const favoriteExists = user.favorites.includes(productId);
    
    if (!favoriteExists) {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          favorites: {
            push: productId
          }
        }
      });
    }
    */

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
