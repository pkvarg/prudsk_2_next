// app/api/users/route.js

// @desc Register a new user
// @desc POST /api/users/
// @access Public

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import Email from '@/utils/email'
import { headers } from 'next/headers'

const prisma = new PrismaClient()

// Helper function to create registration token
const createRegisterToken = async (email, baseUrl) => {
  // Create a random token
  const registerToken = crypto.randomBytes(32).toString('hex')

  // Hash the token
  const hashedToken = crypto.createHash('sha256').update(registerToken).digest('hex')

  // Create the registration URL
  const registerURL = `${baseUrl}/api/users/verify/${registerToken}`

  return { registerToken: hashedToken, registerURL }
}

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Get the host from headers
    const headersList = headers()
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
        favorites: [],
      },
    })

    if (user) {
      // Send welcome email with verification link
      const userData = {
        name: user.name,
        email: user.email,
      }

      await new Email(userData, registerURL).sendWelcome()

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

// app/api/users/route.js

// @desc Get all users
// @desc GET /api/users
// @access Private/Admin
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { message: 'Not authorized - admin access required' },
        { status: 401 },
      )
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
