// app/api/orders/[id]/failed-payment/route.js

// @desc Send failed payment notification
// @desc POST /api/orders/:id/failed-payment-notif
// @access Private
import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import { auth } from '@/lib/auth'

export async function POST(request, { params }) {
  try {
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params

    // Find the order with all necessary related data
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

    // Prepare data for email
    const emailData = {
      email: order.email || order.user?.email,
      name: order.name || order.user?.name,
      orderNumber: order.orderNumber,
      totalPrice: order.totalPrice,
      orderId: order.id,
    }

    // Send failed payment notification email
    try {
      await new Email(emailData, '', '').sendFailedPaymentNotificationgEmail()
    } catch (error) {
      console.error('Error sending failed payment notification email:', error)
      // Continue even if email fails
    }

    return NextResponse.json('failed-notif-sent')
  } catch (error) {
    console.error('Error processing failed payment notification:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
