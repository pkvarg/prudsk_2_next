// app/api/users/profile/route.js
import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import isAdmin from '@/lib/isAdmin'

// @desc Get user profile
// @desc GET /api/users/profile
// @access Private
// export async function GET(request, response) {
//   const user = await isAdmin()

//   if (!user) {
//     return new Response('Unauthorized', { status: 401 })
//   }

//   const body = request.json()
//   console.log(' GET body in profile', body)

//   try {
//     const email = session.user.email

//     // Find user by email from session (cause Google has a different id in session)
//     const user = await prisma.user.findUnique({
//       where: { email: email },
//     })

//     if (user) {
//       return NextResponse.json({
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         isAdmin: user.isAdmin,
//         isAssistant: user.isAssistant || false,
//         isSubscribed: user.isSubscribed || false,
//         googleId: user.googleId || null,
//       })
//     } else {
//       return NextResponse.json({ message: 'User not found' }, { status: 404 })
//     }
//   } catch (error) {
//     console.error('Error fetching user profile:', error)
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
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const wantsToSubscribe = userData.isSubscribed
    const currentlySubscribed = existingUser.isSubscribed && !existingUser.isUnsubscribed

    // Prepare update data
    const updateData = {}

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

    // Log the newsletter subscription change for analytics
    const subscriptionChanged = wantsToSubscribe !== currentlySubscribed
    if (subscriptionChanged) {
      console.log(
        `Newsletter subscription changed for user ${userId}: ${currentlySubscribed} -> ${wantsToSubscribe}`,
      )
    }

    // Return updated user data
    return NextResponse.json(
      {
        message: 'User updated successfully',
        subscriptionChanged,
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
