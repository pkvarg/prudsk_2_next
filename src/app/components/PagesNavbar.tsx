'use client'
import React from 'react'
import Link from 'next/link'

const PagesNavbar = () => {
  return (
    <div className="flex flex-row justify-between">
      <Link href={'/'} className="p-2">
        Home
      </Link>
    </div>
  )
}

export default PagesNavbar
