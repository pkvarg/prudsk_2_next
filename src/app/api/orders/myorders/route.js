// app/api/orders/myorders/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// @desc Get logged in user orders
// @desc GET /api/orders/myorders
// @access Private
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Find all orders for the logged-in user
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        orderItems: true,
        shippingAddress: true,
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
