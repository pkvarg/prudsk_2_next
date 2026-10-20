// src/app/api/users/google/route.js
import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import { auth } from '@/lib/auth'

export async function POST(request) {
  try {
    // Identity comes from the signed-in session, never from the request body; otherwise anyone
    // could read another user's account data or create accounts in their name.
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const { name, email, id } = session.user

    // Find existing user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      // Return existing user
      return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isAssistant: user.isAssistant,
        isSubscribed: user.isSubscribed,
        hwmr: user.hwmr || false,
      })
    } else {
      // Create new user
      const createdUser = await prisma.user.upsert({
        where: { email },
        update: {}, // If user exists, don't update anything
        create: {
          name,
          email,
          googleId: id,
          isAdmin: false,
          isAssistant: false,
          isRegistered: true,
        },
      })

      const url = 'https://prud.sk'

      // Send welcome email with website link
      const userData = {
        name: createdUser.name,
        email: createdUser.email,
        url,
        origin: 'prudsk2next',
        isGoogle: true,
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_HONO_API_URL || 'https://hono-api.pictusweb.com'}/api/prudsk2next/register`

      try {
        // Make the API request
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })

        // Check if request was successful
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Email service error:', errorData.message || 'Failed to send email')
          // Don't fail the user creation if email fails - just log it
        }
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
        // Continue with user creation even if email fails
      }

      // Return created user (regardless of email status)
      return NextResponse.json({
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        isAssistant: createdUser.isAssistant,
      })
    }
  } catch (error) {
    console.error('Error in users google route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
