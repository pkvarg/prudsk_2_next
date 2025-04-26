import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db/db'

// @desc Fetch all products
// @desc GET /api/products
// @access Public

export async function GET(request) {
  console.log('here get products')

  try {
    // Get the URL object from the request
    const { searchParams } = new URL(request.url)

    // Extract query parameters
    const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')) : 10
    const page = parseInt(searchParams.get('pageNumber') || '1')
    const keyword = searchParams.get('keyword')

    console.log('keyword', keyword)

    // Set up the where clause for search functionality
    let where = {}
    if (keyword) {
      where = {
        OR: [
          { searchName: { contains: keyword, mode: 'insensitive' } },
          { name: { contains: keyword, mode: 'insensitive' } },
        ],
      }
    }

    // Count documents for pagination
    const count = await prisma.product.count({
      where,
    })

    // Fetch products with pagination, sorting, and filtering
    const products = await prisma.product.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      take: pageSize,
      skip: pageSize * (page - 1),
    })

    // Return successful response with pagination info
    return NextResponse.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
    })
  } catch (error) {
    console.error('Error fetching products:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch products',
      },
      {
        status: 500,
      },
    )
  }
}

// @desc Create a product
// @desc POST /api/products
// @access Private/Admin
export async function POST(request) {
  try {
    // Get the authenticated user from the session
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Assuming you store the MongoDB user ID in the session
    const userId = session.user.id

    // Create the product with default values
    const createdProduct = await prisma.product.create({
      data: {
        name: '',
        price: 0,
        discount: 0,
        discountedPrice: 0,
        userId: userId, // Link to the authenticated user
        image: '/images/sample.jpg',
        author: '',
        category: '',
        countInStock: 0,
        numReviews: 0,
        description: '',
        excerpt: {},
        catalog: '',
        weight: '',
        related: {},
        related2: {},
        related3: {},
        tags: '',
        language: '',
        binding: '',
        pages: '',
        isbn: '',
        year: '',
        searchName: '',
      },
    })

    return NextResponse.json(createdProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)

    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 },
    )
  }
}
