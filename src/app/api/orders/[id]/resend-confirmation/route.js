// app/api/orders/[id]/resend-confirmation/route.js

// @desc sendConfirmationEmailWithInvoice (from Admin menu)
// @desc PUT /api/orders/:id/resend-confirmation
// @access Private/Admin

import { NextResponse } from 'next/server'
import isAdmin from '@/lib/isAdmin'
import prisma from '@/db/db'

export async function PUT(request, { params }) {
  // Parse the request body to get the data
  const body = await request.json()
  const { adminOnly } = body

  console.log('adminOnly:', adminOnly)

  try {
    const user = await isAdmin()

    if (!user.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }
    const { id } = await params

    console.log('here in resend', id)

    // Find the order with all related data
    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json({ message: 'Objednávka nenalezena.' }, { status: 404 })
    }

    // TODO condition to whom to send the order confirmation

    order.adminOnly = adminOnly

    // SEND HONO EMAIL
    const apiUrl = 'http://localhost:3013/api/proud2next/order-resend-confirmation'

    //const apiUrl = 'https://hono-api.pictusweb.com/api/proud2next/order-resend-confirmation'

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(order),
    })

    const data = await response.json()
    console.log('data order resend confirmation', data.success)

    if (!data.success) {
      throw new Error('Nepodarilo sa odoslať order resend confirmation')
    }

    return NextResponse.json({ message: 'success' }, { status: 200 })
  } catch (error) {
    console.error('Error resending confirmation email:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
