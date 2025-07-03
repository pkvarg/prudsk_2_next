// components/FavoriteButton.jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useUserStore from '@/store/userStore'
import * as Icon from 'react-bootstrap-icons'

export default function FavoriteButton({ product }) {
  const [message, setMessage] = useState('')
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
      const res = await response.json()
      if (res.message) setMessage(res.message)
      router.refresh()
    } catch (err) {
      console.log('Error adding to favorites:', err)
    }
  }

  let isFavorite = false
  if (userInfo && product && Array.isArray(product.favoriteOf)) {
    product.favoriteOf.forEach((fav) => {
      if (fav.id === userInfo.id) {
        isFavorite = true
      }
    })
  }

  if (!userInfo) return null

  return (
    <button className="ml-4" onClick={() => addToFavoritesHandler(product.id)}>
      {isFavorite ? (
        <Icon.HeartFill className="w-6 h-6 text-red-500" />
      ) : (
        <p className="text-blue-600 hover:underline">Přidat k oblíbeným</p>
      )}
    </button>
  )
}
