import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import isAdmin from '@/lib/isAdmin'
import { auth } from '@/lib/auth'

// @desc Fetch single ebook
// @desc GET /api/ebooks/:id
// @access Mixed (admin sees all + downloads; hwmr user sees active)
export async function GET(request, { params }) {
  try {
    const { id } = await params

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Neplatný formát ID ebooku' }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    // Public/hwmr view — always available-only, even for admins (used by the /ebooks pages)
    const publicView = searchParams.get('public') === 'true'

    const session = await auth()
    let viewer = null
    if (session?.user?.email) {
      viewer = await prisma.user.findFirst({
        where: { email: session.user.email },
        select: { id: true, isAdmin: true, hwmr: true },
      })
    }

    if (viewer?.isAdmin && !publicView) {
      const ebook = await prisma.ebook.findUnique({
        where: { id },
        include: {
          downloads: {
            orderBy: { downloadedAt: 'desc' },
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      })
      if (!ebook) {
        return NextResponse.json({ error: 'Ebook nenájdený' }, { status: 404 })
      }
      return NextResponse.json(ebook)
    }

    if (!viewer?.hwmr && !viewer?.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }

    const ebook = await prisma.ebook.findFirst({
      where: { id, deletedAt: null, available: true },
    })
    if (!ebook) {
      return NextResponse.json({ error: 'Ebook nenájdený' }, { status: 404 })
    }
    return NextResponse.json(ebook)
  } catch (error) {
    console.error('Error fetching ebook:', error)
    return NextResponse.json(
      { error: 'Nepodarilo sa načítať ebook', details: error.message },
      { status: 500 },
    )
  }
}

// @desc Update ebook (admin only) — also used to save uploaded URLs
// @desc PATCH /api/ebooks/:id
// @access Private/Admin
export async function PATCH(request, { params }) {
  try {
    const user = await isAdmin()

    if (!user?.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Neplatný formát ID ebooku' }, { status: 400 })
    }

    const body = await request.json()
    const allowed = [
      'name',
      'type',
      'filename',
      'price',
      'language',
      'available',
      'qrCode',
      'mobileQR',
      'bookImage',
      'pdfUrl',
    ]
    const data = {}
    for (const key of allowed) {
      if (body[key] !== undefined) {
        data[key] = key === 'price' ? Number(body[key]) || 0 : body[key]
      }
    }

    const ebook = await prisma.ebook.update({
      where: { id },
      data,
    })

    return NextResponse.json(ebook)
  } catch (error) {
    console.error('Error updating ebook:', error)
    return NextResponse.json(
      { error: 'Nepodarilo sa aktualizovať ebook', details: error.message },
      { status: 500 },
    )
  }
}

// @desc Soft-delete ebook
// @desc DELETE /api/ebooks/:id
// @access Private/Admin
export async function DELETE(request, { params }) {
  try {
    const user = await isAdmin()

    if (!user?.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Neplatný formát ID ebooku' }, { status: 400 })
    }

    await prisma.ebook.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ message: 'Ebook bol presunutý do koša' })
  } catch (error) {
    console.error('Error deleting ebook:', error)
    return NextResponse.json(
      { error: 'Nepodarilo sa zmazať ebook', details: error.message },
      { status: 500 },
    )
  }
}
