// app/api/video/route.js
import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import isAdmin from '@/lib/isAdmin'

// @desc Fetch all videos
// @desc GET /api/video
// @access Public
export async function GET(request) {
  try {
    // Get paginated videos
    const videos = await prisma.video.findMany({})

    console.log('videos get', videos)

    return NextResponse.json({ videos }, { status: 200 })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// @desc Create a Video
// @desc POST /api/video
// @access Private/Admin
export async function POST(request) {
  try {
    const user = await isAdmin()

    if (!user.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }

    const userId = user.id

    // Create a new video with default empty values
    const createdVideo = await prisma.video.create({
      data: {
        userId: userId,
        videoTitle: '',
        code: '',
      },
    })

    return NextResponse.json(createdVideo, { status: 201 })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
