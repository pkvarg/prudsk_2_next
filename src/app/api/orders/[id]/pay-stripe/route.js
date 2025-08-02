// app/api/orders/[id]/pay-stripe/route.js
import { NextResponse } from 'next/server'
import isAdmin from '@/lib/isAdmin'
import prisma from '@/db/db'

// @desc Update order to Paid by Stripe
// @desc PUT /api/orders/:id/pay-stripe
// @access Private
export async function PUT(request, { params }) {
  try {
    const user = await isAdmin()

    if (!user.isAdmin) {
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
      return NextResponse.json({ message: 'Objednávka nebyla nalezena' }, { status: 404 })
    }

    // Update order payment details with Stripe information
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          create: {
            paymentId: paymentData.id,
            status: 'Paid by Stripe',
            updateTime: new Date().toISOString(),
            emailAddress: paymentData.email,
            address: paymentData.shippingAddress || '',
            name: paymentData.name,
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
    updatedOrderProductsObject.paidByWhom = updatedOrder.paymentResult?.name || updatedOrder.name
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
    //   console.error('Failed to send Stripe payment success email:', emailError)
    //   // Continue even if email fails
    // }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order Stripe payment status:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
