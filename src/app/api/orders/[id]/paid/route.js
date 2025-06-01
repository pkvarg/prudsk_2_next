// app/api/orders/[id]/paid/route.js
import { NextResponse } from 'next/server'
import isAdmin from '@/lib/isAdmin'
import prisma from '@/db/db'

// @desc Update order to Paid No Card (from Admin menu)
// @desc PUT /api/orders/:id/paid
// @access Private (Admin only)
export async function PUT(request, { params }) {
  try {
    const { id } = await params

    const user = await isAdmin()

    if (!user.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Find the order first
    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    // Update the order payment status
    await prisma.order.update({
      where: { id },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Update order success' }, { status: 200 })
  } catch (error) {
    console.error('Error updating order payment status:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
