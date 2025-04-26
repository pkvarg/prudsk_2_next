import { NextResponse } from 'next/server'
import prisma from '@/db/db'

// Hard-coded ID as in the original code
const id = '65fed9947585f070bd06e836'

// @desc    Get visitor count
// @route   GET /api/counter/count
// @access  Public
export async function GET(request) {
  try {
    // Get current URL path to match original logic
    const url = new URL(request.url).pathname
    const path = url.split('/').pop() // Get the last segment

    // Check if the URL ends with 'counter'
    if (path === 'counter') {
      // Find the counter record
      const counter = await prisma.counter.findUnique({
        where: { id },
      })

      if (!counter) {
        return NextResponse.json({ error: 'Counter record not found' }, { status: 404 })
      }

      // Return just the visitor count as in the original function
      return NextResponse.json(counter.visitorsCount)
    } else {
      console.log('Unknown url')
      return NextResponse.json({ error: 'Invalid URL path' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error getting visitor count:', error)

    return NextResponse.json(
      { error: 'Failed to get visitor count', details: error.message },
      { status: 500 },
    )
  }
}
