// app/api/orders/[id]/paid/route.js
import { NextResponse } from 'next/server'
import { auth } from '../../../../lib/auth'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'

const prisma = new PrismaClient()

// @desc Update order to Paid No Card (from Admin menu)
// @desc PUT /api/orders/:id/paid
// @access Private (Admin only)
export async function PUT(request, { params }) {
  try {
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = params

    // Find the order first
    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    // Update the order payment status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        isPaid: true,
        paidAt: new Date(),
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
    console.error('Error updating order payment status:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
