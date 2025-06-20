// // components/PaginateLibrary.js
// 'use client'

// import useProductStore from '@/store/productStore'

// const PaginateLibrary = ({ pages, page, isAdmin = false }) => {
//   const { setCurrentPage } = useProductStore()

//   if (pages <= 1) {
//     return null
//   }

//   // Ensure page is a number
//   const currentPage = parseInt(page) || 1

//   const handlePageClick = (pageNum) => {
//     setCurrentPage(pageNum)
//     // Optional: Scroll to top when page changes
//     window.scrollTo({ top: 0, behavior: 'smooth' })
//   }

//   return (
//     <div className="flex justify-center mt-4 mb-6">
//       <ul className="flex space-x-1">
//         {[...Array(pages).keys()].map((x) => {
//           const pageNum = x + 1
//           return (
//             <li key={pageNum}>
//               <button
//                 onClick={() => handlePageClick(pageNum)}
//                 // Adding aria-current for accessibility
//                 aria-current={pageNum === currentPage ? 'page' : undefined}
//                 className={`block px-3 py-2 border ${
//                   pageNum === currentPage
//                     ? 'bg-[#071e46] !text-white border-[#071e46]'
//                     : 'bg-white text-[#9b7d57] border-gray-300 hover:bg-[#edeae4] hover:border-[#9b7d57]'
//                 } rounded transition-colors duration-200 cursor-pointer`}
//               >
//                 {pageNum}
//               </button>
//             </li>
//           )
//         })}
//       </ul>
//     </div>
//   )
// }

// export default PaginateLibrary

// components/PaginateLibrary.js
'use client'

const PaginateLibrary = ({ pages, page, onPageChange }) => {
  if (pages <= 1) {
    return null
  }

  // Ensure page is a number
  const currentPage = parseInt(page) || 1

  const handlePageClick = (pageNum) => {
    if (onPageChange) {
      onPageChange(pageNum)
    }
    // Optional: Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex justify-center mt-4 mb-6">
      <ul className="flex space-x-1">
        {[...Array(pages).keys()].map((x) => {
          const pageNum = x + 1
          return (
            <li key={pageNum}>
              <button
                onClick={() => handlePageClick(pageNum)}
                // Adding aria-current for accessibility
                aria-current={pageNum === currentPage ? 'page' : undefined}
                className={`block px-3 py-2 border ${
                  pageNum === currentPage
                    ? 'bg-[#071e46] !text-white border-[#071e46]'
                    : 'bg-white text-[#9b7d57] border-gray-300 hover:bg-[#edeae4] hover:border-[#9b7d57]'
                } rounded transition-colors duration-200 cursor-pointer`}
              >
                {pageNum}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PaginateLibrary
