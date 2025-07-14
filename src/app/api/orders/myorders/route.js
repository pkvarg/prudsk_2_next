// app/api/orders/myorders/route.js
import { NextResponse } from 'next/server'
import prisma from '@/db/db'
import isAdmin from '@/lib/isAdmin'

// @desc Get logged in user orders
// @desc GET /api/orders/myorders
// @access Private
export async function GET(request) {
  try {
    const user = await isAdmin()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const email = user.email

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
