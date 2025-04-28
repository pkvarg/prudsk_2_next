// app/api/users/[id]/favorites/route.js

// @desc Add a product to user favorites
// @desc POST /api/users/:id/favorites
// @access Private

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 })
    }

    const { id } = params
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
