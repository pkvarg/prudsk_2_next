// app/api/orders/myorders/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'
import { auth } from '../../../../lib/auth'

const prisma = new PrismaClient()

// @desc Get logged in user orders
// @desc GET /api/orders/myorders
// @access Private
export async function GET(request) {
  try {
    const session = await auth()

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const email = session.user.email

    // Find all orders for the logged-in user
    const orders = await prisma.order.findMany({
      where: {
        email: email,
      },
      orderBy: {
        createdAt: 'desc', // Most recent orders first
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
