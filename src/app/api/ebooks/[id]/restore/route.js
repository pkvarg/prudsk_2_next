import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import isAdmin from '@/lib/isAdmin'

// @desc Restore a soft-deleted ebook
// @desc POST /api/ebooks/:id/restore
// @access Private/Admin
export async function POST(request, { params }) {
  try {
    const user = await isAdmin()

    if (!user?.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Neplatný formát ID ebooku' }, { status: 400 })
    }

    const ebook = await prisma.ebook.update({
      where: { id },
      data: { deletedAt: null },
    })

    return NextResponse.json(ebook)
  } catch (error) {
    console.error('Error restoring ebook:', error)
    return NextResponse.json(
      { error: 'Nepodarilo sa obnoviť ebook', details: error.message },
      { status: 500 },
    )
  }
}
