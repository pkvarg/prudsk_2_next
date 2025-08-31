'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import useCartStore from '@/store/cartStore'
import useOrderStore from '@/store/orderStore'
import useUserStore from '@/store/userStore'
import Message from '@/app/components/Message'
import CheckoutSteps from '@/app/components/CheckoutSteps'

const PlaceOrderScreen = () => {
  const router = useRouter()
  const { cartItems: cart, removeFromAll, shippingAddress, paymentMethod } = useCartStore()
  const {
    createOrder,
    order,
    loading,
    error,
    successCreate: success,
    createdOrder,
  } = useOrderStore()
  const { userInfo, updateUserProfile } = useUserStore()

  // Calculate Prices
  console.log('cart', cart)

  const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0)
  const shippingPrice = 75
  const totalPrice = Number(itemsPrice) + Number(shippingPrice)

  useEffect(() => {
    if (success) {
      if (cart.paymentMethod === 'Hotovost') {
        removeFromAll()
      }
      router.push(`/order/${createdOrder.id}`)
    }
  }, [router, success, cart.paymentMethod, createdOrder?.id, removeFromAll])

  const [message, setMessage] = useState(null)

  /* prod quantities TO update countInStock */
  let prodsQtys = {}
  cart.map((item, index) => {
    const productId = cart[index].product
    const productQty = Number(cart[index].qty)
    return (prodsQtys[index] = { product: productId, qty: productQty })
  })

  let prodsDiscounts = {}
  cart.map((item, index) => {
    const productId = cart[index].product
    const productDiscount = Number(cart[index].discount)
    return (prodsDiscounts[index] = {
      product: productId,
      discount: productDiscount,
    })
  })

  const [clicked, setClicked] = useState(false)

  const placeOrderhandler = () => {
    if (gdrpOrderChecked && tradeRulesOrderChecked) {
      setClicked(true)
      createOrder({
        orderItems: cart,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: 0,
        totalPrice: totalPrice,
        user: userInfo.name,
        name: shippingAddress.name,
        email: userInfo.email,
        qtys: prodsQtys,
        discounts: prodsDiscounts,
      })
      updateUserProfile({
        id: userInfo.id,
        isSubscribed: newsletterChecked,
      })
    } else {
      setMessage('Potvrďte súhlas nižšie')
    }
  }

  const [gdrpOrderChecked, setGdprOrderChecked] = useState(false)
  const handleGdprOrder = () => {
    setGdprOrderChecked(!gdrpOrderChecked)
  }

  const [tradeRulesOrderChecked, setTradeRulesOrderChecked] = useState(false)
  const handleTradeRulesOrder = () => {
    setTradeRulesOrderChecked(!tradeRulesOrderChecked)
  }

  const [newsletterChecked, setNewsletterChecked] = useState(true)
  const handleNewsletter = () => {
    setNewsletterChecked((prev) => !prev)
  }

  console.log('in placeorder', cart)

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <Link
          className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
          href="/payment"
        >
          ← Späť na Spôsob platby
        </Link>

        <CheckoutSteps step1 step2 step3 step4 />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-[#071e46] mb-4">Doručenie</h2>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Príjemca: </strong>
                  {shippingAddress?.name}, {shippingAddress?.address}, {shippingAddress?.city},{' '}
                  {shippingAddress?.postalCode}, {shippingAddress?.country},{' '}
                  {shippingAddress?.phone}
                </p>

                {shippingAddress?.billingName && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-[#071e46] mb-2">Fakturačné údaje</h4>
                    <p className="text-gray-700">
                      {shippingAddress.billingName}, {shippingAddress.billingAddress},{' '}
                      {shippingAddress.billingPostalCode}, {shippingAddress.billingCity},{' '}
                      {shippingAddress.billingCountry}{' '}
                      {shippingAddress.billingICO && <span>IČO: {shippingAddress.billingICO}</span>}
                    </p>
                  </div>
                )}

                {shippingAddress?.note && (
                  <h5 className="mt-4 font-medium text-[#071e46]">
                    Poznámka: {shippingAddress.note}
                  </h5>
                )}
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-[#071e46] mb-4">Platba</h2>
              <p className="text-gray-700">
                <strong>Spôsob platby: </strong>
                {paymentMethod}
              </p>
            </div>

            {/* Order Items Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-[#071e46] mb-4">Objednané produkty:</h2>
              {cart.length === 0 ? (
                <Message>Váš košík je prázdny</Message>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 relative flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-grow">
                          <Link
                            className="text-[#071e46] hover:text-[#0a2554] no-underline font-medium"
                            href={`/product/${item.product}`}
                          >
                            {item.name}
                          </Link>
                          {item.discount > 0 && (
                            <div className="text-green-600 font-medium text-sm mt-1">
                              Zľava {item.discount}%
                            </div>
                          )}
                        </div>
                        <div className="text-right text-gray-700">
                          {item.qty} x {parseFloat(item.price).toFixed(2)} € = {parseFloat(item.qty * item.price).toFixed(2)} €
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-[#071e46] mb-6">Súhrn objednávky</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Produkty:</span>
                  <span className="font-medium">{parseFloat(itemsPrice).toFixed(2)} €</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Poštovné a balné:</span>
                  {shippingAddress?.country !== 'Česká republika' ? (
                    <span className="text-sm text-gray-600">Bude oznámené faktúrou</span>
                  ) : (
                    <span className="font-medium">{parseFloat(shippingPrice).toFixed(2)} €</span>
                  )}
                </div>

                {cart.shippingAddress?.country === 'Česká republika' && (
                  <div className="flex justify-between items-center py-2 font-bold text-lg">
                    <span className="text-[#071e46]">Celkom:</span>
                    <span className="text-[#071e46]">{parseFloat(totalPrice).toFixed(2)} €</span>
                  </div>
                )}
              </div>

              {error && <Message variant="danger">{error}</Message>}
              {message && <Message variant="danger">{message}</Message>}

              <div className="space-y-4 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="gdprCheck"
                    required
                    onChange={handleGdprOrder}
                    className="mt-1 w-4 h-4 text-[#071e46] border-gray-300 rounded focus:ring-[#071e46] focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">
                    <a
                      href="/safety-privacy"
                      target="_blank"
                      className="text-[#071e46] hover:text-[#0a2554] underline"
                    >
                      Súhlasím so spracovaním osobných údajov
                    </a>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="tradeRulesCheck"
                    required
                    onChange={handleTradeRulesOrder}
                    className="mt-1 w-4 h-4 text-[#071e46] border-gray-300 rounded focus:ring-[#071e46] focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">
                    <a
                      href="/trade-rules"
                      target="_blank"
                      className="text-[#071e46] hover:text-[#0a2554] underline"
                    >
                      Súhlasím s obchodnými podmienkami
                    </a>
                  </span>
                </label>

                {/* <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="newsletterCheck"
                    defaultChecked={newsletterChecked}
                    onChange={handleNewsletter}
                    className="mt-1 w-4 h-4 text-[#071e46] border-gray-300 rounded focus:ring-[#071e46] focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">
                    Súhlasím so zasielaním mailov o novinkách a akciách (max. 2x ročne)
                  </span>
                </label> */}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="newsletterCheck"
                    defaultChecked={newsletterChecked}
                    onChange={handleNewsletter}
                    className="mt-1 w-4 h-4 min-w-[1rem] min-h-[1rem] text-[#071e46] border-gray-300 rounded focus:ring-[#071e46] focus:ring-2 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700">
                    Súhlasím so zasielaním mailov o novinkách a akciách (max. 2x ročne)
                  </span>
                </label>
              </div>

              <button
                type="button"
                // className="w-full px-6 py-3 text-white bg-[#071e46] hover:bg-[#0a2554] rounded transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"

                className="w-full items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200 disabled:cursor-not-allowed"
                disabled={cart.length === 0 || clicked || loading}
                onClick={placeOrderhandler}
              >
                {loading ? 'Spracovanie...' : 'Záväzne objednať'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrderScreen
