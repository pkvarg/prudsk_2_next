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

    // Prices, discounts and stock changes are worked out here from the database. Values the browser
    // sends for them (itemsPrice, totalPrice, shippingPrice, discounts, qtys) are ignored, otherwise a
    // customer could edit the request and order at any price.
    const { orderItems, shippingAddress, paymentMethod, user, name, email } = data

    // Validate request
    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ message: 'Žádné položky objednávky' }, { status: 400 })
    }

    if (!Array.isArray(orderItems) || orderItems.length > 50 || !shippingAddress) {
      return NextResponse.json({ message: 'Neplatná objednávka' }, { status: 400 })
    }

    const items = []
    for (const item of orderItems) {
      const productId = String(item?.product || '')
      const qty = Number(item?.qty)
      if (!/^[0-9a-f]{24}$/i.test(productId) || !Number.isInteger(qty) || qty < 1 || qty > 100) {
        return NextResponse.json({ message: 'Neplatná položka objednávky' }, { status: 400 })
      }
      const product = await prisma.product.findUnique({ where: { id: productId } })
      if (!product) {
        return NextResponse.json({ message: 'Produkt sa nenašiel' }, { status: 400 })
      }
      // Same rule as the cart: the discounted price applies while the product has a discount.
      const price = product.discount ? product.discountedPrice : product.price
      items.push({ product, qty, price: Number(price) || 0, discount: Number(product.discount) || 0 })
    }

    // Same rules as the cart: 4.50 € shipping, free over 100 € or for CBA pickup.
    const itemsTotal = items.reduce((acc, item) => acc + item.price * item.qty, 0)
    const excludeShipping = shippingAddress.note === 'CBA'
    const shippingPrice = excludeShipping || itemsTotal > 100 ? 0 : 4.5
    const taxPrice = 0
    const totalPrice = itemsTotal + shippingPrice
    const discounts = items.map((item) => ({ product: item.product.id, discount: item.discount }))

    const orderNumber = await getOrderNumber()

    /* Update Count in stock on purchased products */
    for (const { product: listed, qty: purchasedProductQty } of items) {
      const product = await prisma.product.findUnique({
        where: { id: listed.id },
      })

      if (product) {
        const updatedCountInStockToDb = product.countInStock - purchasedProductQty

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


          const apiUrl = `${process.env.NEXT_PUBLIC_HONO_API_URL || 'https://hono-api.pictusweb.com'}/api/prudsk2next/low-storage-count`

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

    // Create new order with Prisma
    const createdOrder = await prisma.order.create({
      data: {
        userId: userLoggedIn.id,
        name,
        email,
        orderNumber,
        // Store as JSON instead of creating relations
        orderItems: items.map((item) => ({
          name: item.product.name,
          qty: item.qty,
          image: item.product.image,
          price: item.price,
          product: item.product.id, // Just store the ID as string
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
          billingDIC: shippingAddress.billingDIC || '',
        },
        paymentMethod,
        discounts,
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
      (addressInfo.billingICO ? ', IČO: ' + addressInfo.billingICO : '') +
      (addressInfo.billingDIC ? ', DIČ: ' + addressInfo.billingDIC : '')

    const productsOnly = createdOrder.totalPrice - createdOrder.shippingPrice
    productsObject.productsOnlyPrice = productsOnly
    productsObject.note = createdOrder.shippingAddress.note

    // SEND HONO EMAIL

    const apiUrl = `${process.env.NEXT_PUBLIC_HONO_API_URL || 'https://hono-api.pictusweb.com'}/api/prudsk2next/order-send-confirmation`

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(createdOrder),
    })

    const resData = await response.json()

    if (!resData.success) {
      throw new Error('Nepodarilo sa odoslať send order')
    }

    return NextResponse.json(createdOrder, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const user = await isAdmin()

    if (!user?.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }
    // Find all orders with user information, newest first
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching all orders:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
