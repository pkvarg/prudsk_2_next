// src/app/api/users/google/route.js
import { NextResponse } from 'next/server'
import prisma from '@/db/db'

export async function POST(request) {
  try {
    // Parse request body to get sessionEmail
    const body = await request.json()
    const { name, email, id } = body.user

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

      const url = 'https://proudzivota.cz'

      // Send welcome email with website link
      const userData = {
        name: createdUser.name,
        email: createdUser.email,
        url,
        origin: 'PROUD2NEXT',
        isGoogle: true,
      }

      const apiUrl = 'https://hono-api.pictusweb.com/api/proud2next/register'
      // const apiUrl = 'http://localhost:3013/api/proud2next/register'

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
