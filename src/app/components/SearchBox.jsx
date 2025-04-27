'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'react-bootstrap-icons'

const SearchBox = () => {
  const [keyword, setKeyword] = useState('')
  const router = useRouter()

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      router.push(`/search/${keyword}`)
    } else {
      router.push('/')
    }
  }

  return (
    <form onSubmit={submitHandler} className="flex">
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Zadejte text..."
        className="text-lg rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
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
