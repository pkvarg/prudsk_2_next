// app/api/orders/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'
import niceInvoice from '@/utils/invoiceGenerator'
import Email from '@/utils/email'
import { join } from 'path'
import { auth } from '../../../../lib/auth'

const prisma = new PrismaClient()

// @desc Create new Order
// @desc POST /api/orders
// @access Private

// Helper function to generate order number
async function getOrderNumber() {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  const datePrefix = `${year}${month}${day}`

  // Find the latest order from today
  const latestOrder = await prisma.order.findFirst({
    where: {
      orderNumber: {
        startsWith: datePrefix,
      },
    },
    orderBy: {
      orderNumber: 'desc',
    },
  })

  let sequenceNumber = 1

  if (latestOrder) {
    // Extract sequence number from the latest order number
    const latestSequence = parseInt(latestOrder.orderNumber.slice(-4))
    sequenceNumber = latestSequence + 1
  }

  // Format the sequence number to 4 digits
  const formattedSequence = String(sequenceNumber).padStart(4, '0')

  return `${datePrefix}${formattedSequence}`
}

export async function POST(request) {
  try {
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const data = await request.json()

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      user,
      name,
      email,
      discounts,
      qtys,
    } = data

    // Validate request
    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ message: 'No order items' }, { status: 400 })
    }

    const orderNumber = await getOrderNumber()

    /* Update Count in stock on purchased products */
    if (qtys) {
      for (const key of Object.keys(qtys)) {
        const purchasedProductId = `${qtys[key].product}`
        const purchasedProductQty = parseInt(`${qtys[key].qty}`)

        const product = await prisma.product.findUnique({
          where: { id: purchasedProductId },
        })

        if (product) {
          const updatedCountInStockToDb = product.countInStock - purchasedProductQty
          console.log('countStockInDB', updatedCountInStockToDb)

          if (updatedCountInStockToDb <= 10) {
            await prisma.product.update({
              where: { id: product.id },
              data: { countInStock: updatedCountInStockToDb },
            })

            try {
              await new Email(product, '', '').sendLowStoragePiecesWarningEmail()
            } catch (error) {
              console.log(error)
            }
          } else {
            await prisma.product.update({
              where: { id: product.id },
              data: { countInStock: updatedCountInStockToDb },
            })
          }
        }
      }
    }

    // Create new order with Prisma
    const createdOrder = await prisma.order.create({
      data: {
        orderItems: {
          create: orderItems.map((item) => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: {
              connect: { id: item.product },
            },
          })),
        },
        user: {
          connect: { id: session.user.id },
        },
        shippingAddress: {
          create: {
            address: shippingAddress.address,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
            phone: shippingAddress.phone,
            note: shippingAddress.note || '',
            billingName: shippingAddress.billingName,
            billingAddress: shippingAddress.billingAddress,
            billingCity: shippingAddress.billingCity,
            billingPostalCode: shippingAddress.billingPostalCode,
            billingCountry: shippingAddress.billingCountry,
            billingICO: shippingAddress.billingICO || '',
          },
        },
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        name,
        email,
        discounts: discounts || [],
        orderNumber,
        isPaid: false,
        isDelivered: false,
      },
      include: {
        orderItems: true,
        shippingAddress: true,
      },
    })

    // Process order items for email
    const productsCount = createdOrder.orderItems.length
    let productsObject = {}

    createdOrder.orderItems.forEach((item, i) => {
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

    // Build address info
    const addressInfo = createdOrder.shippingAddress

    // PRODUCTS OBJECT for email
    productsObject.user = user
    productsObject.email = email
    productsObject.name = name
    productsObject.orderNumber = createdOrder.orderNumber
    productsObject.taxPrice = createdOrder.taxPrice
    productsObject.totalPrice = createdOrder.totalPrice
    productsObject.shippingPrice = createdOrder.shippingPrice
    productsObject.isPaid = createdOrder.isPaid
    productsObject.productsCount = productsCount
    productsObject.orderId = createdOrder.id
    productsObject.paymentMethod = createdOrder.paymentMethod
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

    const productsOnly = createdOrder.totalPrice - createdOrder.shippingPrice
    productsObject.productsOnlyPrice = productsOnly
    productsObject.note = createdOrder.shippingAddress.note

    // Invoice date handling
    const date = createdOrder.createdAt
    let dateFromJson = new Date(date)
    let day = dateFromJson.getDate()
    let month = dateFromJson.getMonth() + 1
    let year = dateFromJson.getFullYear()
    let billingDate = `${day}/${month}/${year}`

    // Function to create Billing due date
    function addMonths(numOfMonths, date) {
      date.setMonth(date.getMonth() + numOfMonths)
      // return Real DMY
      let increasedDay = date.getDate()
      let increasedMonth = date.getMonth() + 1
      let increasedYear = date.getFullYear()
      let increasedDMY = `${increasedDay}/${increasedMonth}/${increasedYear}`
      return increasedDMY
    }

    // Add months to current Date
    const dueDate = addMonths(1, dateFromJson)

    // In Next.js, we need to handle path differently
    const projectRoot = process.cwd()

    const invoiceDetails = {
      shipping: {
        name: name,
        address: createdOrder.shippingAddress.address,
        city: createdOrder.shippingAddress.city,
        country: createdOrder.shippingAddress.country,
        phone: createdOrder.shippingAddress.phone,
        postalCode: createdOrder.shippingAddress.postalCode,
      },
      billing: {
        name: createdOrder.shippingAddress.billingName,
        address: createdOrder.shippingAddress.billingAddress,
        city: createdOrder.shippingAddress.billingCity,
        country: createdOrder.shippingAddress.billingCountry,
        postalCode: createdOrder.shippingAddress.billingPostalCode,
        ICO: createdOrder.shippingAddress.billingICO,
      },
      items: createdOrder.orderItems,
      discounts: discounts,
      paymentMethod:
        createdOrder.paymentMethod === 'Platba bankovním převodem předem'
          ? 'Bankovním převodem'
          : createdOrder.paymentMethod,
      total: createdOrder.totalPrice,
      taxPrice: createdOrder.taxPrice,
      shippingPrice: createdOrder.shippingPrice,
      orderNumber: createdOrder.orderNumber,
      header: {
        company_name: 'Adam Surjomartono – Distribuce Proud',
        company_logo: join(projectRoot, 'public', 'assets', 'wwwproudbanner.png'),
        company_address: 'Hnězdenská 586/16, 18100 Praha 8, Česká republika',
      },
      ico: 'IČO: 68368844',
      note: productsObject.note,
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

    date.setHours(date.getHours() + 1) // Increase the hour by 1
    const formattedDate = date.toISOString().replace(/:/g, '-').substring(0, 19) // Format the date as YYYY-MM-DDTHH-MM-SS

    // Create invoices directory
    const invoiceDir = join(projectRoot, 'invoices')
    const invoicePath = join(invoiceDir, `${orderNumber}_${formattedDate}.pdf`)

    try {
      await niceInvoice(invoiceDetails, invoicePath)
      const fileTosend = invoicePath

      if (
        createdOrder.shippingAddress.country !== 'Česká republika' &&
        createdOrder.paymentMethod === 'Platba bankovním převodem předem'
      ) {
        await new Email(productsObject, '', '').sendOrderNotCzToEmail()
        await new Email(productsObject, '', fileTosend).sendOrderNotCzAdminOnlyToEmail()
      } else if (
        createdOrder.shippingAddress.country === 'Česká republika' &&
        createdOrder.paymentMethod === 'Platba bankovním převodem předem'
      ) {
        await new Email(productsObject, '', fileTosend).sendOrderCzBankTransferToEmail()
      } else {
        await new Email(productsObject, '', fileTosend).sendOrderToEmail()
      }

      return NextResponse.json(createdOrder, { status: 201 })
    } catch (err) {
      console.error('Error with invoice or email:', err)
      // Notify about the email issue but return successful order creation
      return NextResponse.json(
        {
          message:
            'Objednávka byla vytvořena, ale potvrzovací e-mail obdržíte později. Brzy Vás budeme informovat.',
          order: createdOrder,
        },
        { status: 201 },
      )
    }
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Find all orders with user information
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        orderItems: true,
        shippingAddress: true,
      },
      orderBy: {
        createdAt: 'desc', // Most recent orders first
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching all orders:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
