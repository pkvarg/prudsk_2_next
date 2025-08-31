// app/eshop/[category]/CategoryClient.js
'use client'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import Product from '@/app/components/Product'

const CategoryClient = ({ initialProducts, category }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name') // 'name', 'price', 'newest'

  // Format category name for display (moved to client component)
  const formatCategoryName = (cat) => {
    if (!cat) return 'Eshop'
    if (cat === 'abecední-seznam-kníh') return 'Abecedný zoznam kníh'
    const formatted = cat.replace(/-/g, ' ')
    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase()
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(initialProducts)) {
      return []
    }

    let filtered = [...initialProducts]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.author?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '')
        case 'price':
          return (a.price || 0) - (b.price || 0)
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        default:
          return (a.name || '').localeCompare(b.name || '')
      }
    })

    return filtered
  }, [initialProducts, searchTerm, sortBy])

  return (
    <>
      {/* Products Display */}
      {filteredProducts.length > 0 ? (
        <>
          {/* Show filtered count if search is active */}
          {searchTerm && (
            <div className="mb-4">
              <p className="text-[#9b7d57]">
                Nájdených {filteredProducts.length}{' '}
                {filteredProducts.length === 1
                  ? 'produkt'
                  : filteredProducts.length < 5
                  ? 'produkty'
                  : 'produktov'}{' '}
                pro &quot;{searchTerm}&quot;
              </p>
            </div>
          )}

          {/* Alphabetical list view */}
          {category === 'abecední-seznam-kníh' ? (
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="block p-3 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 hover:border-[#9b7d57] transition-all duration-200"
                >
                  <p className="text-[#071e46] hover:text-[#9b7d57] font-medium">{product.name}</p>
                  {product.author && (
                    <p className="text-sm text-gray-600 mt-1">Autor: {product.author}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <>
              {/* Desktop grid */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex flex-col h-full">
                    <Product product={product} />
                  </div>
                ))}
              </div>

              {/* Mobile grid */}
              <div className="md:hidden grid grid-cols-1 gap-4">
                {filteredProducts.map((product) => (
                  <div key={`mobile-${product.id}`} className="flex flex-col">
                    <Product product={product} />
                  </div>
                ))}
              </div>
            </>
          )}
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#071e46] mb-2">
              {searchTerm || category ? 'Žiadne produkty nenájdené' : 'Žiadne produkty k dispozícii'}
            </h3>
            <p className="text-[#9b7d57] mb-4">
              {searchTerm
                ? `Pre hľadaný výraz "${searchTerm}" neboli nájdené žiadne produkty.`
                : category
                ? `V kategórii "${formatCategoryName(category)}" nie sú momentálne žiadne produkty.`
                : 'Momentálne nie sú k dispozícii žiadne produkty.'}
            </p>
            {(searchTerm || category !== 'abecední-seznam-kníh') && (
              <div className="space-x-2">
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-[#071e46] text-white rounded hover:bg-[#9b7d57] transition-colors duration-200"
                  >
                    Zrušiť vyhľadávanie
                  </button>
                )}
                <Link
                  href="/eshop/abecední-seznam-kníh"
                  className="inline-block px-4 py-2 bg-[#edeae4] text-[#071e46] rounded hover:bg-[#9b7d57] hover:text-white transition-colors duration-200"
                >
                  Zobraziť všetky produkty
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default CategoryClient
