// app/api/video/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'

const prisma = new PrismaClient()

// @desc Fetch all videos
// @desc GET /api/video
// @access Public
export async function GET(request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const pageNumber = Number(searchParams.get('pageNumber')) || 1
    const keyword = searchParams.get('keyword') || ''
    const pageSize = 10

    // Build where condition based on keyword
    const whereCondition = keyword
      ? {
          name: {
            contains: keyword,
            mode: 'insensitive', // Case insensitive search
          },
        }
      : {}

    // Count total matching videos
    const count = await prisma.video.count({
      where: whereCondition,
    })

    // Get paginated videos
    const videos = await prisma.video.findMany({
      where: whereCondition,
      take: pageSize,
      skip: pageSize * (pageNumber - 1),
      orderBy: {
        createdAt: 'desc', // Most recent videos first
      },
    })

    return NextResponse.json({
      videos,
      page: pageNumber,
      pages: Math.ceil(count / pageSize),
    })
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
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { message: 'Not authorized - admin access required' },
        { status: 401 },
      )
    }

    // Create a new video with default empty values
    const createdVideo = await prisma.video.create({
      data: {
        user: {
          connect: { id: session.user.id },
        },
        videoTitle: '',
        code: '',
        // Add any other required fields with default values here
      },
    })

    return NextResponse.json(createdVideo, { status: 201 })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
