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
      return NextResponse.json({ error: 'Záznam počítadla nebyl nalezen' }, { status: 404 })
    }

    // Return just the visitor count as in the original function
    return NextResponse.json(counter.visitorsCount)
  } catch (error) {
    console.error('Error getting visitor count:', error)

    return NextResponse.json(
      { error: 'Nepodařilo se získat počet návštěvníků', details: error.message },
      { status: 500 },
    )
  }
}
