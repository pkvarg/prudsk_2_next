import { NextResponse } from 'next/server'
import prisma from '@/db/db'

// Hard-coded ID as in the original code
const id = '65fed9947585f070bd06e836'

// @desc    Get visitor count
// @route   GET /api/counter/count
// @access  Public
export async function GET(request) {
  try {
    const counter = await prisma.counter.findUnique({
      where: { id },
    })

    if (!counter) {
      return NextResponse.json({ error: 'Counter record not found' }, { status: 404 })
    }

    // Return just the visitor count as in the original function
    return NextResponse.json(counter.visitorsCount)
  } catch (error) {
    console.error('Error getting visitor count:', error)

    return NextResponse.json(
      { error: 'Failed to get visitor count', details: error.message },
      { status: 500 },
    )
  }
}
