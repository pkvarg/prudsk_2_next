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

    console.log('id', id)

    // Find the order first
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
    })

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    // Update the order to delivered status
    await prisma.order.update({
      where: { id },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    })

    // TODO EMAIL

    // // Prepare order data for email
    // const emailData = {
    //   email: updatedOrder.email || updatedOrder.user?.email,
    //   name: updatedOrder.name || updatedOrder.user?.name,
    //   orderNumber: updatedOrder.orderNumber,
    //   orderItems: updatedOrder.orderItems,
    //   addressinfo: updatedOrder.shippingAddress
    //     ? `${updatedOrder.shippingAddress.address}, ${updatedOrder.shippingAddress.city}, ${updatedOrder.shippingAddress.postalCode}, ${updatedOrder.shippingAddress.country}`
    //     : '',
    //   totalPrice: updatedOrder.totalPrice,
    // }

    // // Send delivery notification email
    // try {
    //   await new Email(emailData, '', '').sendDeliveredNotificationEmail()
    // } catch (error) {
    //   console.error('Failed to send delivery notification email:', error)
    //   // Continue even if email fails
    // }

    return NextResponse.json({ message: 'Update order success' }, { status: 200 })
  } catch (error) {
    console.error('Error updating order to delivered status:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
