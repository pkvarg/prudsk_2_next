'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useProductStore from '@/store/productStore'

const ProductEditScreen = () => {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id

  // Zustand store
  const {
    product,
    products,
    getAllProducts,
    loadingDetail,
    errorDetail,
    loadingUpdate,
    errorUpdate,
    successUpdate,
    getProductDetails,
    updateProduct,
    resetUpdate,
  } = useProductStore()

  // Form state - Initialize with empty values
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discount: '',
    discountedPrice: '',
    image: '',
    author: '',
    category: '',
    countInStock: '',
    description: '',
    excerptImage: '',
    excerptPart: '',
    excerpt: '',
    catalog: '',
    weight: '',
    related: '',
    related2: '',
    related3: '',
    tags: '',
    language: '',
    binding: '',
    pages: '',
    isbn: '',
    year: '',
  })

  const [loadingProducts, setLoadingProducts] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchTerms, setSearchTerms] = useState({
    related1: '',
    related2: '',
    related3: '',
  })
  const [dropdownStates, setDropdownStates] = useState({
    category: false,
    language: false,
    related1: false,
    related2: false,
    related3: false,
  })

  const categories = [
    { value: 'Boží-ekonomie', label: 'Boží ekonomie' },
    { value: 'brožury', label: 'Brožury' },
    { value: 'církev', label: 'Církev' },
    { value: 'duch', label: 'Duch' },
    { value: 'evangelium', label: 'Evangelium' },
    { value: 'křesťanská-praxe', label: 'Křesťanská praxe' },
    { value: 'křesťanská-služba', label: 'Křesťanská služba' },
    { value: 'kristus', label: 'Kristus' },
    { value: 'letáky', label: 'Letáky' },
    { value: 'mládež', label: 'Mládež' },
    { value: 'studium-a-výklad-bible', label: 'Studium a výklad Bible' },
    { value: 'Trojjediný-Bůh', label: 'Trojjediný Bůh' },
    { value: 'život', label: 'Život' },
    { value: 'životopisné', label: 'Životopisné' },
  ]

  const languages = [
    { value: 'SK', label: 'SK' },
    { value: 'CZ', label: 'CZ' },
  ]

  // Load product details and all products when component mounts
  useEffect(() => {
    if (productId) {
      getProductDetails(productId)
      getAllProducts()
    }
  }, [productId, getProductDetails, getAllProducts])

  // Update form when product data changes
  useEffect(() => {
    if (product && product.id === productId) {
      //console.log('Setting form data from product:', product)

      // Handle related products - they might be objects or strings
      const getRelatedValue = (related) => {
        if (!related) return ''
        if (typeof related === 'object' && related.id) return related.id
        return related
      }

      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        discount: product.discount?.toString() || '',
        discountedPrice: product.discountedPrice?.toString() || '',
        image: product.image || '',
        author: product.author || '',
        category: product.category || '',
        countInStock: product.countInStock?.toString() || '',
        description: product.description || '',
        excerptImage: product.excerpt?.image || '',
        excerptPart: product.excerpt?.part || '',
        excerpt: product.excerpt?.excerpt || '',
        catalog: product.catalog || '',
        weight: product.weight?.toString() || '',
        related: getRelatedValue(product.related),
        related2: getRelatedValue(product.related2),
        related3: getRelatedValue(product.related3),
        tags: product.tags || '',
        language: product.language || '',
        binding: product.binding || '',
        pages: product.pages?.toString() || '',
        isbn: product.isbn || '',
        year: product.year?.toString() || '',
      })
    }
  }, [product, productId])

  // Handle successful update
  useEffect(() => {
    if (successUpdate) {
      resetUpdate()
      router.push('/admin/productlist')
    }
  }, [successUpdate, resetUpdate, router])

  // Filter products based on search terms
  const getFilteredProducts = (searchTerm, excludeIds = []) => {
    if (!products || products.length === 0) return []

    return products.filter((p) => {
      // Exclude current product and already selected related products
      if (p.id === productId || excludeIds.includes(p.id)) return false

      // If no search term, show all
      if (!searchTerm) return true

      // Search by name or author
      const searchLower = searchTerm.toLowerCase()
      return (
        p.name?.toLowerCase().includes(searchLower) || p.author?.toLowerCase().includes(searchLower)
      )
    })
  }

  // Get name of related product by ID
  const getRelatedProductName = (relatedId) => {
    if (!relatedId || !products) return ''
    const relatedProduct = products.find((p) => p.id === relatedId)
    return relatedProduct ? `${relatedProduct.name} - ${relatedProduct.author}` : ''
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDiscountChange = (discount) => {
    const discountValue = parseFloat(discount) || 0
    const price = parseFloat(formData.price) || 0
    const newPrice = price - (price * discountValue) / 100
    const roundedPrice = Math.ceil(newPrice * 20) / 20

    setFormData((prev) => ({
      ...prev,
      discount: discountValue.toString(),
      discountedPrice: roundedPrice.toString(),
    }))
  }

  const handleRelatedSelect = (productId, relatedNumber) => {
    const fieldName = relatedNumber === 1 ? 'related' : `related${relatedNumber}`
    setFormData((prev) => ({
      ...prev,
      [fieldName]: productId,
    }))
    setSearchTerms((prev) => ({
      ...prev,
      [`related${relatedNumber}`]: '',
    }))
    toggleDropdown(`related${relatedNumber}`)
  }

  const handleRelatedSearchChange = (value, relatedNumber) => {
    setSearchTerms((prev) => ({
      ...prev,
      [`related${relatedNumber}`]: value,
    }))
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    setUploading(true)

    try {
      // const apiUrl = 'http://localhost:3013/api/upload/proud2next'
      const apiUrl = 'https://hono-api.pictusweb.com/api/upload/proud2next'
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Nepodarilo sa nahrať súbor')
      }

      const data = await response.json()
      console.log('data', data)

      if (data.imageUrl.includes('ukazka')) {
        setFormData((prev) => ({ ...prev, excerptImage: data.imageUrl }))
      } else {
        setFormData((prev) => ({ ...prev, image: data.imageUrl }))
      }

      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const toggleDropdown = (dropdownName) => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdownName]: !prev[dropdownName],
    }))
  }

  const submitHandler = (e) => {
    e.preventDefault()

    console.log('ex', formData.excerptImage)

    const excerptObject = {
      image: formData.excerptImage,
      part: formData.excerptPart,
      excerpt: formData.excerpt,
    }

    // Convert string values to numbers where needed
    const dataToSubmit = {
      id: productId,
      ...formData,
      price: parseFloat(formData.price) || 0,
      discount: parseFloat(formData.discount) || 0,
      discountedPrice: parseFloat(formData.discountedPrice) || 0,
      countInStock: parseInt(formData.countInStock) || 0,
      weight: formData.weight ? formData.weight : '',
      pages: formData.pages ? formData.pages : '',
      year: formData.year ? formData.year : '',
      excerpt: excerptObject,
    }

    console.log('Submitting data:', dataToSubmit)
    updateProduct(dataToSubmit)
  }

  if (loadingDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2cb3e6]"></div>
      </div>
    )
  }

  if (errorDetail) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/admin/productlist"
          className="inline-flex items-center px-4 py-2 mb-6 !text-white bg-[#2cb3e6] border border-[#2cb3e6] rounded-lg  hover:text-[#2cb3e6] transition-colors duration-200"
        >
          ← Zpět
        </Link>
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{errorDetail}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/admin/productlist"
          className="inline-flex items-center px-4 py-2 mb-6 !text-white bg-[#2cb3e6] border border-[#2cb3e6] rounded-lg hover:text-[#2cb3e6] transition-colors duration-200"
        >
          ← Zpět
        </Link>

        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-medium text-[#313131] mb-8">Editovat produkt</h1>

          {loadingUpdate && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2cb3e6]"></div>
            </div>
          )}

          {errorUpdate && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorUpdate}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Název <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Název"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cena <span className="text-red-500">*</span> (ve formátu např: 5.8 bez měny)
              </label>
              <input
                type="text"
                name="price"
                required
                placeholder="Cena"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none"
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sleva (ve formátu např: 30 bez %)
              </label>
              <input
                type="number"
                placeholder="Sleva"
                value={formData.discount}
                onChange={(e) => handleDiscountChange(e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none"
              />
            </div>

            {/* Discounted Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cena po slevě (automatický výpočet a zaokrouhlení na 5 centů)
              </label>
              <input
                type="number"
                placeholder="Cena po slevě"
                value={formData.discountedPrice}
                readOnly
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-full bg-gray-100 focus:outline-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Obrázek (274 x 379 pixelů)
              </label>
              <input
                type="text"
                name="image"
                placeholder="Obrázek"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none mb-3"
              />
              <input
                type="file"
                accept="image/*"
                onChange={uploadFileHandler}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none"
              />
              {uploading && (
                <div className="flex justify-center items-center mt-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2cb3e6]"></div>
                </div>
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Autor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                required
                placeholder="Autor"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none"
              />
            </div>

            {/* Stock Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Počet na skladě
              </label>
              <input
                type="number"
                name="countInStock"
                placeholder="Počet na skladě"
                value={formData.countInStock}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rok vydání</label>
              <input
                type="text"
                name="year"
                placeholder="Rok vydání"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategorie (aby se produkt zobrazil v záložce E-shop ve své kategorii)
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown('category')}
                  className="w-full px-4 py-3 text-left bg-[#24b9d6] text-white rounded-full hover:bg-[#2cb3e6] focus:outline-none focus:ring-2 focus:ring-[#2cb3e6] mb-3"
                >
                  {formData.category || 'Vybrat kategorii'}
                  <span className="float-right">▼</span>
                </button>
                {dropdownStates.category && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, category: cat.value }))
                          toggleDropdown('category')
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                name="category"
                placeholder="Kategorie"
                value={formData.category}
                readOnly
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-full bg-gray-100 focus:outline-none"
              />
            </div>

            {/* Additional fields - continuing with similar pattern */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Katalog</label>
                <input
                  type="text"
                  name="catalog"
                  placeholder="Katalog"
                  value={formData.catalog}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hmotnost bez kg, např. 0.33
                </label>
                <input
                  type="text"
                  name="weight"
                  placeholder="Hmotnost"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none"
                />
              </div>
            </div>

            {/* Related Products with Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Related Product 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Související titul č.1
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('related1')}
                    className="w-full px-4 py-3 text-left bg-[#24b9d6] text-white rounded-full hover:bg-[#2cb3e6] focus:outline-none mb-3"
                  >
                    {formData.related ? getRelatedProductName(formData.related) : 'Vybrat produkt'}
                    <span className="float-right">▼</span>
                  </button>
                  {dropdownStates.related1 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <input
                        type="text"
                        placeholder="Hledat produkt..."
                        value={searchTerms.related1}
                        onChange={(e) => handleRelatedSearchChange(e.target.value, 1)}
                        className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, related: '' }))
                          toggleDropdown('related1')
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none text-red-600"
                      >
                        Odstranit výběr
                      </button>
                      {getFilteredProducts(searchTerms.related1, [
                        formData.related2,
                        formData.related3,
                      ]).map((prod) => (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => handleRelatedSelect(prod.id, 1)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                        >
                          <div className="font-medium">{prod.name}</div>
                          <div className="text-sm text-gray-600">{prod.author}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Related Product 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Související titul č.2
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('related2')}
                    className="w-full px-4 py-3 text-left bg-[#24b9d6] text-white rounded-full hover:bg-[#2cb3e6] focus:outline-none mb-3"
                  >
                    {formData.related2
                      ? getRelatedProductName(formData.related2)
                      : 'Vybrat produkt'}
                    <span className="float-right">▼</span>
                  </button>
                  {dropdownStates.related2 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <input
                        type="text"
                        placeholder="Hledat produkt..."
                        value={searchTerms.related2}
                        onChange={(e) => handleRelatedSearchChange(e.target.value, 2)}
                        className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, related2: '' }))
                          toggleDropdown('related2')
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none text-red-600"
                      >
                        Odstranit výběr
                      </button>
                      {getFilteredProducts(searchTerms.related2, [
                        formData.related,
                        formData.related3,
                      ]).map((prod) => (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => handleRelatedSelect(prod.id, 2)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                        >
                          <div className="font-medium">{prod.name}</div>
                          <div className="text-sm text-gray-600">{prod.author}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Related Product 3 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Související titul č.3
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('related3')}
                    className="w-full px-4 py-3 text-left bg-[#24b9d6] text-white rounded-full hover:bg-[#2cb3e6] focus:outline-none mb-3"
                  >
                    {formData.related3
                      ? getRelatedProductName(formData.related3)
                      : 'Vybrat produkt'}
                    <span className="float-right">▼</span>
                  </button>
                  {dropdownStates.related3 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <input
                        type="text"
                        placeholder="Hledat produkt..."
                        value={searchTerms.related3}
                        onChange={(e) => handleRelatedSearchChange(e.target.value, 3)}
                        className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, related3: '' }))
                          toggleDropdown('related3')
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none text-red-600"
                      >
                        Odstranit výběr
                      </button>
                      {getFilteredProducts(searchTerms.related3, [
                        formData.related,
                        formData.related2,
                      ]).map((prod) => (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => handleRelatedSelect(prod.id, 3)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                        >
                          <div className="font-medium">{prod.name}</div>
                          <div className="text-sm text-gray-600">{prod.author}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional fields grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagy</label>
                <input
                  type="text"
                  name="tags"
                  placeholder="Tagy"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vazba</label>
                <input
                  type="text"
                  name="binding"
                  placeholder="Vazba"
                  value={formData.binding}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Počet stran</label>
                <input
                  type="text"
                  name="pages"
                  placeholder="Počet stran"
                  value={formData.pages}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  placeholder="ISBN"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none"
                />
              </div>
            </div>

            {/* Language Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jazyk</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown('language')}
                  className="w-full px-4 py-3 text-left bg-[#24b9d6] text-white rounded-full hover:bg-[#2cb3e6] focus:outline-none mb-3"
                >
                  {formData.language || 'Vybrat jazyk'}
                  <span className="float-right">▼</span>
                </button>
                {dropdownStates.language && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    {languages.map((lang) => (
                      <button
                        key={lang.value}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, language: lang.value }))
                          toggleDropdown('language')
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                      >
                        <h5 className="text-base font-medium">{lang.label}</h5>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                name="language"
                placeholder="Jazyk"
                value={formData.language}
                readOnly
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-full bg-gray-100 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Popis</label>
              <textarea
                name="description"
                rows={15}
                placeholder="Popis"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none resize-vertical"
              />
            </div>

            {/* Excerpt Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ukázka - Obrázek (názov súboru musí obsahovat "ukazka", napr.
                dvaja_duchovia_ukazka.png, 250 x 250 pixelů)
              </label>
              <input
                type="text"
                name="excerptImage"
                placeholder="Ukázka - Obrázek"
                value={formData.excerptImage}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none mb-3"
              />
              <input
                type="file"
                accept="image/*"
                onChange={uploadFileHandler}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none"
              />
            </div>

            {/* Excerpt Part */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ukázka - část (zobrazí se v čítárně)
              </label>
              <textarea
                name="excerptPart"
                rows={15}
                placeholder="Ukázka-část"
                value={formData.excerptPart}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none resize-vertical"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ukázka (Rozklik na Přečíst si víc)
              </label>
              <textarea
                name="excerpt"
                rows={15}
                placeholder="Ukázka"
                value={formData.excerpt}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-[#2cb3e6] focus:border-[#2cb3e6] focus:outline-none resize-vertical"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loadingUpdate}
                className="w-full md:w-auto px-8 py-3 bg-[#2cb3e6] text-white font-medium rounded-lg hover:bg-white hover:text-[#2cb3e6] border border-[#2cb3e6] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingUpdate ? 'Ukládá se...' : 'Uložit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductEditScreen
