import { NextResponse } from 'next/server'
import prisma from '@/db/db'

// Hard-coded ID as in the original code
const id = '65fed9947585f070bd06e836'

// @desc    Increase visitor count
// @route   PUT /api/counter/increase
// @access  Public
export async function PUT(request) {
  try {
    // Check for the existence of the counter record
    const counter = await prisma.counter.findUnique({
      where: { id },
    })

    if (!counter) {
      return NextResponse.json({ error: 'Counter record not found' }, { status: 404 })
    }

    // Get current URL path to match original logic
    const url = new URL(request.url).pathname
    const path = url.split('/').pop() // Get the last segment

    // Check if the URL ends with 'increase'
    if (path === 'increase') {
      // Update the counter by incrementing the current value
      const updatedCounter = await prisma.counter.update({
        where: { id },
        data: {
          visitorsCount: {
            increment: 1,
          },
        },
      })

      return NextResponse.json(updatedCounter)
    } else {
      console.log('unknown url')
      return NextResponse.json({ error: 'Invalid URL path' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error increasing visitor count:', error)

    return NextResponse.json(
      { error: 'Failed to increase visitor count', details: error.message },
      { status: 500 },
    )
  }
}
