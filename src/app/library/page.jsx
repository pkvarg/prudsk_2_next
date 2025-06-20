'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import PaginateLibrary from '@/app/components/PaginateLibrary'
import useProductStore from '@/store/productStore'

const Library = () => {
  const params = useParams()
  const [currentPage, setCurrentPage] = useState(1)

  const keyword = params.keyword
  const pageSize = 2 // Set to 2 products per page as requested

  const { products, page, pages, listLibraryProducts, loading, error } = useProductStore()

  useEffect(() => {
    listLibraryProducts(keyword, currentPage, pageSize)
  }, [keyword, currentPage, listLibraryProducts])

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum)
  }

  // Reset to page 1 when keyword changes
  useEffect(() => {
    setCurrentPage(1)
  }, [keyword])

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

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <>
            <div className="space-y-8">
              {products.map((product) => (
                <div key={product.id} className="mb-8">
                  <h2 className="text-2xl font-semibold text-[#071e46] mb-4">{product.name}</h2>

                  <div className="flex flex-col md:flex-row gap-6">
                    <Link href={`/product/${product.id}`} className="flex-shrink-0">
                      <Image
                        src={product.excerpt.image || '/images/default-book.jpg'}
                        alt={product.name}
                        width={300}
                        height={225}
                        sizes="(max-width: 768px) 100vw, 300px"
                        style={{
                          width: 'auto',
                          height: 'auto',
                          maxWidth: '100%',
                        }}
                        className="md:w-[300px] object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-200"
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
              ))}
            </div>

            {/* Show message if no products found */}
            {products.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-gray-600">Žádné publikace s úryvky nebyly nalezeny.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Only show pagination if there are multiple pages */}
      <PaginateLibrary pages={pages} page={currentPage} onPageChange={handlePageChange} />
    </div>
  )
}

export default Library
