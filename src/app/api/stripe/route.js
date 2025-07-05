// app/api/stripe/route.js

import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// @desc Create Stripe checkout session
// @desc POST /api/stripe
// @access Public

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { products, email, url, initPaymentId, shippingPrice } = body.requestBody || body

    console.log('stripe', url, initPaymentId, shippingPrice)

    // Map products to Stripe line items
    const lineItems = products.map((product) => {
      const item = {
        price: product.price,
        name: product.name,
        quantity: product.qty,
      }

      return {
        price_data: {
          currency: 'czk',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }
    })

    // Get the base URL from environment variables
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_BASE_URL || 'https://proud.pictusweb.site'
        : process.env.NEXT_PUBLIC_DEV_URL || 'http://localhost:3000'

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      mode: 'payment',
      success_url: `${baseUrl}${url.pathname}/stripe-success/${initPaymentId}`,
      cancel_url: `${baseUrl}${url.pathname}/stripe-fail`,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: shippingPrice * 100, currency: 'czk' },
            display_name: 'Poštovné a balné',
          },
        },
      ],
      line_items: lineItems,
    })

    // Return the session to the client
    return NextResponse.json(session)
  } catch (error) {
    console.error('Stripe session creation error:', error)

    try {
      // Send error notification email
      const order = {
        email: body?.requestBody?.email || body?.email || 'unknown',
        error: error.message,
      }

      await new Email(order, '', '').sendPaymentErrorEmail()

      // Return error to client
      return NextResponse.json(
        { message: 'Payment session creation failed', error: error.message },
        { status: 500 },
      )
    } catch (emailError) {
      console.error('Failed to send error email:', emailError)

      // Return error to client even if email fails
      return NextResponse.json(
        { message: 'Payment session creation failed', error: error.message },
        { status: 500 },
      )
    }
  }
}
