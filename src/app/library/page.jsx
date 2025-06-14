'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import PaginateLibrary from '@/app/components/PaginateLibrary'
import useProductStore from '@/store/productStore'

const Library = () => {
  const params = useParams()
  const router = useRouter()

  const keyword = params.keyword
  const pageNumber = params.pageNumber || 1
  const pageSize = 6

  const { products, page, pages, listProducts } = useProductStore()

  useEffect(() => {
    listProducts(keyword, pageNumber, pageSize)
  }, [keyword, pageNumber, listProducts])

  return (
    <div className="container mx-auto px-4">
      <Link
        href="/"
        className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
      >
        ← Zpět
      </Link>

      <div className="my-3">
        <h1 className="text-3xl font-bold text-[#071e46] mb-6">Čítárna</h1>

        <div className="space-y-8">
          {products.map(
            (product) =>
              product.excerpt.excerpt && (
                <div key={product.id} className="mb-8">
                  <h2 className="text-2xl font-semibold text-[#071e46] mb-4">{product.name}</h2>

                  <div className="flex flex-col md:flex-row gap-6">
                    <Link href={`/product/${product.id}`} className="flex-shrink-0">
                      <Image
                        src={product.excerpt.image}
                        alt={product.name}
                        width={300}
                        height={225}
                        className="w-full md:w-[300px] h-auto object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-200"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <p className="text-[#191817] text-[17px] leading-relaxed mb-4 mt-8">
                        {product.excerpt.part}
                      </p>

                      <Link
                        href={`/library/${product.id}`}
                        className="inline-block text-[#071e46] hover:text-[#9b7d57] font-medium underline decoration-2 underline-offset-4 hover:decoration-[#9b7d57] transition-colors duration-200"
                      >
                        Přečíst si víc
                      </Link>
                    </div>
                  </div>
                </div>
              ),
          )}
        </div>
      </div>

      <PaginateLibrary pages={pages} page={page} keyword={'library'} />
    </div>
  )
}

export default Library
