// app/api/orders/[id]/route.js
import { NextResponse } from 'next/server'
import { auth } from '../../../../lib/auth'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'

const prisma = new PrismaClient()

// @desc Get order by ID
// @desc GET /api/orders/:id
// @access Private
export async function GET(request, { params }) {
  try {
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = params

    // Fetch order by ID with related user information
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        orderItems: true,
        shippingAddress: true,
      },
    })

    if (order) {
      return NextResponse.json(order)
    } else {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = params

    // Find the order first to verify it exists
    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    // Delete related records first (assuming cascading deletes aren't set up)
    // This is necessary because Prisma enforces referential integrity

    // Delete payment result if exists
    try {
      await prisma.paymentResult.deleteMany({
        where: { orderId: id },
      })
    } catch (error) {
      console.log('No payment results to delete or other error:', error)
      // Continue with deletion even if this fails
    }

    // Delete order items
    await prisma.orderItem.deleteMany({
      where: { orderId: id },
    })

    // Delete shipping address
    await prisma.shippingAddress.deleteMany({
      where: { orderId: id },
    })

    // Finally delete the order
    await prisma.order.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Order deleted' })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
