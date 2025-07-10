// app/library/[id]/LibraryClient.js
'use client'
import React, { useLayoutEffect } from 'react'
import { ArrowUp } from 'lucide-react'

const LibraryClient = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 250)
  }, [])

  return (
    <button
      className="fixed bottom-8 right-8 p-3 bg-[#2bb2e6] text-white rounded-full shadow-lg hover:bg-[#218334] transition-colors duration-200 z-50"
      onClick={() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={24} />
    </button>
  )
}

export default LibraryClient
