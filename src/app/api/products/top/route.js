import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'

const prisma = new PrismaClient()

// @desc    Get Top rated products
// @route   GET /api/products/top
// @access  Public
export async function GET() {
  try {
    // Fetch top 3 products sorted by rating in descending order
    const products = await prisma.product.findMany({
      orderBy: {
        rating: 'desc',
      },
      take: 3,
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching top products:', error)

    return NextResponse.json(
      { error: 'Failed to fetch top products', details: error.message },
      { status: 500 },
    )
  }
}
