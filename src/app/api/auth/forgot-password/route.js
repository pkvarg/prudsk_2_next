// app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'
import crypto from 'crypto'

export async function POST(request) {
  const prisma = new PrismaClient()
  console.log('PU', prisma.user)
  try {
    const body = await request.json()

    const { email, origURL } = body.email

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal that user doesn't exist for security reasons
      return NextResponse.json({
        message: 'Email s instrukcemi pro obnovu hesla byl odeslán, pokud účet existuje.',
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Set token expiration (1 hour from now)
    const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000)

    console.log('user in fp', user)

    console.log('Token Expiry:', new Date(Date.now() + 60 * 60 * 1000)) // Should be valid

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken,
        passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000),
      },
    })

    // Create reset URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || origURL || 'http://localhost:3015'
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`

    console.log('resetUrl in forgot password', resetUrl)

    const userData = {
      name: user.name,
      email,
      resetUrl,
      origin: 'PROUD2NEXT',
    }

    // HONO MAILER
    //const apiUrl = 'https://hono-api.pictusweb.com/api/proud2next/forgot-password'
    const apiUrl = 'http://localhost:3013/api/proud2next/forgot-password'

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
      return {
        success: false,
        message: errorData.message || 'Failed to submit form',
      }
    }

    // Return success response
    const data = await response.json()

    return NextResponse.json({
      message: 'Email s instrukcemi pro obnovu hesla byl odeslán, pokud účet existuje.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { message: 'Došlo k chybě při odesílání emailu pro obnovení hesla.' },
      { status: 500 },
    )
  }
}
