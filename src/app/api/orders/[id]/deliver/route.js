// app/api/orders/[id]/deliver/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'
import Email from '@/utils/email'

const prisma = new PrismaClient()

// @desc Update order to Delivered
// @desc PUT /api/orders/:id/deliver
// @access Private/Admin
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

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    // Update the order to delivered status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
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

    // Prepare order data for email
    const emailData = {
      email: updatedOrder.email || updatedOrder.user?.email,
      name: updatedOrder.name || updatedOrder.user?.name,
      orderNumber: updatedOrder.orderNumber,
      orderItems: updatedOrder.orderItems,
      addressinfo: updatedOrder.shippingAddress
        ? `${updatedOrder.shippingAddress.address}, ${updatedOrder.shippingAddress.city}, ${updatedOrder.shippingAddress.postalCode}, ${updatedOrder.shippingAddress.country}`
        : '',
      totalPrice: updatedOrder.totalPrice,
    }

    // Send delivery notification email
    try {
      await new Email(emailData, '', '').sendDeliveredNotificationEmail()
    } catch (error) {
      console.error('Failed to send delivery notification email:', error)
      // Continue even if email fails
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order to delivered status:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
