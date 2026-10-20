// app/api/stripe/route.js
import { NextResponse } from 'next/server'

// @desc Create Stripe checkout session
// @desc POST /api/stripe
// @access Disabled
//
// Card payment is switched off on the payment page, and the previous version built the Stripe
// session from prices and quantities sent by the browser, so anyone could pay any amount.
// Before Stripe is offered again, rebuild this from the saved order (prices are now calculated
// on the server in POST /api/orders), check the order belongs to the caller, and confirm payment
// with a Stripe webhook instead of the success redirect. The old version is in git history.
export async function POST() {
  return NextResponse.json({ message: 'Platba kartou momentálne nie je dostupná' }, { status: 410 })
}
