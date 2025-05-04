'use client'

import React, { useState, useEffect, useLayoutEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import useUserStore from '../../../store/userStore'
import useCartStore from '../../../store/cartStore'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import Meta from '../../components/Meta'
import * as Icon from 'react-bootstrap-icons'

const ProductPage = () => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([])
  const [successProductReview, setSuccessProductReview] = useState(false)
  const [errorProductReview, setErrorProductReview] = useState(null)

  const params = useParams()
  const router = useRouter()
  const id = params.id

  const userInfo = useUserStore((state) => state.userInfo)
  const addToCart = useCartStore((state) => state.addToCart)

  useLayoutEffect(() => {
    if (successProductReview) {
      setMessage('Recenze odeslaná adminovi')
      setRating(0)
      setComment('')
      setSuccessProductReview(false)
    }
    window.scrollTo(0, 250)
  }, [successProductReview])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
        const response = await fetch('/api/products', config)
        const data = await response.json()

        console.log('prod data', data)

        setProducts(data.products || [])
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [userInfo])

  const addToCartHandler = () => {
    const product = products.find((p) => p.id === id)
    if (product) {
      addToCart({
        product: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: Number(qty),
      })
      router.push(`/cart`)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const response = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({ rating, comment }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      setSuccessProductReview(true)
    } catch (err) {
      setErrorProductReview(err.message)
    }
  }

  const continueShopping = () => {
    router.push('/')
  }

  const handleLink = (id) => {
    router.push(`/product/${id}`)
  }

  const commentHandler = (comment) => {
    setComment(comment)
  }

  const addToFavoritesHandler = async (productId) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      await fetch(`/api/products/${productId}/favorite`, {
        method: 'PUT',
        headers: config.headers,
        body: JSON.stringify({ favoriteOf: userInfo.id }),
      })
      router.push(`/product/${id}`)
    } catch (err) {
      console.error('Error adding to favorites:', err)
    }
  }

  let isFavorite = false
  if (userInfo && Array.isArray(products)) {
    products.forEach((prod) => {
      if (Array.isArray(prod.favoriteOf)) {
        prod.favoriteOf.forEach((fav) => {
          if (prod.id === id && fav.id === userInfo.id) {
            isFavorite = true
          }
        })
      }
    })
  }

  return (
    <>
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault()
          router.back()
        }}
        className="inline-block px-4 py-2 mb-6 text-blue-600 hover:text-blue-800"
      >
        Zpět
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {products.map(
            (product) =>
              product.id === id && (
                <div key={product.id}>
                  <Meta title={product.name} />
                  <div className="flex flex-wrap -mx-4">
                    <div className="w-full md:w-1/4 px-4 mb-6">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full rounded-lg"
                      />

                      <div className="hidden md:block mt-6 p-4 bg-white rounded-lg shadow">
                        <h5 className="text-lg font-semibold mb-2">Katalóg</h5>
                        <h6 className="mb-4">{product.catalog}</h6>

                        {product.related && (
                          <h5 className="text-lg font-semibold mb-2">Pozrite si tiež</h5>
                        )}

                        {product.related && (
                          <div
                            onClick={() => handleLink(product.related.id)}
                            className="cursor-pointer"
                          >
                            <h6 className="text-blue-600 hover:underline mb-2">
                              {product.related.name}
                            </h6>
                          </div>
                        )}
                        {product.related2 && (
                          <div
                            onClick={() => handleLink(product.related2.id)}
                            className="cursor-pointer"
                          >
                            <h6 className="text-blue-600 hover:underline mb-2">
                              {product.related2.name}
                            </h6>
                          </div>
                        )}
                        {product.related3 && (
                          <div
                            onClick={() => handleLink(product.related3.id)}
                            className="cursor-pointer"
                          >
                            <h6 className="text-blue-600 hover:underline mb-2">
                              {product.related3.name}
                            </h6>
                          </div>
                        )}

                        <h5 className="text-lg font-semibold mb-2">Hmotnost</h5>
                        <h6 className="mb-4">{product.weight?.replace('.', ',')}kg</h6>

                        <h5 className="text-lg font-semibold mb-2">Tagy</h5>
                        <h6 className="mb-4">{product.tags}</h6>

                        <h5 className="text-lg font-semibold mb-2">Vazba</h5>
                        <h6 className="mb-4">{product.binding}</h6>

                        <h5 className="text-lg font-semibold mb-2">Počet stran</h5>
                        <h6 className="mb-4">{product.pages}</h6>

                        <h5 className="text-lg font-semibold mb-2">ISBN:</h5>
                        <h6 className="mb-4">{product.isbn}</h6>

                        <h5 className="text-lg font-semibold mb-2">Jazyk</h5>
                        {product.language === 'SK' ? (
                          <Image
                            src="/images/flag_sk40px_0.png"
                            alt={product.name}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <Image
                            src="/images/flag_cz40px_2_27.png"
                            alt={product.name}
                            width={40}
                            height={40}
                          />
                        )}

                        {product.excerpt?.excerpt && (
                          <Link href={`/library/${product.id}`}>
                            <h5 className="text-lg font-semibold mb-2 text-blue-600 hover:underline">
                              Do čítárny
                            </h5>
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 px-4 mb-6">
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow">
                          <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-bold">{product.name}</h3>
                            {userInfo && (
                              <button
                                className="ml-4"
                                onClick={() => addToFavoritesHandler(product.id)}
                              >
                                {isFavorite ? (
                                  <Icon.HeartFill className="w-6 h-6 text-red-500" />
                                ) : (
                                  <p className="text-blue-600 hover:underline">
                                    Přidat k oblíbeným
                                  </p>
                                )}
                              </button>
                            )}
                          </div>
                          <h4 className="text-xl mt-2">{product.author}</h4>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow">
                          <p>Cena: {product.price} Kč</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow">
                          <p>Popis: {product.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-1/4 px-4">
                      <div className="bg-white rounded-lg shadow">
                        <div className="p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <p>Cena:</p>
                            <div className="text-right">
                              {product.discount ? (
                                <div>
                                  <span className="text-green-600 font-semibold">
                                    Sleva {product.discount}%
                                  </span>
                                  <h5 className="text-xl font-bold">
                                    {product.discountedPrice} Kč
                                  </h5>
                                </div>
                              ) : (
                                <p className="text-xl font-bold">{product.price} Kč</p>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <p>Status:</p>
                            <p
                              className={
                                product.countInStock > 0 ? 'text-green-600' : 'text-red-600'
                              }
                            >
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
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
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
                    </div>
                  </div>
                </div>
              ),
          )}

          <div className="container mx-auto px-4">
            {products.map(
              (product) =>
                product.id === id && (
                  <div key={product.id} className="md:hidden mt-6 p-4 bg-white rounded-lg shadow">
                    <h5 className="text-lg font-semibold mb-2">Katalog</h5>
                    <h6 className="mb-4">{product.catalog}</h6>

                    {product.related && (
                      <h5 className="text-lg font-semibold mb-2">Podívejte se také na</h5>
                    )}

                    {product.related && (
                      <div
                        onClick={() => handleLink(product.related.id)}
                        className="cursor-pointer"
                      >
                        <h6 className="text-blue-600 hover:underline mb-2">
                          {product.related.name}
                        </h6>
                      </div>
                    )}
                    {product.related2 && (
                      <div
                        onClick={() => handleLink(product.related2.id)}
                        className="cursor-pointer"
                      >
                        <h6 className="text-blue-600 hover:underline mb-2">
                          {product.related2.name}
                        </h6>
                      </div>
                    )}
                    {product.related3 && (
                      <div
                        onClick={() => handleLink(product.related3.id)}
                        className="cursor-pointer"
                      >
                        <h6 className="text-blue-600 hover:underline mb-2">
                          {product.related3.name}
                        </h6>
                      </div>
                    )}

                    <h5 className="text-lg font-semibold mb-2">Hmotnost</h5>
                    <h6 className="mb-4">{product.weight}</h6>

                    <h5 className="text-lg font-semibold mb-2">Tagy</h5>
                    <h6 className="mb-4">{product.tags}</h6>

                    <h5 className="text-lg font-semibold mb-2">Vazba</h5>
                    <h6 className="mb-4">{product.binding}</h6>

                    <h5 className="text-lg font-semibold mb-2">Počet stran</h5>
                    <h6 className="mb-4">{product.pages}</h6>

                    <h5 className="text-lg font-semibold mb-2">ISBN:</h5>
                    <h6 className="mb-4">{product.isbn}</h6>

                    <h5 className="text-lg font-semibold mb-2">Jazyk</h5>
                    {product.language === 'SK' && (
                      <Image
                        src="/images/flag_sk40px_0.png"
                        alt={product.name}
                        width={40}
                        height={40}
                      />
                    )}
                    {product.language === 'CZ' && (
                      <Image
                        src="/images/flag_cz40px_2_27.png"
                        alt={product.name}
                        width={40}
                        height={40}
                      />
                    )}

                    {product.excerpt?.excerpt && (
                      <Link href={`/library/${product.id}`}>
                        <h5 className="text-lg font-semibold mb-2 text-blue-600 hover:underline">
                          Do čítárny
                        </h5>
                      </Link>
                    )}
                  </div>
                ),
            )}
          </div>

          <div className="flex flex-wrap -mx-4 mt-8">
            {products.map(
              (product) =>
                product.id === id && (
                  <div className="w-full md:w-1/2 px-4" key={product.id}>
                    <h2 className="text-2xl font-bold mb-4">Recenze</h2>
                    {product.reviews?.length === 0 && <Message>Žádné recenze</Message>}

                    <div className="space-y-4">
                      {product.reviews?.map(
                        (review) =>
                          review.isAcknowledged === true && (
                            <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                              <strong>{review.name}</strong>
                              <p>{review.comment}</p>
                            </div>
                          ),
                      )}

                      <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-2xl font-bold mb-4">Napište recenzi</h2>
                        {errorProductReview && (
                          <Message variant="danger">{errorProductReview}</Message>
                        )}

                        {userInfo ? (
                          <form onSubmit={submitHandler}>
                            <div className="mb-4">
                              <textarea
                                className="w-full border rounded px-3 py-2"
                                rows="3"
                                value={comment}
                                onChange={(e) => commentHandler(e.target.value)}
                              />
                            </div>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Odeslat
                            </button>
                          </form>
                        ) : (
                          <Message>
                            Prosím <Link href="/login">Přihlašte se</Link> pro napsání recenze
                          </Message>
                        )}
                      </div>
                    </div>
                  </div>
                ),
            )}
          </div>
        </>
      )}
    </>
  )
}

export default ProductPage
