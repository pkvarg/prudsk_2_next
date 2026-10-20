import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import isAdmin from '@/lib/isAdmin'

// @desc    Get all unsubscribed users
// @route   GET /api/subscribers/unsubscribed
// @access  Private/Admin
export async function GET() {
  const user = await isAdmin()
  if (!user?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

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
      { error: 'Nepodarilo sa načítať odhlášené uživatele', details: error.message },
      { status: 500 },
    )
  }
}
