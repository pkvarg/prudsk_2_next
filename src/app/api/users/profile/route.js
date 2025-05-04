// app/api/users/profile/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'
import { auth } from '../../../../lib/auth'
//import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// @desc Get user profile
// @desc GET /api/users/profile
// @access Private
export async function GET(request, response) {
  const session = await auth()

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const email = session.user.email

    // Find user by email from session (cause Google has a different id in session)
    const user = await prisma.user.findUnique({
      where: { email: email },
    })

    if (user) {
      return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isAssistant: user.isAssistant || false,
        isSubscribed: user.isSubscribed || false,
        googleId: user.googleId || null,
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
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
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
      updatedAt: new Date(),
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
