// /api/library/route.js
import { NextResponse } from 'next/server'
import prisma from '@/db/db'

// @desc Fetch products with excerpts for library
// @desc GET /api/library
// @access Public

export async function GET(request) {
  console.log('here get library products')

  try {
    // Get the URL object from the request
    const { searchParams } = new URL(request.url)

    // Extract query parameters
    const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')) : 2
    const page = parseInt(searchParams.get('pageNumber') || '1')
    const keyword = searchParams.get('keyword')

    // For MongoDB with Prisma, we might need to use raw queries
    // or fetch and filter in JavaScript due to embedded object limitations

    let baseQuery = {}

    // Add keyword search if provided
    if (keyword) {
      baseQuery = {
        OR: [
          { searchName: { contains: keyword, mode: 'insensitive' } },
          { name: { contains: keyword, mode: 'insensitive' } },
        ],
      }
    }

    // Fetch all matching products first
    const allProducts = await prisma.product.findMany({
      where: baseQuery,
      orderBy: {
        name: 'asc',
      },
    })

    // Filter products that have non-empty excerpts
    const productsWithExcerpts = allProducts.filter(
      (product) =>
        product.excerpt && product.excerpt.excerpt && product.excerpt.excerpt.trim() !== '',
    )

    // Calculate pagination manually
    const count = productsWithExcerpts.length
    const startIndex = pageSize * (page - 1)
    const endIndex = startIndex + pageSize
    const products = productsWithExcerpts.slice(startIndex, endIndex)

    // Return successful response with pagination info
    return NextResponse.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    })
  } catch (error) {
    console.error('Error fetching library products:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch library products',
      },
      {
        status: 500,
      },
    )
  }
}
