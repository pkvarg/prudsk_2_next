// app/api/users/login/route.js

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// @desc Auth user & get token
// @desc POST /api/users/login
// @access Public
export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ message: 'Uživatel neexistuje.' }, { status: 401 })
    }

    // Check if user has completed registration
    if (!user.isRegistered) {
      return NextResponse.json(
        {
          message:
            'Nedokončená registrace. Zkontrolujte svůj registrační email a potvrďte svou registraci kliknutím na poslaný link.',
        },
        { status: 401 },
      )
    }

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      // Return user data and token
      return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isAssistant: user.isAssistant || false,
        isSubscribed: user.isSubscribed || false,
        //favorites: user.favorites || [],
        //token: generateToken(user.id),
      })
    } else {
      return NextResponse.json({ message: 'Neplatný email alebo heslo' }, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
