// app/api/users/[email]/[token]/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// @desc Check registration token and activate user
// @desc GET /api/users/:email/:token/
// @access Public
export async function GET(request, { params }) {
  try {
    const prms = await params
    const { email, token } = prms

    console.log('here in reg em tok', email, token)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Check if user exists
    if (!user) {
      return NextResponse.json({ message: 'Uživatel nenalezen' }, { status: 404 })
    }

    // Check if token matches
    const checkToken = user.registerToken === token

    // The commented-out expiry check from the original code
    // could be implemented here if needed
    /*
    let expiry;
    const date = new Date();
    const dateISO = date.toISOString();
    
    if (user.registerTokenExpires) {
      const tokenExpiry = user.registerTokenExpires.toISOString();
      if (tokenExpiry > dateISO) {
        expiry = true;
      } else {
        expiry = false;
        return NextResponse.json({ message: 'Platnost odkazu vypršela' }, { status: 400 });
      }
    }
    */

    if (checkToken) {
      // Update user as registered and clear token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isRegistered: true,
          registerToken: null,
          // registerTokenExpires: null (if you implement token expiry)
        },
      })

      return NextResponse.json('ok')
    } else {
      return NextResponse.json('Neplatný link!', { status: 400 })
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
