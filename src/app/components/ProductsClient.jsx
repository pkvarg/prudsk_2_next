// components/ProductsClient.jsx
'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import useProductStore from '@/store/productStore'
import Product from './Product'
import Message from './Message'
import Loader from './Loader'
import Paginate from './Paginate'

export default function ProductsClient({
  initialProducts,
  initialPages,
  initialError,
  initialKeyword,
}) {
  const searchParams = useSearchParams()
  const keyword = searchParams.get('keyword') || ''

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // Create a ref for the products section
  const productsRef = useRef(null)

  const { products, loading, error, pages, listProducts, searchKeyword } = useProductStore()

  // Initialize store with server data
  useEffect(() => {
    if (initialProducts) {
      useProductStore.setState({
        products: initialProducts,
        pages: initialPages,
        error: initialError,
        searchKeyword: initialKeyword,
      })
    }
  }, [initialProducts, initialPages, initialError, initialKeyword])

  // Reset to page 1 when keyword changes
  useEffect(() => {
    setCurrentPage(1)
  }, [keyword])

  useEffect(() => {
    // Only fetch if search params changed or if we're not on page 1
    if (searchKeyword !== keyword || currentPage !== 1) {
      listProducts(keyword, currentPage, pageSize)
    }
  }, [listProducts, keyword, currentPage, searchKeyword])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)

    // Scroll to products section after a short delay to ensure content is loaded
    setTimeout(() => {
      if (productsRef.current) {
        productsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }, 100)
  }

  // Use initial data if available, otherwise use store data
  const displayProducts = products.length > 0 ? products : initialProducts || []
  const displayPages = pages || initialPages || 0
  const displayError = error || initialError
  const displayLoading = loading && !initialProducts

  return (
    <>
      {keyword && (
        <Link
          href="/"
          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded my-3 transition-colors"
        >
          Zpět
        </Link>
      )}

      {/* Products section with ref for scrolling */}
      <div ref={productsRef}>
        {displayLoading ? (
          <Loader />
        ) : displayError ? (
          <Message variant="danger">{displayError}</Message>
        ) : (
          <>
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {displayProducts.map((product) => (
                <div key={product.id} className="w-full">
                  <Product product={product} />
                </div>
              ))}
            </div>

            {/* Mobile Grid */}
            <div className="md:hidden grid grid-cols-1 gap-4 mb-8">
              {displayProducts.map((product) => (
                <div key={`mobile-${product.id}`} className="w-full">
                  <Product product={product} />
                </div>
              ))}
            </div>

            <Paginate pages={displayPages} page={currentPage} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </>
  )
}
