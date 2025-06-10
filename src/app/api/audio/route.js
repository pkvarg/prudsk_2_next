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

    const userId = user.id

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
      { error: 'Failed to update audio', details: error.message },
      { status: 500 },
    )
  }
}
