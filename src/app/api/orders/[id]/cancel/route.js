// app/api/orders/[id]/cancel/route.js

// @desc Update order to Cancelled
// @desc PUT /api/orders/:id/cancel
// @access Private/Admin

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { message: 'Not authorized - admin access required' },
        { status: 401 },
      )
    }

    const { id } = params

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
