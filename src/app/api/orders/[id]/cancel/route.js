// app/api/orders/[id]/cancel/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'
import { auth } from '../../../../lib/auth'

const prisma = new PrismaClient()

// @desc Update order to Cancelled
// @desc PUT /api/orders/:id/cancel
// @access Private/Admin
export async function PUT(request, { params }) {
  try {
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params

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
        cancelledAt: new Date(), // Optional: add this field to your schema if you want to track when it was cancelled
      },
      include: {
        orderItems: true,
        shippingAddress: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order to cancelled status:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
