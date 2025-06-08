import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import isAdmin from '@/lib/isAdmin'

// @desc Fetch all audios
// @desc GET /api/audio
// @access Public
export async function GET(request) {
  try {
    const audios = await prisma.audio.findMany({})

    return NextResponse.json(
      {
        audios,
      },
      { status: 200 },
    )

    // Get the URL object from the request
    // const { searchParams } = new URL(request.url)

    // // Extract query parameters
    // const pageSize = 1000 // Fixed page size as in original
    // const page = parseInt(searchParams.get('pageNumber') || '1')
    // const keyword = searchParams.get('keyword')

    // // Set up the where clause for search functionality
    // let where = {}
    // if (keyword) {
    //   where = {
    //     OR: [{ audioTitle: { contains: keyword, mode: 'insensitive' } }],
    //   }
    // }

    // // Count total documents for pagination
    // const count = await prisma.audio.count({
    //   where,
    // })

    // // Fetch audios with pagination and filtering
    // const audios = await prisma.audio.findMany({
    //   where,
    //   take: pageSize,
    //   skip: pageSize * (page - 1),
    // })

    // // Return successful response with pagination info
    // return NextResponse.json({
    //   audios,
    //   page,
    //   pages: Math.ceil(count / pageSize),
    // })
  } catch (error) {
    console.error('Error fetching audios:', error)

    return NextResponse.json(
      { error: 'Failed to fetch audios', details: error.message },
      { status: 500 },
    )
  }
}

// @desc Create an Audio
// @desc POST /api/audio
// @access Private/Admin
export async function POST(request) {
  try {
    const user = await isAdmin()

    if (!user.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }
    // Assuming you store the MongoDB user ID in the session
    const userId = user.id

    console.log('userId', userId)

    // Create the audio with default values
    const createdAudio = await prisma.audio.create({
      data: {
        userId: userId, // Link to the authenticated user
        audioTitle: '',
        mp3file: '',
        category: '',
        subcategory: '',
      },
    })

    console.log('created audio', createdAudio)

    return NextResponse.json(createdAudio, { status: 201 })
  } catch (error) {
    console.error('Error creating audio:', error)

    return NextResponse.json(
      { error: 'Failed to create audio', details: error.message },
      { status: 500 },
    )
  }
}
