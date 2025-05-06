// app/api/users/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../prisma/generated/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { headers } from 'next/headers'
import { auth } from '../../../lib/auth'

const prisma = new PrismaClient()

async function createRegisterToken(email, url) {
  const token = crypto.randomBytes(32).toString('hex')
  const registerToken = crypto.createHash('sha256').update(token).digest('hex')

  const encodedEmail = encodeURIComponent(email)

  const registerURL = `${url}/register/${encodedEmail}/${registerToken}`

  const data = {
    registerToken,
    registerURL,
  }

  return data
}

// @desc Register a new user
// @desc POST /api/users/
// @access Public
export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Get the host from headers
    const headersList = await headers()
    const host = headersList.get('host')

    // Determine protocol (in production, Next.js is typically behind HTTPS)
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const baseUrl = `${protocol}://${host}`

    // Create registration token
    const { registerToken, registerURL } = await createRegisterToken(email, baseUrl)

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: { email },
    })

    if (userExists) {
      return NextResponse.json({ message: 'Uživatel již existuje' }, { status: 400 })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isRegistered: false,
        registerToken,
        isAdmin: false, // Default values
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
      },
    })

    if (user) {
      // Send welcome email with verification link
      const userData = {
        name: user.name,
        email: user.email,
        url: registerURL,
        origin: 'PROUD2NEXT',
        isGoogle: false,
      }

      // call API

      //const apiUrl = 'https://hono-api.pictusweb.com/api/proud2next/register'
      const apiUrl = 'http://localhost:3013/api/proud2next/register'

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

      return NextResponse.json('OK', { status: 201 })
    } else {
      return NextResponse.json({ message: 'Neplatná data uživatele' }, { status: 400 })
    }
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: error.message || 'An error occurred during registration' },
      { status: 500 },
    )
  }
}

// @desc Get all users
// @desc GET /api/users
// @access Private/Admin
export async function GET(request) {
  try {
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Get all users
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
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
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
