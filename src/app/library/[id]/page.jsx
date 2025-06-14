'use client'

import React, { useEffect, useLayoutEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import useProductStore from '@/store/productStore'
import { ArrowUp } from 'lucide-react'

const LibraryExcerpt = () => {
  const params = useParams()
  const productId = params.id
  const router = useRouter()

  const { products, listProducts } = useProductStore()

  useLayoutEffect(() => {
    window.scrollTo(0, 250)
  })

  useEffect(() => {
    listProducts()
  }, [listProducts])

  // Find the specific product
  const product = products.find((p) => p.id === productId)

  return (
    <div className="container mx-auto px-4">
      <button
        className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
        onClick={() => router.back()}
      >
        ← Zpět
      </button>

      <div className="my-3">
        {product && product.excerpt?.excerpt && (
          <div key={product.id} className="mb-8">
            <h1 className="text-3xl font-bold text-[#071e46] mb-8">{product.name}</h1>

            <div className="relative">
              <Link href={`/product/${product.id}`} className="float-left mr-8 mb-6 block">
                <Image
                  src={product.excerpt.image}
                  alt={product.name}
                  width={800}
                  height={600}
                  className="w-full max-w-xl h-auto object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-200"
                />
              </Link>

              <div className="text-justify">
                <p className="text-[#191817] text-[18px] leading-relaxed whitespace-pre-line">
                  {product.excerpt.excerpt}
                </p>
              </div>

              <div className="clear-both"></div>
            </div>
          </div>
        )}

        <button
          className="fixed bottom-8 right-8 p-3 bg-[#2bb2e6] text-white rounded-full shadow-lg hover:bg-[#218334] transition-colors duration-200 z-50"
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      </div>
    </div>
  )
}

export default LibraryExcerpt
