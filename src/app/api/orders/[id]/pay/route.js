// app/api/orders/[id]/pay/route.js
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/db/db'

// @desc Update order to Paid
// @desc PUT /api/orders/:id/pay
// @access Private
export async function PUT(request, { params }) {
  try {
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params
    const paymentData = await request.json()

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
        shippingAddress: true,
      },
    })

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    // Update order payment details
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          create: {
            paymentId: paymentData.id,
            status: paymentData.status,
            updateTime: paymentData.update_time,
            emailAddress: paymentData.payer.email_address,
            address: paymentData.payer.address || '',
            name: paymentData.payer.name,
          },
        },
      },
      include: {
        orderItems: true,
        shippingAddress: true,
        paymentResult: true,
      },
    })

    const discounts = order.discounts
    const orderNumber = order.orderNumber

    // Prepare data for payment success email
    const updatedOrderLoop = updatedOrder.orderItems
    const updatedOrderProductsCount = updatedOrderLoop.length
    let updatedOrderProductsObject = {}

    updatedOrderLoop.forEach((item, i) => {
      if (discounts[i] && discounts[i].discount > 0) {
        updatedOrderProductsObject[i] =
          ' ' +
          item.qty +
          ' x ' +
          item.name +
          ' Kč' +
          item.price +
          ' zľava: ' +
          discounts[i].discount +
          ' %'
      } else {
        updatedOrderProductsObject[i] =
          ' ' + item.qty + ' x ' + item.name + ' Kč' + item.price + '  '
      }
    })

    // Get address info
    const updatedOrderAddressInfo = updatedOrder.shippingAddress

    // Add additional information
    updatedOrderProductsObject.email = updatedOrder.email
    updatedOrderProductsObject.name = updatedOrder.name

    // Handle the payment result name with fallbacks
    let payerName = ''
    if (updatedOrder.paymentResult && updatedOrder.paymentResult.name) {
      // Check if name is in format with given_name and surname
      if (typeof updatedOrder.paymentResult.name === 'object') {
        payerName =
          (updatedOrder.paymentResult.name.given_name || '') +
          ' ' +
          (updatedOrder.paymentResult.name.surname || '')
      } else {
        // If it's a string or other format
        payerName = updatedOrder.paymentResult.name
      }
    }

    updatedOrderProductsObject.paidByWhom = payerName.trim()
    updatedOrderProductsObject.orderNumber = orderNumber
    updatedOrderProductsObject.taxPrice = updatedOrder.taxPrice
    updatedOrderProductsObject.totalPrice = updatedOrder.totalPrice
    updatedOrderProductsObject.shippingPrice = updatedOrder.shippingPrice
    updatedOrderProductsObject.isPaid = updatedOrder.isPaid
    updatedOrderProductsObject.productsCount = updatedOrderProductsCount
    updatedOrderProductsObject.orderId = updatedOrder.id
    updatedOrderProductsObject.paymentMethod = updatedOrder.paymentMethod
    updatedOrderProductsObject.addressinfo =
      updatedOrderAddressInfo.address +
      ', ' +
      updatedOrderAddressInfo.city +
      ', ' +
      updatedOrderAddressInfo.postalCode +
      ', ' +
      updatedOrderAddressInfo.country
    updatedOrderProductsObject.note = updatedOrder.shippingAddress.note || ''

    // Send payment success email
    // try {
    //   await new Email(updatedOrderProductsObject, '', '').sendPaymentSuccessfullToEmail()
    // } catch (emailError) {
    //   console.error('Failed to send payment success email:', emailError)
    //   // Continue even if email fails
    // }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order payment status:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
