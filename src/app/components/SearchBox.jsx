'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'react-bootstrap-icons'
import useProductStore from '@/store/productStore'

const SearchBox = () => {
  const [keyword, setKeyword] = useState('')
  const router = useRouter()
  const { setSearchKeyword, clearSearch, listProducts, searchKeyword } = useProductStore()

  // Clear input field when search is cleared from elsewhere
  useEffect(() => {
    if (!searchKeyword) {
      setKeyword('')
    }
  }, [searchKeyword])

  const submitHandler = (e) => {
    e.preventDefault()
    const trimmedKeyword = keyword.trim()

    if (trimmedKeyword) {
      setSearchKeyword(trimmedKeyword)
      // Navigate with search parameter to update URL
      router.push(`/?keyword=${encodeURIComponent(trimmedKeyword)}`)
    } else {
      clearSearch()
      // Navigate back to home page without search parameter
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
