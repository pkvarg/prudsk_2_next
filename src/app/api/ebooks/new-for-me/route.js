import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import { auth } from '@/lib/auth'

// @desc Ebooks "new for me" — used by the login modal
// @desc GET /api/ebooks/new-for-me
// @access Private/hwmr
export async function GET(request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ ebooks: [] })
    }

    const viewer = await prisma.user.findFirst({
      where: { email: session.user.email },
      select: { id: true, hwmr: true, lastEbookModalSeenAt: true },
    })

    if (!viewer?.hwmr) {
      return NextResponse.json({ ebooks: [] })
    }

    const where = { deletedAt: null, available: true }
    if (viewer.lastEbookModalSeenAt) {
      where.createdAt = { gt: viewer.lastEbookModalSeenAt }
    }

    const ebooks = await prisma.ebook.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ ebooks })
  } catch (error) {
    console.error('Error fetching new ebooks:', error)
    return NextResponse.json(
      { error: 'Nepodarilo sa načítať ebooky', details: error.message },
      { status: 500 },
    )
  }
}
