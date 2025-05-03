// src/app/api/users/google/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function POST(request) {
  const prisma = new PrismaClient()
  try {
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
        //    Create new user
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
        // Send welcome email to new Google user
        // await new Email(createdUser, url).sendWelcomeGoogle();
        // Return created user

        return NextResponse.json({
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          isAdmin: createdUser.isAdmin,
          isAssistant: createdUser.isAssistant,
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  } catch (error) {
    console.error('Error in users google route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
