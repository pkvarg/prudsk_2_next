// src/app/api/users/google/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function POST(request) {
  const prisma = new PrismaClient()
  try {
    // Parse request body
    const { data } = await request

    console.log('email here', data)
    process.exit(0)
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
      const createdUser = await prisma.user.create({
        data: {
          name: dataInfo.name,
          email: dataInfo.email,
          googleId: dataInfo.googleId,
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
    console.error('Error in users google route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
