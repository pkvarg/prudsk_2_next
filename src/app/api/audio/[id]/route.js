import { NextResponse } from 'next/server'
import prisma from '@/db/db'

// @desc Fetch single audio
// @desc GET /api/audio/:id
// @access Public
export async function GET(request, { params }) {
  try {
    // In Next.js 15, we need to await the id
    const id = await params.id

    // Validate the ID format (MongoDB ObjectID)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Invalid audio ID format' }, { status: 400 })
    }

    // Find the audio by ID
    const audio = await prisma.audio.findUnique({
      where: { id },
    })

    if (audio) {
      return NextResponse.json(audio)
    } else {
      return NextResponse.json({ error: 'Audio not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error fetching audio:', error)

    return NextResponse.json(
      { error: 'Failed to fetch audio', details: error.message },
      { status: 500 },
    )
  }
}

// @desc Delete an audio
// @desc DELETE /api/audio/:id
// @access Private/Admin
export async function DELETE(request, { params }) {
  try {
    // In Next.js 15, we need to await the id
    const id = await params.id

    // Validate the ID format (MongoDB ObjectID)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Invalid audio ID format' }, { status: 400 })
    }

    // Check if audio exists
    const audio = await prisma.audio.findUnique({
      where: { id },
    })

    if (!audio) {
      return NextResponse.json({ error: 'Audio not found' }, { status: 404 })
    }

    // Delete the audio
    await prisma.audio.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Audio removed' })
  } catch (error) {
    console.error('Error deleting audio:', error)

    return NextResponse.json(
      { error: 'Failed to delete audio', details: error.message },
      { status: 500 },
    )
  }
}

// @desc    Update an audio
// @route   PUT /api/audio/:id
// @access  Private/Admin
export async function PUT(request, { params }) {
  try {
    // Get the authenticated user from the session
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get user ID from session
    const userId = session.user.id

    // In Next.js 15, we need to await the id
    const id = await params.id

    // Validate the ID format (MongoDB ObjectID)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Invalid audio ID format' }, { status: 400 })
    }

    // Parse request body
    const body = await request.json()
    const { audioTitle, mp3file, category, subcategory } = body

    // Check if audio exists
    const audio = await prisma.audio.findUnique({
      where: { id },
    })

    if (!audio) {
      return NextResponse.json({ error: 'Audio not found' }, { status: 404 })
    }

    // Update the audio
    const updatedAudio = await prisma.audio.update({
      where: { id },
      data: {
        userId,
        audioTitle,
        mp3file,
        category,
        subcategory,
      },
    })

    return NextResponse.json(updatedAudio)
  } catch (error) {
    console.error('Error updating audio:', error)

    return NextResponse.json(
      { error: 'Failed to update audio', details: error.message },
      { status: 500 },
    )
  }
}
