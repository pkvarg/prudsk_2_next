import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import { auth } from '@/lib/auth'

const EXT_BY_TYPE = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}

// @desc Download the payment QR code as an image — gated by hwmr
// @desc GET /api/ebooks/:id/qr
// @access Private/hwmr
export async function GET(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return new Response('Unauthorized', { status: 401 })
    }

    const viewer = await prisma.user.findFirst({
      where: { email: session.user.email },
      select: { id: true, hwmr: true, isAdmin: true },
    })

    if (!viewer?.hwmr && !viewer?.isAdmin) {
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

    if (!ebook.qrCode) {
      return NextResponse.json({ error: 'Ebook nemá QR kód' }, { status: 404 })
    }

    const upstream = await fetch(ebook.qrCode, { cache: 'no-store' })
    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'Nepodarilo sa načítať QR kód', status: upstream.status },
        { status: 502 },
      )
    }

    const contentType = upstream.headers.get('content-type') || 'image/png'
    const urlExt = (ebook.qrCode.split('?')[0].match(/\.([a-z0-9]{2,4})$/i) || [])[1]
    const ext = EXT_BY_TYPE[contentType.split(';')[0].trim()] || urlExt?.toLowerCase() || 'png'
    const safeName = (ebook.name || 'ebook').replace(/[^\w.\-]+/g, '_')

    const buffer = await upstream.arrayBuffer()

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="qr-${safeName}.${ext}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Error downloading QR code:', error)
    return NextResponse.json(
      { error: 'Nepodarilo sa stiahnuť QR kód', details: error.message },
      { status: 500 },
    )
  }
}
