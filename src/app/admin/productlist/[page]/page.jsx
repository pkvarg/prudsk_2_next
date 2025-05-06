'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Plus, Pencil, Trash } from 'react-bootstrap-icons'
import Message from '../../../components/Message'
import Loader from '../../../components/Loader'
import Paginate from '../../../components/Paginate'
import useProductStore from '../../../../store/useProductStore'
import useUserStore from '../../../../store/userStore'

const ProductListPageWithPagination = () => {
  const params = useParams()
  const pageNumber = parseInt(params.page) || 1
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
    if (window.confirm('Are you sure?')) {
      deleteProduct(id)
    }
  }

  const createProductHandler = () => {
    createProduct()
  }

  const linkToCreateDiscount = () => {
    router.push('/create-discount')
  }

  const linkToReviews = () => {
    router.push('/admin/reviews')
  }

  useEffect(() => {
    resetProductCreate()

    if (!userInfo?.isAdmin) {
      router.push('/login')
      return
    }

    if (successCreate && createdProduct?._id) {
      router.push(`/admin/product/${createdProduct._id}/edit`)
    } else {
      listProducts('', pageNumber, pageSize)
    }
  }, [
    router,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
    resetProductCreate,
    listProducts,
  ])

  return (
    <main className="mx-8 mt-12">
      {/* Desktop view */}
      <div className="flex items-center justify-between mb-4 sm:hidden md:flex">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Produkty</h1>
        </div>
        <div className="flex gap-2">
          <button
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
            onClick={linkToReviews}
          >
            Recenze
          </button>
          <button
            className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-1"
            onClick={linkToCreateDiscount}
          >
            <Plus size={20} /> Vytvořit akci
          </button>
          <button
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1"
            onClick={createProductHandler}
          >
            <Plus size={20} /> Vytvořit produkt
          </button>
        </div>
      </div>

      {/* Mobile view */}
      <div className="flex flex-col mb-4 md:hidden">
        <div className="mb-2">
          <h1 className="text-2xl font-bold">Produkty</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
            onClick={linkToReviews}
          >
            Recenze
          </button>
          <button
            className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-1"
            onClick={linkToCreateDiscount}
          >
            <Plus size={20} /> Vytvorit akci
          </button>
          <button
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1"
            onClick={createProductHandler}
          >
            <Plus size={20} /> Vytvorit produkt
          </button>
        </div>
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
          <div className="overflow-x-auto mt-3">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    NÁZEV
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Skladem ks
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    CENA
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    KATEGORIE
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    SLEVA
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    CEL.CENA
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Úryvek
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Detaily
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    AKCE
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
                      <td className="py-2 px-4 border-b border-gray-200">{product.price} Kč</td>
                      <td className="py-2 px-4 border-b border-gray-200 truncate max-w-[150px]">
                        {product.category.replace('-', ' ').replace('-', ' ').replace('-', ' ')}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">{product.discount}%</td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {product.discountedPrice} Kč
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {product.excerpt ? 'yes' : 'no'}
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
                      Žádné produkty nebyly nalezeny
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Paginate pages={pages} page={page || pageNumber} isAdmin={true} />
        </>
      )}
    </main>
  )
}

export default ProductListPageWithPagination
