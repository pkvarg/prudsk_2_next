import { NextResponse } from 'next/server'
import isAdmin from '@/lib/isAdmin'
import prisma from '@/db/db'

// @desc Fetch single banner
// @desc GET /api/banner/:id
// @access Public
export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Validate the ID format (MongoDB ObjectID)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Invalid banner ID format' }, { status: 400 })
    }

    // Find the banner by ID
    const banner = await prisma.banner.findUnique({
      where: { id },
    })

    if (banner) {
      return NextResponse.json(banner)
    } else {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error fetching banner:', error)

    return NextResponse.json(
      { error: 'Failed to fetch banner', details: error.message },
      { status: 500 },
    )
  }
}

// @desc Delete a banner
// @desc DELETE /api/banner/:id
// @access Private/Admin
export async function DELETE(request, { params }) {
  try {
    const user = await isAdmin()

    if (!user.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }
    const { id } = await params

    // Validate the ID format (MongoDB ObjectID)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Invalid banner ID format' }, { status: 400 })
    }

    // Check if banner exists
    const banner = await prisma.banner.findUnique({
      where: { id },
    })

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    // Delete the banner
    await prisma.banner.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Banner removed' })
  } catch (error) {
    console.error('Error deleting banner:', error)

    return NextResponse.json(
      { error: 'Failed to delete banner', details: error.message },
      { status: 500 },
    )
  }
}

// @desc    Update a banner
// @route   PUT /api/banner/:id
// @access  Private/Admin
export async function PUT(request, { params }) {
  try {
    const user = await isAdmin()

    if (!user.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }
    const userId = user.id

    const { id } = await params

    // Validate the ID format (MongoDB ObjectID)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Invalid banner ID format' }, { status: 400 })
    }

    // Parse request body
    const body = await request.json()
    const { bannerTitle, image, category } = body

    // Check if banner exists
    const banner = await prisma.banner.findUnique({
      where: { id },
    })

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    // Update the banner
    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: {
        userId,
        bannerTitle,
        image,
        category,
      },
    })

    return NextResponse.json(updatedBanner)
  } catch (error) {
    console.error('Error updating banner:', error)

    return NextResponse.json(
      { error: 'Failed to update banner', details: error.message },
      { status: 500 },
    )
  }
}
