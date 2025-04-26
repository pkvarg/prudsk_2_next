import { NextResponse } from 'next/server'
import prisma from '@/db/db'

// @desc Fetch single banner
// @desc GET /api/banner/:id
// @access Public
export async function GET(request, { params }) {
  try {
    // In Next.js 15, we need to await the id
    const id = await params.id

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

import { NextResponse } from 'next/server'
import prisma from '@/db/db'

// @desc Delete a banner
// @desc DELETE /api/banner/:id
// @access Private/Admin
export async function DELETE(request, { params }) {
  try {
    // In Next.js 15, we need to await the id
    const id = await params.id

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

import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// @desc    Update a banner
// @route   PUT /api/banner/:id
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
