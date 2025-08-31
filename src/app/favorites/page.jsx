'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import useProductStore from '@/store/productStore'
import useUserStore from '@/store/userStore'
import Product from '@/app/components/Product'
import { X } from 'lucide-react'

const Favorites = () => {
  const router = useRouter()

  const { allProducts: products, getAllProducts, removeFromFavorites } = useProductStore()
  const { userInfo } = useUserStore()

  useEffect(() => {
    getAllProducts()
  }, [getAllProducts])

  let favoriteProducts = []

  // Create unique Set
  let favoriteProductsSet = new Set()
  if (userInfo && products.length > 0) {
    products.forEach((prod) => {
      if (prod.favoriteOf && Array.isArray(prod.favoriteOf) && prod.favoriteOf.length > 0) {
        // Check if any favorite record has the current user's ID
        const isUserFavorite = prod.favoriteOf.some((fav) => {
          // Handle both string and number user IDs
          const favUserId = fav.favoriteOf?.toString()
          const currentUserId = userInfo.id?.toString()
          return favUserId === currentUserId
        })

        if (isUserFavorite) {
          favoriteProductsSet.add(prod)
        }
      }
    })

    // Convert back to Array
    favoriteProducts = Array.from(favoriteProductsSet)
  }

  // Remove from Favs Handler
  const removeFromFavoritesHandler = async (productId) => {
    await removeFromFavorites(productId, userInfo.id)
    getAllProducts() // Refresh to update the list
  }

  return (
    <div className="container mx-auto px-4">
      <button
        className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
        onClick={() => router.back()}
      >
        ← Späť
      </button>

      <div className="my-3">
        <h1 className="text-3xl font-bold text-[#071e46] mb-8">Moje oblíbené produkty</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.length > 0 ? (
            favoriteProducts.map((product) => (
              <div key={product.id} className="relative flex flex-col h-full">
                <button
                  onClick={() => removeFromFavoritesHandler(product.id)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-md"
                  aria-label="Odstranit z oblíbených"
                >
                  <X size={16} />
                </button>
                <Product product={product} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h4 className="text-xl text-[#9b7d57] mb-4">Nemáte žádné oblíbené produkty</h4>
              {!userInfo && (
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 bg-[#2bb2e6] text-white rounded hover:bg-[#218334] transition-colors duration-200 font-medium"
                >
                  Přihlásit se
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Favorites
