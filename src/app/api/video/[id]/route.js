// app/api/video/[id]/route.js

import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import isAdmin from '@/lib/isAdmin'

// @desc Fetch single video
// @desc GET /api/video/:id
// @access Public
export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Find video by ID
    const video = await prisma.video.findUnique({
      where: { id },
    })

    if (!video) {
      return NextResponse.json({ message: 'Video nebylo nalezeno' }, { status: 404 })
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error fetching video:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// @desc Delete a video
// @desc DELETE /api/video/:id
// @access Private/Admin
export async function DELETE(request, { params }) {
  try {
    const user = await isAdmin()

    if (!user.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params

    // Find the video first to verify it exists
    const video = await prisma.video.findUnique({
      where: { id },
    })

    if (!video) {
      return NextResponse.json({ message: 'Video nebylo nalezeno' }, { status: 404 })
    }

    // Delete the video
    await prisma.video.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Video bylo odstraněno' })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// @desc Update a video
// @desc PUT /api/video/:id
// @access Private/Admin
export async function PUT(request, { params }) {
  try {
    const user = await isAdmin()

    if (!user.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params
    const userId = user.id
    const body = await request.json()
    const { videoTitle, code } = body

    // Find the video first to verify it exists
    const video = await prisma.video.findUnique({
      where: { id },
    })

    if (!video) {
      return NextResponse.json({ message: 'Video nebylo nalezeno' }, { status: 404 })
    }

    // Update the video
    const updatedVideo = await prisma.video.update({
      where: { id },
      data: {
        userId: userId,
        videoTitle,
        code,
      },
    })

    return NextResponse.json(updatedVideo)
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
