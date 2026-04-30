import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import { auth } from '@/lib/auth'

// @desc Mark the ebook modal as seen so future "new-for-me" only returns newer ones
// @desc POST /api/ebooks/seen
// @access Private/hwmr
export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return new Response('Unauthorized', { status: 401 })
    }

    const viewer = await prisma.user.findFirst({
      where: { email: session.user.email },
      select: { id: true, hwmr: true },
    })

    if (!viewer?.hwmr) {
      return new Response('Forbidden', { status: 403 })
    }

    await prisma.user.update({
      where: { id: viewer.id },
      data: { lastEbookModalSeenAt: new Date() },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error marking ebook modal as seen:', error)
    return NextResponse.json(
      { error: 'Nepodarilo sa uložiť stav', details: error.message },
      { status: 500 },
    )
  }
}
