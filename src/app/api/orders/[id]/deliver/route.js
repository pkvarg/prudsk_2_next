// app/api/orders/[id]/deliver/route.js
import { NextResponse } from 'next/server'
import isAdmin from '@/lib/isAdmin'
import prisma from '@/db/db'

// @desc Update order to Delivered
// @desc PUT /api/orders/:id/deliver
// @access Private/Admin
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const user = await isAdmin()

    if (!user.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Find the order first
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
    })

    if (!order) {
      return NextResponse.json({ message: 'Objednávka nenájdená' }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const rawTracking = typeof body?.trackingNumber === 'string' ? body.trackingNumber.trim() : ''
    const trackingNumber = rawTracking ? rawTracking.slice(0, 64) : null

    // Update the order to delivered status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
        trackingNumber,
      },
    })

    // SEND HONO EMAIL
    // const apiUrl = 'http://localhost:3013/api/prudsk2next/order-admin-delivered'

    const apiUrl = 'https://hono-api.pictusweb.com/api/prudsk2next/order-admin-delivered'

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedOrder),
    })

    const data = await response.json()

    return NextResponse.json({ message: 'Update order success' }, { status: 200 })
  } catch (error) {
    console.error('Error updating order to delivered status:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
