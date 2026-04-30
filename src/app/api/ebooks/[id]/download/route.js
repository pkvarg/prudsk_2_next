import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import { auth } from '@/lib/auth'

// @desc Download an ebook PDF — gated by hwmr + records the download
// @desc GET /api/ebooks/:id/download
// @access Private/hwmr
export async function GET(request, { params }) {
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

    const { id } = await params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Neplatný formát ID ebooku' }, { status: 400 })
    }

    const ebook = await prisma.ebook.findFirst({
      where: { id, deletedAt: null, available: true },
    })

    if (!ebook) {
      return NextResponse.json({ error: 'Ebook nenájdený' }, { status: 404 })
    }

    if (!ebook.pdfUrl) {
      return NextResponse.json({ error: 'Ebook nemá nahraté PDF' }, { status: 404 })
    }

    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
    const honoBase = isDevelopment
      ? 'http://localhost:3013'
      : 'https://hono-api.pictusweb.com'
    const internalUrl = `${honoBase}/api/internal/prudsk2next/ebooks/${id}/pdf`

    const secret = process.env.HONO_EBOOK_INTERNAL_SECRET
    if (!secret) {
      console.error('HONO_EBOOK_INTERNAL_SECRET not set')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const upstream = await fetch(internalUrl, {
      headers: { 'X-Internal-Token': secret },
    })

    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'Nepodarilo sa načítať PDF', status: upstream.status },
        { status: 502 },
      )
    }

    await prisma.ebookDownload.create({
      data: { userId: viewer.id, ebookId: id },
    })

    await prisma.user.update({
      where: { id: viewer.id },
      data: { lastEbookDownloadAt: new Date() },
    })

    const buffer = await upstream.arrayBuffer()
    const safeName = (ebook.filename || ebook.name || 'ebook').replace(/[^\w.\-]+/g, '_')
    const downloadName = safeName.toLowerCase().endsWith('.pdf') ? safeName : `${safeName}.pdf`

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${downloadName}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Error downloading ebook:', error)
    return NextResponse.json(
      { error: 'Nepodarilo sa stiahnuť ebook', details: error.message },
      { status: 500 },
    )
  }
}
