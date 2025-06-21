// components/Paginate.js
'use client'

const Paginate = ({ pages, page, onPageChange, isAdmin = false }) => {
  if (pages <= 1) {
    return null
  }

  // Ensure page is a number
  const currentPage = parseInt(page) || 1

  const handlePageClick = (pageNum) => {
    if (pageNum !== currentPage && onPageChange) {
      onPageChange(pageNum)
    }
  }

  return (
    <div className="flex justify-center mt-4 mb-6">
      <ul className="flex space-x-1">
        {/* Previous button */}
        {currentPage > 1 && (
          <li>
            <button
              onClick={() => handlePageClick(currentPage - 1)}
              className="block px-3 py-2 border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 rounded transition-colors"
              aria-label="Previous page"
            >
              ‹
            </button>
          </li>
        )}

        {/* Page numbers */}
        {[...Array(pages).keys()].map((x) => {
          const pageNum = x + 1
          return (
            <li key={pageNum}>
              <button
                onClick={() => handlePageClick(pageNum)}
                aria-current={pageNum === currentPage ? 'page' : undefined}
                className={`block px-3 py-2 border transition-colors ${
                  pageNum === currentPage
                    ? 'bg-[#2bb2e6] !text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                } rounded`}
              >
                {pageNum}
              </button>
            </li>
          )
        })}

        {/* Next button */}
        {currentPage < pages && (
          <li>
            <button
              onClick={() => handlePageClick(currentPage + 1)}
              className="block px-3 py-2 border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 rounded transition-colors"
              aria-label="Next page"
            >
              ›
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default Paginate
