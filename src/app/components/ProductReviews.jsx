// components/ProductReviews.jsx (Client Component for Reviews)
'use client'
import { useState, useLayoutEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useUserStore from '@/store/userStore'
import Message from '@/app/components/Message'

export default function ProductReviews({ product, initialReviews }) {
  const [comment, setComment] = useState('')
  const [message, setMessage] = useState('')
  const [successProductReview, setSuccessProductReview] = useState(false)
  const [errorProductReview, setErrorProductReview] = useState(null)
  const [reviews, setReviews] = useState(initialReviews)

  const { userInfo } = useUserStore()
  const router = useRouter()

  useLayoutEffect(() => {
    if (successProductReview) {
      setMessage('Recenzia odoslaná adminovi')
      setComment('')
      setSuccessProductReview(false)
    }
    window.scrollTo(0, 250)
  }, [successProductReview])

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const response = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({ rating: 0, comment }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit review')
      }

      setSuccessProductReview(true)
    } catch (err) {
      setErrorProductReview(err.message)
    }
  }

  return (
    <div className="flex flex-wrap lg:mx-4 mt-8">
      <div className="w-full md:w-1/2 lg:px-4">
        <h2 className="text-2xl font-bold mb-4">Recenzie</h2>
        {reviews.length === 0 && <Message>Žiadne recenzie</Message>}
        <div className="space-y-4">
          {reviews.map(
            (review) =>
              review.isAcknowledged === true && (
                <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                  <strong>{review.name}</strong>
                  <p>{review.comment}</p>
                </div>
              ),
          )}

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Napíšte recenziu</h2>
            {errorProductReview && <Message variant="danger">{errorProductReview}</Message>}
            {message && <Message variant="success">{message}</Message>}

            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="mb-4">
                  <textarea
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Napíšte vašu recenziu..."
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2bb2e6] text-white rounded hover:bg-blue-700"
                >
                  Odoslať
                </button>
              </form>
            ) : (
              <Message>
                Prosím <Link href="/login">Prihláste sa</Link> pre napísanie recenzie
              </Message>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
