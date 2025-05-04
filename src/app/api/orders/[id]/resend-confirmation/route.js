// app/api/orders/[id]/resend-confirmation/route.js

// @desc sendConfirmationEmailWithInvoice (from Admin menu)
// @desc PUT /api/orders/:id/resend-confirmation
// @access Private/Admin

import { NextResponse } from 'next/server'
import { auth } from '../../../../lib/auth'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'
import niceInvoice from '@/utils/invoiceGenerator'
import path from 'path'

const prisma = new PrismaClient()

export async function PUT(request, { params }) {
  try {
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = params

    // Find the order with all related data
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
        shippingAddress: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ message: 'Objednávka nenalezena.' }, { status: 404 })
    }

    // Process order items for email
    const discounts = order.discounts
    const loop = order.orderItems
    const productsCount = loop.length
    let productsObject = {}

    loop.forEach((item, i) => {
      if (discounts[i] && discounts[i].discount > 0) {
        productsObject[i] =
          ' ' +
          item.qty +
          ' x ' +
          item.name +
          ' ' +
          item.price +
          ' Kč' +
          ' zľava: ' +
          discounts[i].discount +
          ' %'
      } else {
        productsObject[i] = ' ' + item.qty + ' x ' + item.name + ' ' + item.price + ' Kč' + '  '
      }
    })

    // Build PRODUCTS OBJECT for email
    productsObject.user = order.name
    productsObject.email = order.email
    productsObject.name = order.name
    productsObject.orderNumber = order.orderNumber
    productsObject.taxPrice = order.taxPrice
    productsObject.totalPrice = order.totalPrice
    productsObject.shippingPrice = order.shippingPrice
    productsObject.isPaid = order.isPaid
    productsObject.productsCount = productsCount
    productsObject.orderId = order.id
    productsObject.paymentMethod = order.paymentMethod

    const addressInfo = order.shippingAddress
    productsObject.addressinfo =
      addressInfo.address +
      ', ' +
      addressInfo.city +
      ', ' +
      addressInfo.postalCode +
      ', ' +
      addressInfo.country +
      ', ' +
      addressInfo.phone

    productsObject.billinginfo =
      addressInfo.billingName +
      ', ' +
      addressInfo.billingAddress +
      ', ' +
      addressInfo.billingCity +
      ', ' +
      addressInfo.billingPostalCode +
      ', ' +
      addressInfo.billingCountry +
      (addressInfo.billingICO ? ', IČO: ' + addressInfo.billingICO : '')

    const productsOnly = order.totalPrice - order.shippingPrice
    productsObject.productsOnlyPrice = productsOnly
    productsObject.note = order.shippingAddress.note

    // Handle dates for invoice
    const date = new Date(order.createdAt)
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let billingDate = `${day}/${month}/${year}`

    // Function to create Billing due date
    function addMonths(numOfMonths, date) {
      const newDate = new Date(date)
      newDate.setMonth(newDate.getMonth() + numOfMonths)
      // Return formatted DMY
      let increasedDay = newDate.getDate()
      let increasedMonth = newDate.getMonth() + 1
      let increasedYear = newDate.getFullYear()
      let increasedDMY = `${increasedDay}/${increasedMonth}/${increasedYear}`
      return increasedDMY
    }

    // Add months to current Date
    const dueDate = addMonths(1, date)

    // Get project root for file paths
    const projectRoot = process.cwd()

    // Prepare invoice details
    const invoiceDetails = {
      shipping: {
        name: order.name,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        country: order.shippingAddress.country,
        phone: order.shippingAddress.phone,
        postalCode: order.shippingAddress.postalCode,
      },
      billing: {
        name: order.shippingAddress.billingName,
        address: order.shippingAddress.billingAddress,
        city: order.shippingAddress.billingCity,
        country: order.shippingAddress.billingCountry,
        postalCode: order.shippingAddress.billingPostalCode,
        ICO: order.shippingAddress.billingICO,
      },
      items: order.orderItems,
      discounts: order.discounts,
      paymentMethod:
        order.paymentMethod === 'Platba bankovním převodem předem'
          ? 'Bankovním převodem'
          : order.paymentMethod,
      total: order.totalPrice.toString(),
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice.toString(),
      orderNumber: order.orderNumber,
      header: {
        company_name: 'Adam Surjomartono – Distribuce Proud',
        company_logo: path.join(projectRoot, 'public', 'assets', 'wwwproudbanner.png'),
        company_address: 'Hnězdenská 586/16, 18100 Praha 8, Česká republika',
      },
      ico: 'IČO: 68368844',
      note: order.shippingAddress.note,
      invoice_produced_by: 'Vyhotovil: AS',
      footer: {
        text: 'Faktura zároveň slouží jako dodací list',
      },
      currency_symbol: 'Kč',
      date: {
        billing_date: billingDate,
        due_date: dueDate,
      },
    }

    // Format date for file name
    const cloneDate = new Date(date)
    cloneDate.setHours(cloneDate.getHours() + 1) // Increase the hour by 1
    const formattedDate = cloneDate.toISOString().replace(/:/g, '-').substring(0, 19) // Format as YYYY-MM-DDTHH-MM-SS

    // Create invoice path
    const invoiceDir = path.join(projectRoot, 'invoices')
    const filePath = path.join(invoiceDir, `${order.orderNumber}_${formattedDate}.pdf`)

    // Generate invoice
    await niceInvoice(invoiceDetails, filePath)

    // Send appropriate email based on order conditions
    try {
      if (
        order.shippingAddress.country !== 'Česká republika' &&
        order.paymentMethod === 'Platba bankovním převodem předem'
      ) {
        await new Email(productsObject, '', '').sendOrderNotCzToEmail()
        await new Email(productsObject, '', filePath).sendOrderNotCzAdminOnlyToEmail()
      } else if (
        order.shippingAddress.country === 'Česká republika' &&
        order.paymentMethod === 'Platba bankovním převodem předem'
      ) {
        await new Email(productsObject, '', filePath).sendOrderCzBankTransferToEmail()
      } else {
        await new Email(productsObject, '', filePath).sendOrderToEmail()
      }

      return NextResponse.json('Success', { status: 201 })
    } catch (err) {
      console.error('Error sending email:', err)
      return NextResponse.json(
        {
          message:
            'Objednávka byla vytvořena, ale potvrzovací e-mail obdržíte později. Brzy vás budeme informovat',
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Error resending confirmation email:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
