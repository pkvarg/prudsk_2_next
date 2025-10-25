// app/api/orders/[id]/route.js
import { NextResponse } from 'next/server'
import isAdmin from '@/lib/isAdmin'
import prisma from '@/db/db'

// @desc Get order by ID
// @desc GET /api/orders/:id
// @access Private
export async function GET(request, { params }) {
  try {
    const user = await isAdmin()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }
    const { id } = await params

    // Fetch order by ID with related user information
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
    })

    if (order) {
      return NextResponse.json(order)
    } else {
      return NextResponse.json({ message: 'Objednávka nebyla nalezena' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
