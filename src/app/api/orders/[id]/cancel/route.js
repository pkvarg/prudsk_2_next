// app/api/orders/[id]/cancel/route.js
import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import isAdmin from '@/lib/isAdmin'

// @desc Update order to Canceled
// @desc PUT /api/orders/:id/cancel
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
      where: { id },
    })

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    // Update the order to cancelled status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        isCancelled: true,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order to cancelled status:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
