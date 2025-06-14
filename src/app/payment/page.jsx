'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useCartStore from '@/store/cartStore'
import FormContainer from '@/app/components/FormContainer'
import CheckoutSteps from '@/app/components/CheckoutSteps'

const PaymentScreen = () => {
  const router = useRouter()
  const { shippingAddress, paymentMethod, savePaymentMethod } = useCartStore()

  console.log('pay method', paymentMethod)

  useEffect(() => {
    if (!shippingAddress) {
      router.push('/shipping')
    }
  }, [shippingAddress, router])

  const [method, setMethod] = useState('')

  useEffect(() => {
    if (paymentMethod) {
      setMethod(paymentMethod)
    }
  }, [paymentMethod])

  const submitHandler = (e) => {
    e.preventDefault()
    if (!method) {
      alert('Vyberte prosím způsob platby.')
      return
    }
    savePaymentMethod(method)
    router.push('/placeorder')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <Link
          className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
          href="/shipping"
        >
          ← Zpět na informace o doručení
        </Link>

        <CheckoutSteps step1 step2 step3 />

        <FormContainer>
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-[#071e46] mb-6">Způsob platby</h1>

            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <fieldset>
                  <legend className="text-lg font-medium text-[#071e46] mb-4">
                    Vyberte způsob platby
                  </legend>

                  <div className="space-y-4">
                    {shippingAddress?.country === 'Česká republika' ? (
                      <>
                        {/* Commented out Stripe option as in original */}
                        {/* <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Stripe"
                            checked={method === 'Stripe'}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-4 h-4 text-[#071e46] border-gray-300 focus:ring-[#071e46] focus:ring-2"
                          />
                          <span className="ml-3 text-[#071e46]">
                            Platba kartou Stripe / Google Pay
                          </span>
                        </label> */}

                        <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Platba bankovním převodem předem"
                            checked={method === 'Platba bankovním převodem předem'}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-4 h-4 text-[#071e46] border-gray-300 focus:ring-[#071e46] focus:ring-2"
                          />
                          <span className="ml-3 text-[#071e46]">
                            Platba bankovním převodem předem
                          </span>
                        </label>

                        <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Hotovost"
                            checked={method === 'Hotovost'}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-4 h-4 text-[#071e46] border-gray-300 focus:ring-[#071e46] focus:ring-2"
                          />
                          <span className="ml-3 text-[#071e46]">Hotovost při převzetí</span>
                        </label>
                      </>
                    ) : (
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Platba bankovním převodem předem"
                          checked={method === 'Platba bankovním převodem předem'}
                          onChange={(e) => setMethod(e.target.value)}
                          className="w-4 h-4 text-[#071e46] border-gray-300 focus:ring-[#071e46] focus:ring-2"
                        />
                        <span className="ml-3 text-[#071e46]">
                          Platba bankovním převodem předem
                        </span>
                      </label>
                    )}
                  </div>
                </fieldset>
              </div>

              <button
                type="submit"
                className="w-full  items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
              >
                Pokračovat
              </button>
            </form>
          </div>
        </FormContainer>
      </div>
    </div>
  )
}

export default PaymentScreen
