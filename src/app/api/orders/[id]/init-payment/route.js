// app/api/orders/[id]/init-payment/route.js

// @desc Create init payment Id in db
// @desc PUT /api/orders/:id/init-payment
// @access Private

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 })
    }

    const { id } = params

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    // Create token using crypto
    const token = crypto.createHash('sha256').update(id).digest('hex')
    console.log('tkcry', token)

    // Update the order with the init payment ID
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        initPaymentId: token,
      },
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

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error creating init payment ID:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 })
    }

    const { id } = params

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        initPaymentId: true,
      },
    })

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    // Return just the initPaymentId as in the original implementation
    return NextResponse.json(order.initPaymentId)
  } catch (error) {
    console.error('Error getting init payment ID:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
