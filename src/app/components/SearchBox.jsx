'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'react-bootstrap-icons'
import useProductStore from '@/store/productStore'

const SearchBox = () => {
  const [keyword, setKeyword] = useState('')
  const router = useRouter()
  const { setSearchKeyword, clearSearch, listProducts } = useProductStore()

  const submitHandler = (e) => {
    e.preventDefault()
    const trimmedKeyword = keyword.trim()

    if (trimmedKeyword) {
      setSearchKeyword(trimmedKeyword)
      listProducts(trimmedKeyword, 1, 8)
      
      // Scroll to products section after search
      setTimeout(() => {
        const productsSection = document.querySelector('h1')
        if (productsSection) {
          productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }, 300)
    } else {
      clearSearch()
      listProducts('', 1, 8)
    }

    // Only navigate if not already on home page
    if (window.location.pathname !== '/') {
      router.push('/')
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setKeyword(value)

    // If user clears the input completely, clear the search
    if (value === '') {
      clearSearch()
    }
  }

  return (
    <form onSubmit={submitHandler} className="flex">
      <input
        type="text"
        name="q"
        value={keyword}
        onChange={handleInputChange}
        placeholder="Zadejte text..."
        className="text-lg pl-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
      />
      <button
        type="submit"
        className="mx-1 bg-[#2cb3e6] text-white font-normal text-xl px-4 py-2 rounded-r-lg hover:bg-white hover:text-[#24b9d6] hover:border-2 hover:border-[#24b9d6] transition-colors"
      >
        <Search />
      </button>
    </form>
  )
}

export default SearchBox
