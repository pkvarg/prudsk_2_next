import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'
import { auth } from '../../../../lib/auth'

const prisma = new PrismaClient()

// @desc Fetch all banners
// @desc GET /api/banner
// @access Public
export async function GET(request) {
  try {
    // Get the URL object from the request
    const { searchParams } = new URL(request.url)

    // Extract query parameters
    const pageSize = 10
    const page = parseInt(searchParams.get('pageNumber') || '1')
    const keyword = searchParams.get('keyword')

    // Set up the where clause for search functionality
    let where = {}
    if (keyword) {
      where = {
        OR: [{ bannerTitle: { contains: keyword, mode: 'insensitive' } }],
      }
    }

    // Count total documents for pagination
    const count = await prisma.banner.count({
      where,
    })

    // Fetch banners with pagination and filtering
    const banners = await prisma.banner.findMany({
      where,
      take: pageSize,
      skip: pageSize * (page - 1),
    })

    // Return successful response with pagination info
    return NextResponse.json({
      banners,
      page,
      pages: Math.ceil(count / pageSize),
    })
  } catch (error) {
    console.error('Error fetching banners:', error)

    return NextResponse.json(
      { error: 'Failed to fetch banners', details: error.message },
      { status: 500 },
    )
  }
}

// @desc Create a Banner
// @desc POST /api/banner
// @access Private/Admin
export async function POST(request) {
  try {
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }
    // Assuming you store the MongoDB user ID in the session
    const userId = session.user.id

    // Create the banner with default values
    const createdBanner = await prisma.banner.create({
      data: {
        userId: userId, // Link to the authenticated user
        bannerTitle: '',
        image: '',
        category: '',
      },
    })

    return NextResponse.json(createdBanner, { status: 201 })
  } catch (error) {
    console.error('Error creating banner:', error)

    return NextResponse.json(
      { error: 'Failed to create banner', details: error.message },
      { status: 500 },
    )
  }
}
