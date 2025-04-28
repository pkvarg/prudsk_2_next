// app/api/users/verify/[token]/route.js

// @desc Verify user registration
// @desc GET /api/users/verify/:token
// @access Public

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const { token } = params

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    // Find user with this registration token
    const user = await prisma.user.findFirst({
      where: {
        registerToken: hashedToken,
        isRegistered: false,
      },
    })

    if (!user) {
      // Redirect to error page
      return NextResponse.redirect(new URL('/register?error=invalid-token', request.url))
    }

    // Update user to mark as registered and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isRegistered: true,
        registerToken: null,
      },
    })

    // Redirect to success page
    return NextResponse.redirect(new URL('/login?verified=true', request.url))
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.redirect(new URL('/register?error=server-error', request.url))
  }
}
