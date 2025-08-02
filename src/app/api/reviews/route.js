import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import { auth } from '@/lib/auth'
import isAdmin from '@/lib/isAdmin'

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private
export async function GET(request) {
  try {
    // Find the review by comment
    const reviews = await prisma.review.findMany({})

    if (!reviews) {
      return NextResponse.json({ error: 'Žádné recenze nebyly nalezeny' }, { status: 404 })
    }

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error getting review:', error)

    return NextResponse.json(
      { error: 'Nepodařilo se získat recenzi', details: error.message },
      { status: 500 },
    )
  }
}
