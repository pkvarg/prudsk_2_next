'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash, Search, X } from 'react-bootstrap-icons'
import Message from '@/app/components/Message'
import Loader from '@/app/components/Loader'
import Paginate from '@/app/components/Paginate'
import useProductStore from '@/store/productStore'
import useUserStore from '@/store/userStore'
import { ClearCacheButton } from '@/app/components/ClearCacheButton'
import { formatPrice } from '@/utils/priceFormatter'

const ProductListPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [keyword, setKeyword] = useState('')
  const pageSize = 10
  const router = useRouter()

  const {
    products,
    loading,
    error,
    page,
    pages,
    loadingDelete,
    errorDelete,
    successDelete,
    loadingCreate,
    errorCreate,
    successCreate,
    createdProduct,
    listProducts,
    deleteProduct,
    createProduct,
    resetProductCreate,
  } = useProductStore()

  const { userInfo } = useUserStore()

  const deleteHandler = (id) => {
    if (window.confirm('Si si istý?')) {
      deleteProduct(id)
    }
  }

  const createProductHandler = () => {
    createProduct()
  }

  const linkToCreateDiscount = () => {
    router.push('/admin/discount')
  }

  const linkToReviews = () => {
    router.push('/admin/reviews')
  }

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum)
  }

  // Debounce the typing — the keyword goes to the API, which searches every
  // product (name + diacritics-stripped searchName), not just the current page.
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchTerm.trim())
      setCurrentPage(1)
    }, 350)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    resetProductCreate()

    if (!userInfo?.isAdmin) {
      router.push('/login')
      return
    }

    if (successCreate && createdProduct?.id) {
      router.push(`/admin/product/${createdProduct.id}/edit`)
    } else {
      listProducts(keyword, currentPage, pageSize)
    }
  }, [
    router,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    currentPage, // Changed from pageNumber to currentPage
    keyword,
    resetProductCreate,
    listProducts,
  ])

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Produkty</h1>
        </div>
        <div className="flex gap-2">
          <button
            className="py-2 px-4 bg-[#2bb2e6] hover:bg-blue-700 text-white rounded"
            onClick={linkToReviews}
          >
            Recenzie
          </button>
          <button
            className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-1"
            onClick={linkToCreateDiscount}
          >
            <Plus size={20} /> Vytvoriť akciu
          </button>
          <button
            className="py-2 px-4 bg-[#2bb2e6] hover:bg-blue-700 text-white rounded flex items-center gap-1"
            onClick={createProductHandler}
          >
            <Plus size={20} /> Vytvoriť produkt
          </button>
          <ClearCacheButton />
        </div>
      </div>

      {/* Mobile view */}
      <div className="flex flex-col mb-4 md:hidden">
        <div className="mb-2">
          <h1 className="text-2xl font-bold">Produkty</h1>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="py-2 px-3 bg-[#2bb2e6] hover:bg-blue-700 text-white rounded text-sm"
            onClick={linkToReviews}
          >
            Recenzie
          </button>
          <button
            className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center gap-1 text-sm"
            onClick={linkToCreateDiscount}
          >
            <Plus size={18} /> Vytvoriť akciu
          </button>
          <button
            className="py-2 px-3 bg-[#2bb2e6] hover:bg-blue-700 text-white rounded flex items-center justify-center gap-1 text-sm"
            onClick={createProductHandler}
          >
            <Plus size={18} /> Vytvoriť produkt
          </button>
          <ClearCacheButton />
        </div>
      </div>

      {/* Search — prehľadá všetky produkty, nielen aktuálnu stranu */}
      <div className="relative w-full sm:max-w-md mb-4">
        <input
          type="search"
          id="product-search"
          name="product-search"
          aria-label="Hľadať produkt podľa názvu"
          placeholder="Hľadať produkt podľa názvu…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={16}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            title="Zrušiť hľadanie"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto mt-3">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    NÁZOV
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Na sklade ks
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    CENA
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    KATEGÓRIA
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ZĽAVA
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    CEL.CENA
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Úryvok
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Detaily
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    AKCIE
                  </th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b border-gray-200 truncate max-w-[200px]">
                        {product.name}
                      </td>
                      <td
                        className={`py-2 px-4 border-b border-gray-200 ${
                          product.countInStock <= 10 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {product.countInStock}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {formatPrice(product.price)}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 truncate max-w-[150px]">
                        {product.category.replace('-', ' ').replace('-', ' ').replace('-', ' ')}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">{product.discount}%</td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {formatPrice(product.discountedPrice)}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {product.excerpt &&
                        product.excerpt.excerpt &&
                        product.excerpt.excerpt.trim() !== ''
                          ? 'yes'
                          : 'no'}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {!product.pages ||
                        !product.isbn ||
                        !product.year ||
                        !product.category ||
                        !product.tags ||
                        !product.description ||
                        !product.weight ||
                        !product.language ||
                        !product.binding ||
                        !product.related
                          ? '???'
                          : 'OK'}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 space-x-2">
                        <Link
                          href={`/admin/product/${product.id}/edit`}
                          className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          className="inline-block bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                          onClick={() => deleteHandler(product.id)}
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-4 px-4 text-center text-gray-500">
                      {keyword ? `Pre „${keyword}“ sa nenašiel žiadny produkt` : 'Žiadne produkty neboli nájdené'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4 mt-3">
            {products && products.length > 0 ? (
              products.map((product) => {
                const detailsComplete = !(
                  !product.pages ||
                  !product.isbn ||
                  !product.year ||
                  !product.category ||
                  !product.tags ||
                  !product.description ||
                  !product.weight ||
                  !product.language ||
                  !product.binding ||
                  !product.related
                )
                const hasExcerpt = !!product.excerpt?.excerpt?.trim()

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-semibold text-gray-900 break-words">{product.name}</h3>
                      <div className="flex gap-2 shrink-0">
                        <Link
                          href={`/admin/product/${product.id}/edit`}
                          className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          className="inline-block bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                          onClick={() => deleteHandler(product.id)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-3">
                      {product.category.replaceAll('-', ' ')}
                    </p>

                    <dl className="grid grid-cols-2 gap-y-1.5 text-sm">
                      <dt className="text-gray-500">Na sklade</dt>
                      <dd
                        className={`text-right font-medium ${
                          product.countInStock <= 10 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {product.countInStock} ks
                      </dd>
                      <dt className="text-gray-500">Cena</dt>
                      <dd className="text-right text-gray-800">{formatPrice(product.price)}</dd>
                      <dt className="text-gray-500">Zľava</dt>
                      <dd className="text-right text-gray-800">{product.discount}%</dd>
                      <dt className="text-gray-500">Cel. cena</dt>
                      <dd className="text-right text-gray-800">
                        {formatPrice(product.discountedPrice)}
                      </dd>
                    </dl>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          hasExcerpt ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        Úryvok {hasExcerpt ? '✓' : '✗'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          detailsComplete
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        Detaily {detailsComplete ? 'OK' : '???'}
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                {keyword ? `Pre „${keyword}“ sa nenašiel žiadny produkt` : 'Žiadne produkty neboli nájdené'}
              </div>
            )}
          </div>

          <Paginate
            pages={pages}
            page={currentPage}
            onPageChange={handlePageChange}
            isAdmin={true}
          />
        </>
      )}
    </main>
  )
}

export default ProductListPage
