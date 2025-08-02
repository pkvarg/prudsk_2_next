import { NextResponse } from 'next/server'
import prisma from '@/db/db'

// @desc    Get all unsubscribed users
// @route   GET /api/subscribers/unsubscribed
// @access  Private/Admin
export async function GET() {
  try {
    // Find all users where isUnsubscribed is true
    const unsubscribers = await prisma.user.findMany({
      where: {
        isUnsubscribed: true,
      },
      // Exclude sensitive information
      select: {
        id: true,
        name: true,
        email: true,
        isUnsubscribed: true,
        createdAt: true,
        // Exclude password and other sensitive fields
      },
    })

    return NextResponse.json(unsubscribers)
  } catch (error) {
    console.error('Error fetching unsubscribers:', error)

    return NextResponse.json(
      { error: 'Nepodařilo se načíst odhlášené uživatele', details: error.message },
      { status: 500 },
    )
  }
}
