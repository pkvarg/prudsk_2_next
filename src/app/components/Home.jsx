'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import useProductStore from '@/store/productStore'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'
import { useParams } from 'next/navigation'

const HomeScreen = () => {
  const { keyword } = useParams()

  console.log('keyword', keyword)

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  const { products, loading, error, pages, listProducts, searchKeyword } = useProductStore()

  // Reset to page 1 when keyword changes
  useEffect(() => {
    setCurrentPage(1)
  }, [keyword])

  useEffect(() => {
    listProducts(searchKeyword || '', currentPage, pageSize)
  }, [listProducts, searchKeyword, currentPage])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  return (
    <main className="mx-[7%]">
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link
          href="/"
          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded my-3 transition-colors"
        >
          Zpět
        </Link>
      )}

      <h1 className="!text-3xl !font-normal text-[#9E7B54] mb-4">Naše publikace</h1>
      <hr className="border-gray-300 mb-6" />

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <div key={product.id} className="w-full">
                <Product product={product} />
              </div>
            ))}
          </div>

          {/* Mobile Grid */}
          <div className="md:hidden grid grid-cols-1 gap-4 mb-8">
            {products.map((product) => (
              <div key={`mobile-${product.id}`} className="w-full">
                <Product product={product} />
              </div>
            ))}
          </div>

          <Paginate pages={pages} page={currentPage} onPageChange={handlePageChange} />
        </>
      )}
    </main>
  )
}

export default HomeScreen
