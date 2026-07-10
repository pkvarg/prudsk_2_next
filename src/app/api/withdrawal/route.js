// app/api/withdrawal/route.js

// @desc Submit a withdrawal from contract (odstúpenie od zmluvy) - zákon č. 108/2024 Z. z.
// @desc POST /api/withdrawal
// @access Public (must be usable by guests, without registration)

import { NextResponse } from 'next/server'
import { checkIPBan } from '@/lib/checkIPBan'
import prisma from '@/db/db'

export async function POST(request) {
  try {
    // Bot protection: reject banned IPs / subnets
    const ipCheck = await checkIPBan(request)
    if (ipCheck.isBanned) {
      return NextResponse.json(
        {
          error: 'Access Denied',
          message: ipCheck.banInfo.message,
          code: 'IP_BANNED',
        },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { orderNumber, name, email, phone, address, orderDate, items, iban, reason, honeypot } =
      body

    // Bot protection: server-side honeypot double-check
    if (honeypot) {
      return NextResponse.json(
        { success: false, message: 'Neodoslané! Kontaktujte nás emailom, prosím.' },
        { status: 400 },
      )
    }

    if (!orderNumber?.trim() || !name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Vyplňte prosím číslo objednávky, meno a e-mail.' },
        { status: 400 },
      )
    }

    // Try to match the order, but NEVER block the submission when it does not match -
    // the law forbids putting obstacles in the consumer's way (a typo must not block withdrawal)
    const matchedOrder = await prisma.order.findFirst({
      where: { orderNumber: orderNumber.trim() },
    })
    const orderMatched =
      !!matchedOrder && matchedOrder.email?.toLowerCase() === email.trim().toLowerCase()

    const withdrawal = await prisma.withdrawal.create({
      data: {
        orderNumber: orderNumber.trim(),
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        orderDate: orderDate?.trim() || null,
        items: items?.trim() || null,
        iban: iban?.trim() || null,
        reason: reason?.trim() || null,
        orderMatched,
        orderId: orderMatched ? matchedOrder.id : null,
        ipAddress: ipCheck.ip || null,
      },
    })

    // SEND HONO EMAIL - confirmation of receipt on a durable medium (required by law,
    // must include the content of the withdrawal and the date and time of submission)
    const apiUrl = `${process.env.NEXT_PUBLIC_HONO_API_URL}/api/prudsk2next/withdrawal`

    let emailSent = false
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: withdrawal.name,
          email: withdrawal.email,
          phone: withdrawal.phone,
          address: withdrawal.address,
          orderNumber: withdrawal.orderNumber,
          orderDate: withdrawal.orderDate,
          items: withdrawal.items,
          iban: withdrawal.iban,
          reason: withdrawal.reason,
          submittedAt: withdrawal.createdAt.toISOString(),
          locale: 'sk',
          origin: 'prudsk2next',
          subject: `Potvrdenie o prijatí odstúpenia od zmluvy - objednávka č. ${withdrawal.orderNumber}`,
        }),
      })
      const data = await response.json()
      emailSent = !!data.success
    } catch (error) {
      console.error('Error sending withdrawal confirmation email:', error)
    }

    if (emailSent) {
      await prisma.withdrawal.update({
        where: { id: withdrawal.id },
        data: { emailSent: true },
      })
    }

    return NextResponse.json(
      {
        success: true,
        submittedAt: withdrawal.createdAt.toISOString(),
        emailSent,
        message: 'Odstúpenie od zmluvy bolo prijaté.',
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error submitting withdrawal:', error)
    return NextResponse.json(
      { success: false, message: 'Nastala neočakávaná chyba. Skúste to prosím znova.' },
      { status: 500 },
    )
  }
}
