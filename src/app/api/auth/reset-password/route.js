// app/api/auth/reset-password/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { token, password } = await request.json()

    // Hash the token from the URL
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    // Find user with valid token that hasn't expired
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Neplatný nebo expirovaný token pro obnovu hesla.' },
        { status: 400 },
      )
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Update user's password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    })

    return NextResponse.json({ message: 'Heslo bylo úspěšně aktualizováno.' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ message: 'Došlo k chybě při obnově hesla.' }, { status: 500 })
  }
}
