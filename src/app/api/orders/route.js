// app/api/orders/route.js
import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import niceInvoice from '@/utils/invoiceGenerator'
import { join } from 'path'

import isAdmin from '@/lib/isAdmin'
import { getOrderNumber } from '@/utils/orderHelpers'

// @desc Create new Order
// @desc POST /api/orders
// @access Private

export async function POST(request) {
  try {
    const userLoggedIn = await isAdmin()

    if (!userLoggedIn) {
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
      return NextResponse.json({ message: 'Žádné položky objednávky' }, { status: 400 })
    }

    const orderNumber = await getOrderNumber()

    console.log('orderNumber', orderNumber)

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

            const productToAdminNotif = {
              id: product.id,
              name: product.name,
              author: product.author,
              countInStock: updatedCountInStockToDb,
            }

            //const apiUrl = 'http://localhost:3013/api/proud2next/low-storage-count'

            const apiUrl = 'https://hono-api.pictusweb.com/api/proud2next/low-storage-count'

            const response = await fetch(apiUrl, {
              method: 'POST',
              body: JSON.stringify(productToAdminNotif),
            })

            const data = await response.json()

            if (!data.success) {
              throw new Error('Nepodarilo sa odoslať Product low storage notification confirmation')
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
        userId: userLoggedIn.id,
        name,
        email,
        orderNumber,
        // Store as JSON instead of creating relations
        orderItems: orderItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product, // Just store the ID as string
        })),
        shippingAddress: {
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
        paymentMethod,
        discounts: discounts || [],
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: false,
        isDelivered: false,
      },
    })

    // Process order items for email
    const productsCount = createdOrder.orderItems.length
    let productsObject = {}

    console.log('created order', createdOrder)

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

    // SEND HONO EMAIL
    // const apiUrl = 'http://localhost:3013/api/proud2next/order-send-confirmation'

    const apiUrl = 'https://hono-api.pictusweb.com/api/proud2next/order-send-confirmation'

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(createdOrder),
    })

    const resData = await response.json()
    console.log('data order send confirmation', resData)
    console.log('data order send confirmation', resData.success)

    if (!resData.success) {
      throw new Error('Nepodarilo sa odoslať send order')
    }

    return NextResponse.json(createdOrder, { status: 201 })

    // try {
    //   await niceInvoice(invoiceDetails, invoicePath)
    //   const fileTosend = invoicePath

    //   if (
    //     createdOrder.shippingAddress.country !== 'Česká republika' &&
    //     createdOrder.paymentMethod === 'Platba bankovním převodem předem'
    //   ) {
    //     await new Email(productsObject, '', '').sendOrderNotCzToEmail()
    //     await new Email(productsObject, '', fileTosend).sendOrderNotCzAdminOnlyToEmail()
    //   } else if (
    //     createdOrder.shippingAddress.country === 'Česká republika' &&
    //     createdOrder.paymentMethod === 'Platba bankovním převodem předem'
    //   ) {
    //     await new Email(productsObject, '', fileTosend).sendOrderCzBankTransferToEmail()
    //   } else {
    //     await new Email(productsObject, '', fileTosend).sendOrderToEmail()
    //   }

    //   return NextResponse.json(createdOrder, { status: 201 })
    // } catch (err) {
    //   console.error('Error with invoice or email:', err)
    //   // Notify about the email issue but return successful order creation
    //   return NextResponse.json(
    //     {
    //       message:
    //         'Objednávka byla vytvořena, ale potvrzovací e-mail obdržíte později. Brzy Vás budeme informovat.',
    //       order: createdOrder,
    //     },
    //     { status: 201 },
    //   )
    // }
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const user = await isAdmin()

    if (!user.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }
    // Find all orders with user information
    const orders = await prisma.order.findMany({})

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching all orders:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
