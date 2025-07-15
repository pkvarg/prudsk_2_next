// components/FavoriteButton.jsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useUserStore from '@/store/userStore'
import * as Icon from 'react-bootstrap-icons'
import Message from './Message'
import axios from 'axios'

export default function FavoriteButton({ product }) {
  const [message, setMessage] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const { userInfo } = useUserStore()
  const router = useRouter()

  const addToFavoritesHandler = async (productId) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const response = await fetch(`/api/products/${productId}/favorites`, {
        method: 'PUT',
        headers: config.headers,
        body: JSON.stringify({ favoriteOf: userInfo.id }),
      })
      // const res = await response.json()
      // console.log('res', res)
      // if (res.message) setMessage(res.message)
      router.refresh()
    } catch (err) {
      console.log('Error adding to favorites:', err)
    }
  }

  useEffect(() => {
    const checkIsFavorite = async () => {
      try {
        const response = await axios.get(`/api/products/${product.id}/favorites`)
        if (response.data.message === 'isFavorite') setIsFavorite(true)
      } catch (err) {
        console.log('Error adding to favorites:', err)
      }
    }
    checkIsFavorite()
  }, [product])

  if (!userInfo) return null

  return (
    <div className="flex flex-col gap-4">
      <button className="ml-4" onClick={() => addToFavoritesHandler(product.id)}>
        {isFavorite ? (
          <Icon.HeartFill className="w-6 h-6 text-red-500" />
        ) : (
          <p className="text-blue-600 cursor-pointer hover:underline">Přidat k oblíbeným</p>
        )}
      </button>
      {message && <Message variant="success">{message}</Message>}
    </div>
  )
}
