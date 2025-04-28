// app/api/users/profile/route.js

// @desc Get user profile
// @desc GET /api/users/profile
// @access Private

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (user) {
      return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isAssistant: user.isAssistant || false,
        isSubscribed: user.isSubscribed || false,
      })
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 })
    }

    const userId = session.user.id
    const userData = await request.json()

    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData = {
      name: userData.name || user.name,
      email: userData.email || user.email,
      isSubscribed: userData.isSubscribed !== undefined ? userData.isSubscribed : user.isSubscribed,
    }

    // Handle unsubscribe status
    if (userData.isSubscribed === false) {
      updateData.isUnsubscribed = true
    } else if (userData.isSubscribed === true) {
      updateData.isUnsubscribed = false
    }

    // Handle password update
    if (userData.password) {
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(userData.password, salt)
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    // Return updated user data
    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isAssistant: updatedUser.isAssistant || false,
      isSubscribed: updatedUser.isSubscribed || false,
      token: generateToken(updatedUser.id),
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
