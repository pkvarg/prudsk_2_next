import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import isAdmin from '@/lib/isAdmin'

// @desc Fetch all banners
// @desc GET /api/banner
// @access Public
export async function GET(request) {
  try {
    const banners = await prisma.banner.findMany({})

    // Return successful response with pagination info
    return NextResponse.json({ banners }, { status: 200 })
  } catch (error) {
    console.error('Error fetching banners:', error)

    return NextResponse.json(
      { error: 'Nepodařilo se načíst bannery', details: error.message },
      { status: 500 },
    )
  }
}

// @desc Create a Banner
// @desc POST /api/banner
// @access Private/Admin
export async function POST(request) {
  try {
    const user = await isAdmin()

    if (!user.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }

    const userId = user.id

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
      { error: 'Nepodařilo se vytvořit banner', details: error.message },
      { status: 500 },
    )
  }
}
