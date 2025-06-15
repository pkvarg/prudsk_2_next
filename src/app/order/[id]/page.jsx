'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import useOrderStore from '@/store/orderStore'
import useUserStore from '@/store/userStore'
import useCartStore from '@/store/cartStore'
import Message from '@/app/components/Message'
import Loader from '@/app/components/Loader'

const OrderPage = () => {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id

  const userInfo = useUserStore((state) => state.userInfo)
  const { clearCart } = useCartStore()
  const {
    getOrderDetails,
    orderDetails: order,
    loadingDetails,
    deliverOrder,
    loadingDeliver,
    paidOrder,
    cancelOrder,
    loadingCancel,
    loadingPaid,
    resendConfirmationEmailWithInvoice,
    successConfirmationEmail,
    loadingConfirmationEmail,
    resetCreate,
  } = useOrderStore()

  const [error, setError] = useState(null)

  useEffect(() => {
    if (orderId) getOrderDetails(orderId)
  }, [orderId])

  const deliverHandler = async () => {
    await deliverOrder(orderId)
    getOrderDetails(orderId)
  }

  const paidHandler = async () => {
    await paidOrder(orderId)
    getOrderDetails(orderId)
  }

  const cancellHandler = async () => {
    await cancelOrder(orderId)
    getOrderDetails(orderId)
  }

  const newOrderHandler = async () => {
    await clearCart()
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    localStorage.removeItem('cart-storage')
    await resetCreate()
    router.push('/')
  }

  const resendConfirmationEmail = async () => {
    await resendConfirmationEmailWithInvoice(orderId, false)
    getOrderDetails(orderId)
  }

  const resendConfirmationEmailAdminOnly = async () => {
    await resendConfirmationEmailWithInvoice(orderId, true)
    getOrderDetails(orderId)
  }
  const calculateItemsPrice = () => {
    if (!order?.orderItems) return 0
    return order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  }

  const isAbroad = order?.shippingAddress?.country !== 'Česká republika'

  if (loadingDetails || loadingDeliver || loadingPaid || loadingConfirmationEmail) {
    return <Loader />
  }

  if (error) {
    return <Message variant="danger">{error}</Message>
  }

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Objednávka {order.orderNumber}</h1>

      {successConfirmationEmail && (
        <Message variant="success" className="mt-2">
          Potvrzovací email s fakturou odeslán
        </Message>
      )}

      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-2/3 px-4">
          <div className="space-y-6">
            {/* Shipping Address Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Doručovací adresa</h2>
              <p className="mb-2">
                <span className="font-semibold">Jméno: </span>
                {order.name}
              </p>
              {/* <p className="mb-2">
                <span className="font-semibold">E-mail: </span>
                <a href={`mailto:${order.user.email}`} className="text-blue-600 hover:underline">
                  {order.user.email}
                </a>
              </p> */}
              <p className="mb-4">
                <span className="font-semibold">Adresa: </span>
                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country},{' '}
                {order.shippingAddress.phone}
              </p>

              {order.shippingAddress.billingName && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">Fakturační údaje</h4>
                  <p>
                    {order.shippingAddress.billingName}, {order.shippingAddress.billingAddress},{' '}
                    {order.shippingAddress.billingPostalCode}, {order.shippingAddress.billingCity},{' '}
                    {order.shippingAddress.billingCountry}{' '}
                    {order.shippingAddress.billingICO && (
                      <span>IČO: {order.shippingAddress.billingICO}</span>
                    )}
                  </p>
                </div>
              )}

              {order.shippingAddress.note && (
                <h5 className="text-lg font-semibold mt-4">
                  Poznámka: {order.shippingAddress.note}
                </h5>
              )}

              <h2 className="text-2xl font-semibold mt-6 mb-4">Stav objednávky</h2>

              {order.isDelivered ? (
                <Message variant="success">Odesláno {order.deliveredAt}</Message>
              ) : (
                <Message variant="danger">Neodesláno</Message>
              )}

              {order.isCancelled && <Message variant="danger">Zrušená!</Message>}
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Platba</h2>
              <p className="mb-4">
                <span className="font-semibold">Způsob: </span>
                {order.paymentMethod}
              </p>

              {order.isPaid && <Message variant="success">Zaplaceno {order.paidAt}</Message>}
              {!order.isPaid && <Message variant="danger">Nezaplaceno</Message>}
            </div>

            {/* Order Items Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Objednané produkty: </h2>
              {order.orderItems?.length === 0 ? (
                <Message>Objednávka neobsahuje žádné produkty</Message>
              ) : (
                <div className="space-y-4">
                  {order.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-center border-b pb-4 last:border-b-0">
                      <div className="w-1/12">
                        <img src={item.image} alt={item.name} className="w-full rounded-lg" />
                      </div>
                      <div className="w-6/12 px-4">
                        <Link
                          href={`/product/${item.product.$oid || item.product}`}
                          className="text-blue-600 hover:underline"
                        >
                          {item.name}
                        </Link>
                        {order.discounts?.[index]?.discount > 0 && (
                          <h5 className="text-green-600 font-semibold">
                            Sleva {order.discounts[index].discount}%
                          </h5>
                        )}
                      </div>
                      <div className="w-5/12 text-right">
                        {item.qty} x {item.price} Kč = {item.qty * item.price} Kč
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 px-4 mt-6 md:mt-0">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Souhrn objednávky</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Produkty:</span>
                  <span>{calculateItemsPrice()} Kč</span>
                </div>

                {!isAbroad && (
                  <>
                    <div className="flex justify-between">
                      <span>Poštovné a balné:</span>
                      <span>{order.shippingPrice} Kč</span>
                    </div>
                    <div className="flex justify-between border-t pt-4">
                      <span>Celkem:</span>
                      <span>{order.totalPrice} Kč</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between px-6 pb-6">
              <div className="border-t -mt-2 mb-2"></div>
              {userInfo?.isAdmin && (
                <div className="space-y-2">
                  {!order.isDelivered && (
                    <>
                      <button
                        onClick={deliverHandler}
                        className={`w-full py-2 px-4 rounded text-white ${
                          loadingDeliver ? 'bg-gray-500' : 'bg-green-500 hover:bg-blue-500'
                        }`}
                        disabled={loadingDeliver}
                      >
                        {loadingDeliver ? 'Loading...' : 'Označit jako odeslané*'}
                      </button>
                      <p className="text-left text-[15px] leading-4 mx-2 mt-1">
                        * Odesílá se potvrzení zákazníkovi i adminovi.
                      </p>
                    </>
                  )}

                  {!order.isPaid && (
                    <>
                      <button
                        onClick={paidHandler}
                        className={`w-full py-2 px-4 rounded text-white ${
                          loadingPaid ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
                        }`}
                        disabled={loadingPaid}
                      >
                        {loadingPaid ? 'Loading...' : 'Označit jako zaplacené*'}
                      </button>
                      <p className="text-left text-[15px] leading-4 mx-2 mt-1">
                        * Odesílá se potvrzení zákazníkovi i adminovi.
                      </p>
                    </>
                  )}

                  {!order.isCancelled && !order.isDelivered && (
                    <button
                      onClick={cancellHandler}
                      className="w-full py-2 px-4 rounded text-white bg-red-600 hover:bg-red-700"
                    >
                      {loadingCancel ? 'Loading...' : 'Zrušit objednávku'}
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={newOrderHandler}
                className="w-full py-2 px-4 rounded text-white bg-[#2bb2e6] hover:bg-blue-700 mt-2"
              >
                Vytvořit novou objednávku
              </button>

              <button
                onClick={resendConfirmationEmail}
                className={`w-full py-2 px-4 rounded text-white mt-2 ${
                  loadingConfirmationEmail ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'
                }`}
                disabled={loadingConfirmationEmail}
              >
                {loadingConfirmationEmail ? 'Loading...' : 'Doposlat potvrzovací email s fakturou*'}
              </button>
              <p className="text-justify text-[15px] mx-2 my-2">
                * Při objednávce do zahraničí se faktura ze systému neodešle, odešle se jenom
                notifikace. Je nutné poslat si fakturu žlutým tlačítkem, upravit poštovné a celkovou
                sumu a odeslat zákazníkovi mailem manuálně. Stejně to funguje zde při doposílání.
              </p>

              <button
                onClick={resendConfirmationEmailAdminOnly}
                className={`w-full py-2 px-4 rounded text-white mt-2 ${
                  loadingConfirmationEmail
                    ? 'bg-gray-500'
                    : 'bg-yellow-400 !text-black hover:bg-green-400'
                }`}
                disabled={loadingConfirmationEmail}
              >
                {loadingConfirmationEmail
                  ? 'Loading...'
                  : 'Poslat potvrzovací email s fakturou jenom Adminovi'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPage
