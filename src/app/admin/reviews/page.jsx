'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import useProductStore from '@/store/productStore'

const Reviews = () => {
  const params = useParams()
  const router = useRouter()

  // Zustand stores
  // const { products, page, pages, getAllProducts, acknowledgeProductReview, deleteProductReview } =
  //   useProductStore()
  const { getAllProducts, acknowledgeProductReview, getAllReviews, reviews, deleteProductReview } =
    useProductStore()

  useEffect(() => {
    getAllProducts()
    getAllReviews()
  }, [])

  const deleteHandler = async (product, comment) => {
    if (window.confirm('Odstránit recenzi?')) {
      await deleteProductReview(product, comment)
    }
    getAllReviews()
  }

  const acknowledgeHandler = async (productId, comment) => {
    acknowledgeProductReview(productId, comment)
    alert('Recenzia schválená')
    getAllReviews()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {reviews.map((review) => (
        <div
          key={review.id}
          className={`mb-4 p-4 rounded-lg shadow-md transition-all duration-300 ${
            review.isAcknowledged
              ? 'bg-green-50 border-2 border-green-300'
              : 'bg-red-50 border-2 border-red-300'
          }`}
        >
          <div className="mb-4">
            <p className="text-gray-800 mb-2 leading-relaxed">{review.comment}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <p className="font-semibold">{review.name}</p>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p
                className={`font-bold ${review.isAcknowledged ? 'text-green-600' : 'text-red-600'}`}
              >
                {review.isAcknowledged ? 'Schválená' : 'Neschválená'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/product/${review.productId}`}
              className="inline-block px-4 py-2 bg-gray-200 text-white rounded hover:bg-gray-400 transition-colors duration-200 text-sm font-medium"
            >
              Na produkt
            </Link>

            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-800 transition-colors duration-200 text-sm font-medium"
              onClick={() => acknowledgeHandler(review.productId, review.comment)}
            >
              Schválit recenzi
            </button>

            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
              onClick={() => deleteHandler(review.productId, review.comment)}
            >
              Smazat
            </button>
          </div>
        </div>
      ))}

      {reviews.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <p>Žádné recenze k zobrazení</p>
        </div>
      )}
    </div>
  )
}

export default Reviews
