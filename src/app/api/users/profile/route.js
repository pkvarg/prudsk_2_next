// app/api/users/profile/route.js
import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import isAdmin from '@/lib/isAdmin'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// @desc Get user profile
// @desc GET /api/users/profile
// @access Private
export async function GET(request, response) {
  const user = await isAdmin()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const id = user.id

  console.log('user', user)

  try {
    // Find user by email from session (cause Google has a different id in session)
    const user = await prisma.user.findFirst({
      where: { id },
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
      return NextResponse.json({ message: 'Uživatel nebyl nalezen' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// export async function PUT(request) {
//   try {
//     const user = await isAdmin()

//     if (!user) {
//       return new Response('Unauthorized', { status: 401 })
//     }

//     const userId = user.id
//     const userData = await request.json()

//     if (userId !== userData.id) {
//       return new Response('Unauthorized', { status: 401 })
//     }

//     // Find user by ID
//     const existingUser = await prisma.user.findFirst({
//       where: { id: userId },
//     })

//     if (!existingUser) {
//       return NextResponse.json({ message: 'Uživatel nebyl nalezen' }, { status: 404 })
//     }

//     const wantsToSubscribe = userData.isSubscribed
//     const currentlySubscribed = existingUser.isSubscribed && !existingUser.isUnsubscribed

//     // Prepare update data
//     const updateData = {}

//     // Handle subscription logic with both fields
//     if (wantsToSubscribe) {
//       // User wants to subscribe
//       updateData.isSubscribed = true
//       updateData.isUnsubscribed = false

//       if (!currentlySubscribed) {
//         console.log('User subscribed/resubscribed to newsletter')
//       }
//     } else {
//       // User doesn't want newsletter (or wants to unsubscribe)
//       if (currentlySubscribed) {
//         // They were subscribed, now they're unsubscribing
//         updateData.isSubscribed = false
//         updateData.isUnsubscribed = true

//         console.log('User unsubscribed from newsletter')
//       } else {
//         // They weren't subscribed anyway, just ensure clean state
//         updateData.isSubscribed = false
//         updateData.isUnsubscribed = false
//       }
//     }

//     // Update user
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: updateData,
//     })

//     console.log('updatedUser', updatedUser)

//     // Log the newsletter subscription change for analytics
//     const subscriptionChanged = wantsToSubscribe !== currentlySubscribed
//     if (subscriptionChanged) {
//       console.log(
//         `Newsletter subscription changed for user ${userId}: ${currentlySubscribed} -> ${wantsToSubscribe}`,
//       )
//     }

//     // Return updated user data
//     return NextResponse.json(
//       {
//         message: 'User updated successfully',
//         subscriptionChanged,
//         newsletterStatus: {
//           isSubscribed: updateData.isSubscribed,
//           isUnsubscribed: updateData.isUnsubscribed,
//         },
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     console.error('Error updating user profile:', error)
//     return NextResponse.json({ message: error.message }, { status: 500 })
//   }
// }

export async function PUT(request) {
  try {
    const user = await isAdmin()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const userId = user.id
    const userData = await request.json()

    if (userId !== userData.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Find user by ID
    const existingUser = await prisma.user.findFirst({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json({ message: 'Uživatel nebyl nalezen' }, { status: 404 })
    }

    const wantsToSubscribe = userData.isSubscribed
    const currentlySubscribed = existingUser.isSubscribed && !existingUser.isUnsubscribed

    // Prepare update data
    const updateData = {}

    // Handle name update
    if (userData.name) {
      updateData.name = userData.name
    }

    // Handle email update
    if (userData.email) {
      updateData.email = userData.email
    }

    // Handle password update
    if (userData.password) {
      // Hash the new password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds)
      updateData.password = hashedPassword
      console.log('Password updated for user:', userId)
    }

    // Handle subscription logic with both fields
    if (wantsToSubscribe) {
      // User wants to subscribe
      updateData.isSubscribed = true
      updateData.isUnsubscribed = false

      if (!currentlySubscribed) {
        console.log('User subscribed/resubscribed to newsletter')
      }
    } else {
      // User doesn't want newsletter (or wants to unsubscribe)
      if (currentlySubscribed) {
        // They were subscribed, now they're unsubscribing
        updateData.isSubscribed = false
        updateData.isUnsubscribed = true

        console.log('User unsubscribed from newsletter')
      } else {
        // They weren't subscribed anyway, just ensure clean state
        updateData.isSubscribed = false
        updateData.isUnsubscribed = false
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    console.log('updatedUser', updatedUser)

    // Log the newsletter subscription change for analytics
    const subscriptionChanged = wantsToSubscribe !== currentlySubscribed
    if (subscriptionChanged) {
      console.log(
        `Newsletter subscription changed for user ${userId}: ${currentlySubscribed} -> ${wantsToSubscribe}`,
      )
    }

    // Generate new token if user data changed (especially password)
    const newToken = generateToken(updatedUser.id)

    // Return updated user data (excluding password)
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json(
      {
        message: 'User updated successfully',
        subscriptionChanged,
        passwordChanged: !!userData.password,
        user: {
          ...userWithoutPassword,
          token: newToken,
        },
        newsletterStatus: {
          isSubscribed: updateData.isSubscribed,
          isUnsubscribed: updateData.isUnsubscribed,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
