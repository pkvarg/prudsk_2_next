'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import useProductStore from '@/store/productStore'
import Product from '@/app/components/Product'

const Eshop = () => {
  const params = useParams()

  const category = params.category ? decodeURIComponent(params.category) : null

  // Format category name for display
  const formatCategoryName = (cat) => {
    if (!cat) return 'Eshop'
    const formatted = cat.replace(/-/g, ' ')
    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase()
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name') // 'name', 'price', 'newest'

  // Zustand store
  const { allProducts = [], loading, error, getAllProducts } = useProductStore()

  useEffect(() => {
    getAllProducts()
  }, [getAllProducts])

  // Filter products by category and search term
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(allProducts)) {
      return []
    }

    let filtered = allProducts

    // Filter by category (unless it's alphabetical list)
    if (category && category !== 'abecední-seznam-kníh') {
      filtered = allProducts.filter(
        (product) => product.category === category || product.category2 === category,
      )
    }

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
  }, [allProducts, category, searchTerm, sortBy])

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#071e46]"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold mb-2">Chyba při načítání produktů</h3>
          <p>{error}</p>
          <button
            onClick={() => fetchProducts()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Zkusit znovu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
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

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#071e46] mb-2">
          {category ? formatCategoryName(category) : 'Eshop'}
        </h1>
        <p className="text-[#9b7d57] text-lg">
          {filteredProducts.length}{' '}
          {filteredProducts.length === 1
            ? 'produkt'
            : filteredProducts.length < 5
            ? 'produkty'
            : 'produktů'}
        </p>
      </div>

      {/* Category display frame */}
      {/* {category && (
        <div className="mb-6">
          <div className="bg-[#edeae4] px-4 py-3 rounded-lg border-l-4 border-[#071e46]">
            <h2 className="text-lg font-semibold text-[#071e46]">{formatCategoryName(category)}</h2>
          </div>
        </div>
      )} */}

      {/* Search and Controls */}
      {category !== 'abecední-seznam-kníh' && (
        <div className="mb-8 space-y-4">
          {/* Search bar */}
          <div className="max-w-md">
            <label htmlFor="search" className="block text-sm font-medium text-[#071e46] mb-2">
              Hledat produkty
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Zadejte název, popis nebo autora..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071e46] focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Sort options */}
          {/* <div className="flex items-center justify-between">
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-[#071e46] mb-1">
                Řadit podle
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071e46] focus:border-transparent text-sm"
              >
                <option value="name">Názvu (A-Z)</option>
                <option value="price">Ceny (nejlevnější)</option>
                <option value="newest">Nejnovější</option>
              </select>
            </div>

           
            <div className="text-sm text-[#9b7d57]">
              Zobrazeno {filteredProducts.length} produktů
            </div>
          </div> */}
        </div>
      )}

      {/* Clear search */}
      {searchTerm && (
        <div className="mb-6">
          <button
            onClick={() => setSearchTerm('')}
            className="text-sm text-[#9b7d57] hover:text-[#071e46] transition-colors"
          >
            ✕ Zrušit vyhledávání "{searchTerm}"
          </button>
        </div>
      )}

      {/* Products Display */}
      {filteredProducts.length > 0 ? (
        <>
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
              {searchTerm || category ? 'Žádné produkty nenalezeny' : 'Žádné produkty k dispozici'}
            </h3>
            <p className="text-[#9b7d57] mb-4">
              {searchTerm
                ? `Pro hledaný výraz "${searchTerm}" nebyly nalezeny žádné produkty.`
                : category
                ? `V kategorii "${formatCategoryName(category)}" nejsou momentálně žádné produkty.`
                : 'Momentálně nejsou k dispozici žádné produkty.'}
            </p>
            {(searchTerm || category !== 'abecední-seznam-kníh') && (
              <div className="space-x-2">
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-[#071e46] text-white rounded hover:bg-[#9b7d57] transition-colors duration-200"
                  >
                    Zrušit vyhledávání
                  </button>
                )}
                <Link
                  href="/eshop/abecední-seznam-kníh"
                  className="inline-block px-4 py-2 bg-[#edeae4] text-[#071e46] rounded hover:bg-[#9b7d57] hover:text-white transition-colors duration-200"
                >
                  Zobrazit všechny produkty
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation to other categories */}
      {filteredProducts.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-medium text-[#071e46] mb-4">
              Prohlédněte si další kategorie
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/eshop/abecední-seznam-kníh"
                className="px-4 py-2 bg-[#edeae4] text-[#071e46] rounded hover:bg-[#9b7d57] hover:text-white transition-colors duration-200"
              >
                Všechny knihy
              </Link>
              <Link
                href="/eshop/křesťanská-praxe"
                className="px-4 py-2 bg-[#edeae4] text-[#071e46] rounded hover:bg-[#9b7d57] hover:text-white transition-colors duration-200"
              >
                Křesťanská praxe
              </Link>
              <Link
                href="/eshop/evangelium"
                className="px-4 py-2 bg-[#edeae4] text-[#071e46] rounded hover:bg-[#9b7d57] hover:text-white transition-colors duration-200"
              >
                Evangelium
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Eshop
