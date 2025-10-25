// // components/Paginate.js
// 'use client'

// const Paginate = ({ pages, page, onPageChange, isAdmin = false }) => {
//   if (pages <= 1) {
//     return null
//   }

//   // Ensure page is a number
//   const currentPage = parseInt(page) || 1

//   const handlePageClick = (pageNum) => {
//     if (pageNum !== currentPage && onPageChange) {
//       onPageChange(pageNum)
//     }
//   }

//   return (
//     <div className="flex justify-center mt-4 mb-6">
//       <ul className="flex space-x-1">
//         {/* Previous button */}
//         {currentPage > 1 && (
//           <li>
//             <button
//               onClick={() => handlePageClick(currentPage - 1)}
//               className="block px-3 py-2 border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 rounded transition-colors"
//               aria-label="Previous page"
//             >
//               ‹
//             </button>
//           </li>
//         )}

//         {/* Page numbers */}
//         {[...Array(pages).keys()].map((x) => {
//           const pageNum = x + 1
//           return (
//             <li key={pageNum}>
//               <button
//                 onClick={() => handlePageClick(pageNum)}
//                 aria-current={pageNum === currentPage ? 'page' : undefined}
//                 className={`block px-3 py-2 border transition-colors ${
//                   pageNum === currentPage
//                     ? 'bg-[#2bb2e6] !text-white border-blue-600'
//                     : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
//                 } rounded`}
//               >
//                 {pageNum}
//               </button>
//             </li>
//           )
//         })}

//         {/* Next button */}
//         {currentPage < pages && (
//           <li>
//             <button
//               onClick={() => handlePageClick(currentPage + 1)}
//               className="block px-3 py-2 border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 rounded transition-colors"
//               aria-label="Next page"
//             >
//               ›
//             </button>
//           </li>
//         )}
//       </ul>
//     </div>
//   )
// }

// export default Paginate

'use client'

/**
 * Helper function to generate the truncated list of pages for mobile.
 */
const getPaginationItems = (currentPage, totalPages) => {
  const MAX_VISIBLE_PAGES = 7 // Max items to show: 1, ..., 4, 5, 6, ..., 11

  // 1. If 7 or fewer pages, show all
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return [...Array(totalPages).keys()].map((i) => i + 1)
  }

  // 2. If current page is near the start
  // Show [1, 2, 3, 4, 5, '...', 11]
  if (currentPage <= 4) {
    const range = [...Array(5).keys()].map((i) => i + 1)
    return [...range, '...', totalPages]
  }

  // 3. If current page is near the end
  // Show [1, '...', 7, 8, 9, 10, 11]
  if (currentPage >= totalPages - 3) {
    const range = [...Array(5).keys()].map((i) => totalPages - 4 + i)
    return [1, '...', ...range]
  }

  // 4. If current page is in the middle
  // Show [1, '...', 5, 6, 7, '...', 11] (if current is 6)
  const range = [currentPage - 1, currentPage, currentPage + 1]
  return [1, '...', ...range, '...', totalPages]
}

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

  // Get the mobile-friendly pagination items
  const mobilePaginationItems = getPaginationItems(currentPage, pages)

  return (
    <div className="flex justify-center mt-4 mb-6">
      {/* Use `flex-wrap` and `gap-1`
        - `flex-wrap`: Allows mobile buttons to wrap if needed
        - `gap-1`: Modern replacement for `space-x-1` that works with wrapping
      */}
      <ul className="flex flex-wrap justify-center gap-1">
        {/* Previous button (shared) */}
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

        {/* --- Mobile Page Numbers --- */}
        {/* Visible by default, hidden on `md` screens and up */}
        {mobilePaginationItems.map((item, index) => {
          // Render ellipsis as a non-clickable span
          if (item === '...') {
            return (
              <li key={`ellipsis-${index}`} className="block md:hidden">
                <span className="block px-3 py-2 text-gray-400">...</span>
              </li>
            )
          }

          const pageNum = item
          return (
            <li key={`mobile-${pageNum}`} className="block md:hidden">
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

        {/* --- Desktop Page Numbers --- */}
        {/* Hidden by default, visible on `md` screens and up */}
        {[...Array(pages).keys()].map((x) => {
          const pageNum = x + 1
          return (
            <li key={`desktop-${pageNum}`} className="hidden md:block">
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

        {/* Next button (shared) */}
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
