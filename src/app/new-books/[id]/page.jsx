'use client'
import React, { useEffect, useMemo } from 'react'
import Link from 'next/link'

import { useParams } from 'next/navigation'
import useProductStore from '@/store/productStore' // Adjust path as needed
import Product from '@/app/components/Product'

const NewBooks = () => {
  const params = useParams()

  const year = params.id

  // Zustand store selectors
  const { products, allProducts, loading, error, getAllProducts, getProductDetails } =
    useProductStore()

  useEffect(() => {
    // Fetch all products when component mounts
    getAllProducts()
  }, [getAllProducts])

  useEffect(() => {
    // Fetch product details for specific year if needed
    if (year) {
      getProductDetails(year)
    }
  }, [year, getProductDetails])

  console.log('products', products)
  console.log('all products', allProducts)

  // Filter products by year using useMemo for performance
  const productsByYear = useMemo(() => {
    if (!allProducts || !year) return []
    return allProducts.filter((product) => product.year === year)
  }, [allProducts, year])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#071e46]"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Chyba při načítání produktů: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto lg:mx-[10%] px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-[#9b7d57] text-white rounded hover:bg-[#071e46] transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Zpět
        </Link>
      </div>

      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#071e46] mb-2">Knihy {year}</h1>
        {productsByYear.length > 0 && (
          <p className="text-[#9b7d57] text-lg">
            Nalezeno {productsByYear.length}{' '}
            {productsByYear.length === 1 ? 'kniha' : productsByYear.length < 5 ? 'knihy' : 'knih'}
          </p>
        )}
      </div>

      {/* Products grid */}
      {productsByYear.length > 0 ? (
        <>
          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {productsByYear.map((product) => (
              <div key={product.id} className="flex flex-col h-full">
                <Product product={product} />
              </div>
            ))}
          </div>

          {/* Mobile grid */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {productsByYear.map((product) => (
              <div key={`mobile-${product.id}`} className="flex flex-col">
                <Product product={product} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-[#9b7d57]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#071e46] mb-2">Žádné knihy nenalezeny</h3>
            <p className="text-[#9b7d57]">
              Pro rok {year} nejsou momentálně k dispozici žádné knihy.
            </p>
            <div className="mt-6">
              <Link
                href="/eshop/abecední-seznam-kníh"
                className="inline-flex items-center px-4 py-2 bg-[#071e46] text-white rounded hover:bg-[#9b7d57] transition-colors duration-200"
              >
                Procházet všechny knihy
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewBooks
