// components/CartSection.jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useCartStore from '@/store/cartStore'
import Message from '@/app/components/Message'

export default function CartSection({ product }) {
  const [qty, setQty] = useState(1)
  const [message, setMessage] = useState('')
  const { addToCart } = useCartStore()
  const router = useRouter()

  const addToCartHandler = () => {
    if (product) {
      addToCart(product.id, Number(qty))
      router.push('/cart')
    }
  }

  const continueShopping = () => {
    router.push('/')
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <p>Cena:</p>
          <div className="text-right">
            {product.discount ? (
              <div>
                <span className="text-green-600 font-semibold">Sleva {product.discount}%</span>
                <h5 className="text-xl font-bold">{product.discountedPrice} Kč</h5>
              </div>
            ) : (
              <p className="text-xl font-bold">{product.price} Kč</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p>Status:</p>
          <p className={product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}>
            {product.countInStock > 0 ? 'Na skladě' : 'Vyprodané'}
          </p>
        </div>

        {product.countInStock > 0 && (
          <div className="flex justify-between items-center">
            <p>Počet:</p>
            <select
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {[...Array(product.countInStock).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={addToCartHandler}
          className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
          disabled={product.countInStock === 0}
        >
          Přidat do košíku
        </button>

        <button
          onClick={continueShopping}
          className="w-full py-2 px-4 bg-[#2bb2e6] text-white rounded hover:bg-blue-700"
        >
          Pokračovat v nákupu
        </button>
      </div>

      {message && (
        <div className="p-4">
          <Message variant="success">{message}</Message>
        </div>
      )}
    </div>
  )
}
