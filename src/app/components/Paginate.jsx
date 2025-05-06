// components/Paginate.js
'use client'

import Link from 'next/link'

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  if (pages <= 1) {
    return null
  }

  // Ensure page is a number
  const currentPage = parseInt(page) || 1

  return (
    <div className="flex justify-center mt-4 mb-6">
      <ul className="flex space-x-1">
        {[...Array(pages).keys()].map((x) => {
          const pageNum = x + 1
          return (
            <li key={pageNum}>
              <Link
                href={
                  !isAdmin
                    ? keyword
                      ? `/search/${keyword}/page/${pageNum}`
                      : `/page/${pageNum}`
                    : `/admin/productlist/${pageNum}`
                }
                // Adding aria-current for accessibility
                aria-current={pageNum === currentPage ? 'page' : undefined}
                className={`block px-3 py-2 border ${
                  pageNum === currentPage
                    ? 'bg-blue-600 !text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                } rounded`}
              >
                {pageNum}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Paginate
