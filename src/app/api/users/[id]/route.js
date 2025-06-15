// app/api/users/[id]/route.js

import { NextResponse } from 'next/server'
import isAdmin from '@/lib/isAdmin'
import prisma from '@/db/db'

// @desc Get user by ID
// @desc GET /api/users/:id
// @access Private/Admin
export async function GET(request, { params }) {
  try {
    const userLoggedIn = await isAdmin()

    if (!userLoggedIn.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params

    // Find user by ID, excluding password
    const user = await prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        isAssistant: true,
        isSubscribed: true,
        isRegistered: true,
        isUnsubscribed: true,
        createdAt: true,
        updatedAt: true,
        googleId: true,
        // password is excluded
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// @desc Delete user
// @desc DELETE /api/users/:id
// @access Private/Admin
export async function DELETE(request, { params }) {
  try {
    const userLoggedIn = await isAdmin()

    if (!userLoggedIn.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params

    // Find the user first to verify it exists
    const user = await prisma.user.findFirst({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Check if trying to delete self
    if (user.id === userLoggedIn.id) {
      return NextResponse.json({ message: 'Cannot delete your own account' }, { status: 400 })
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'User removed' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// @desc Update user
// @desc PUT /api/users/:id
// @access Private/Admin
export async function PUT(request, { params }) {
  try {
    const userLoggedIn = await isAdmin()

    if (!userLoggedIn.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params
    const userData = await request.json()

    // Find user first to verify existence
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Handle favorites update
    if (userData.favorites) {
      console.log('Adding to favorites:', userData.favorites)

      // Assuming favorites is a relation to another model
      // If it's an array field, you might need to adjust this logic
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          favorites: {
            connect: { id: userData.favorites },
          },
        },
      })

      console.log('FUU:', updatedUser)

      return NextResponse.json({
        id: updatedUser.id,
        favorites: updatedUser.favorites,
      })
    }

    // Handle regular user data update
    else {
      // Prepare update data
      const updateData = {
        name: userData.name || user.name,
        email: userData.email || user.email,
        isAdmin: userData.isAdmin !== undefined ? userData.isAdmin : user.isAdmin,
        isAssistant: userData.isAssistant !== undefined ? userData.isAssistant : user.isAssistant,
        isRegistered:
          userData.isRegistered !== undefined ? userData.isRegistered : user.isRegistered,
        isSubscribed:
          userData.isSubscribed !== undefined ? userData.isSubscribed : user.isSubscribed,
      }

      // Handle unsubscribe status
      if (userData.isSubscribed === false) {
        updateData.isUnsubscribed = true
      } else if (userData.isSubscribed === true) {
        updateData.isUnsubscribed = false
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
      })

      return NextResponse.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        favorites: updatedUser.favorites,
        isAdmin: updatedUser.isAdmin,
        isAssistant: updatedUser.isAssistant,
        isRegistered: updatedUser.isRegistered,
        isSubscribed: updatedUser.isSubscribed,
      })
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
