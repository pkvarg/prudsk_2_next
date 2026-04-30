import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import isAdmin from '@/lib/isAdmin'
import { auth } from '@/lib/auth'

// @desc Fetch ebooks (admin sees all incl. soft-deleted; hwmr users see active only; others get nothing)
// @desc GET /api/ebooks
// @access Mixed
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeDeleted = searchParams.get('includeDeleted') === 'true'

    const session = await auth()
    let viewer = null
    if (session?.user?.email) {
      viewer = await prisma.user.findFirst({
        where: { email: session.user.email },
        select: { id: true, isAdmin: true, hwmr: true },
      })
    }

    if (viewer?.isAdmin) {
      const ebooks = await prisma.ebook.findMany({
        where: includeDeleted ? {} : { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { downloads: true } } },
      })
      return NextResponse.json({ ebooks })
    }

    if (!viewer?.hwmr) {
      return NextResponse.json({ ebooks: [] })
    }

    const ebooks = await prisma.ebook.findMany({
      where: { deletedAt: null, available: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ ebooks })
  } catch (error) {
    console.error('Error fetching ebooks:', error)
    return NextResponse.json(
      { error: 'Nepodarilo sa načítať ebooky', details: error.message },
      { status: 500 },
    )
  }
}

// @desc Create an Ebook (metadata only; files uploaded separately to hono_bun)
// @desc POST /api/ebooks
// @access Private/Admin
export async function POST(request) {
  try {
    const user = await isAdmin()

    if (!user?.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const {
      name = '',
      type = 'hwmr',
      filename = '',
      price = 0,
      language = 'sk',
      available = true,
    } = body

    const ebook = await prisma.ebook.create({
      data: {
        name,
        type,
        filename,
        price: Number(price) || 0,
        language,
        available: Boolean(available),
        deletedAt: null,
      },
    })

    return NextResponse.json(ebook, { status: 201 })
  } catch (error) {
    console.error('Error creating ebook:', error)
    return NextResponse.json(
      { error: 'Nepodarilo sa vytvoriť ebook', details: error.message },
      { status: 500 },
    )
  }
}
