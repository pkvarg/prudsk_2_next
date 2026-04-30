// app/api/users/login/route.js

import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import bcrypt from 'bcryptjs'

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
      return NextResponse.json({ message: 'Používateľ neexistuje.' }, { status: 401 })
    }

    // Check if user has completed registration
    if (!user.isRegistered) {
      return NextResponse.json(
        {
          message:
            'Nedokončená registrácia. Skontrolujte svoj registračný email a potvrďte svoju registráciu kliknutím na poslaný odkaz.',
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
        hwmr: user.hwmr || false,
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
