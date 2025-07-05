'use client'

import React, { useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import useCartStore from '@/store/cartStore'
import { Trash } from 'lucide-react'

// Loading component
const PageLoader = () => (
  <div className="container mx-auto px-4">
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  </div>
)

// Main cart component
const Cart = () => {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const productId = params.id
  const qty = searchParams.get('qty')

  const {
    cartItems,
    addToCart,
    removeFromCart,
    getTotalItems,
    getCartTotal,
    getShippingPrice,
    getFinalTotal,
  } = useCartStore()

  useEffect(() => {
    if (productId) {
      addToCart(productId, qty || 1) // Default to 1 if qty is null
    }
  }, [productId, qty, addToCart])

  const removeFromCartHandler = (id) => {
    removeFromCart(id)
    router.push('/cart')
  }

  const checkoutHandler = () => {
    router.push('/shipping')
  }

  const continueShopping = () => {
    router.push('/')
  }

  const totalItems = getTotalItems()
  const totalPrice = getCartTotal()
  const shippingPrice = getShippingPrice()
  const finalTotal = getFinalTotal()

  return (
    <div className="container mx-auto px-4">
      <button
        className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
        onClick={() => router.back()}
      >
        ← Zpět
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-[#071e46] mb-6">Nákupní košík</h1>

          {cartItems.length === 0 ? (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-700">
                Váš košík je prázdný{' '}
                <Link
                  href="/"
                  className="text-[#071e46] hover:text-[#9b7d57] font-medium underline"
                >
                  Zpět
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-6 md:gap-4 md:items-center">
                    <div className="col-span-1">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>

                    <div className="col-span-2">
                      <Link
                        href={`/product/${item.product}`}
                        className="text-[#071e46] hover:text-[#9b7d57] font-medium no-underline"
                      >
                        {item.name}
                      </Link>
                    </div>

                    <div className="col-span-1 text-[#191817]">{item.price} Kč</div>

                    <div className="col-span-1">
                      <select
                        value={item.qty}
                        onChange={(e) => addToCart(item.product, Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb2e6] focus:border-transparent"
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => removeFromCartHandler(item.product)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                      >
                        <Trash size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-3">
                    <div className="flex gap-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1">
                        <Link
                          href={`/product/${item.product}`}
                          className="text-[#071e46] hover:text-[#9b7d57] font-medium no-underline"
                        >
                          {item.name}
                        </Link>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#191817]">{item.price} Kč</span>

                      <div className="flex items-center gap-2">
                        <select
                          value={item.qty}
                          onChange={(e) => addToCart(item.product, Number(e.target.value))}
                          className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2bb2e6]"
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => removeFromCartHandler(item.product)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary Section */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-4">
            <h2 className="text-xl font-semibold text-[#071e46] mb-4">Položiek ({totalItems})</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-[#191817]">
                <span>Produkty:</span>
                <span>{totalPrice} Kč</span>
              </div>

              <div className="flex justify-between text-[#191817]">
                <span>Poštovné a balné:</span>
                <span>{shippingPrice} Kč</span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between font-semibold text-[#071e46] text-lg">
                <span>Celkem:</span>
                <span>{finalTotal} Kč</span>
              </div>
            </div>

            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className="w-full mb-3 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              >
                Přejít k pokladně
              </button>
            )}

            <button
              onClick={continueShopping}
              type="button"
              className="w-full px-4 py-3 bg-[#2bb2e6] text-white rounded-lg hover:bg-[#218334] transition-colors duration-200 font-medium"
            >
              Pokračovat v nákupu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
const CartScreen = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Cart />
    </Suspense>
  )
}

export default CartScreen
