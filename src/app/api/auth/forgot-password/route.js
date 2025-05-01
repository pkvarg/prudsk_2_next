// app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { email, origURL } = await request.json()

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

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: passwordResetToken,
        resetPasswordExpires: passwordResetExpires,
      },
    })

    // Create reset URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || origURL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`

    // Email content
    const message = `
      <h1>Obnovení hesla</h1>
      <p>Obdrželi jsme žádost o obnovení hesla k Vašemu účtu.</p>
      <p>Pro nastavení nového hesla klikněte na následující odkaz:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Obnovit heslo</a>
      <p>Odkaz je platný po dobu 1 hodiny.</p>
      <p>Pokud jste o obnovení hesla nepožádali, tento email můžete ignorovat.</p>
    `

    // Setup email transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Obnovení hesla',
      html: message,
    })

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
