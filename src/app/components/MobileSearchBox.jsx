'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'react-bootstrap-icons'
import useProductStore from '@/store/productStore'

const MobileSearchBox = () => {
  const [keyword, setKeyword] = useState('')
  const router = useRouter()
  const { setSearchKeyword, clearSearch } = useProductStore()

  const submitHandler = (e) => {
    e.preventDefault()
    const trimmedKeyword = keyword.trim()

    if (trimmedKeyword) {
      setSearchKeyword(trimmedKeyword)
    } else {
      clearSearch()
    }

    // Navigate to home page
    router.push('/')
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
        className="w-auto lg:w-auto text-lg pl-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
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

export default MobileSearchBox
