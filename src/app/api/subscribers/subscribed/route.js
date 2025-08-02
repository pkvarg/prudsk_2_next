import { NextResponse } from 'next/server'
import prisma from '@/db/db'

// @desc    Get all subscribed users
// @route   GET /api/subscribers/subscribed
// @access  Private/Admin
export async function GET() {
  try {
    // Find all users where isSubscribed is true
    const subscribers = await prisma.user.findMany({
      where: {
        isSubscribed: true,
      },
      // Exclude sensitive information
      select: {
        id: true,
        name: true,
        email: true,
        isSubscribed: true,
        createdAt: true,
        // Exclude password and other sensitive fields
      },
    })

    return NextResponse.json(subscribers)
  } catch (error) {
    console.error('Error fetching subscribers:', error)

    return NextResponse.json(
      { error: 'Nepodařilo se načíst odběratele', details: error.message },
      { status: 500 },
    )
  }
}
