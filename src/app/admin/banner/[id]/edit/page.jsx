'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useBannerStore from '@/store/bannerStore'
import axios from 'axios'

const BannerEditPage = () => {
  const params = useParams()
  const router = useRouter()
  const bannerId = params.id

  const [bannerTitle, setBannerTitle] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [uploading, setUploading] = useState(false)

  const { bannerDetails, bannerUpdate, listBannerDetails, updateBanner, resetBannerUpdate } =
    useBannerStore()

  const { loading, error, banner } = bannerDetails
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = bannerUpdate

  // Load banner details only when bannerId changes
  useEffect(() => {
    if (bannerId) {
      listBannerDetails(bannerId)
    }
  }, [bannerId])

  // Handle success update
  useEffect(() => {
    if (successUpdate) {
      resetBannerUpdate()
      router.push('/admin/bannerlist')
    }
  }, [successUpdate, resetBannerUpdate, router])

  // Set form values when banner loads
  useEffect(() => {
    if (banner && banner.id === bannerId) {
      setBannerTitle(banner.bannerTitle || '')
      setImage(banner.image || '')
      setCategory(banner.category || '')
    }
  }, [banner, bannerId])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    setUploading(true)
    try {
      //const apiUrl = 'http://localhost:3013/api/upload/proud2next'
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
      setImage(data.imageUrl)
      setUploading(false)
    } catch (error) {
      console.error('Upload error:', error)
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    updateBanner({
      id: bannerId,
      bannerTitle,
      image,
      category,
    })
  }

  // Loading component
  const Loader = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  )

  // Message component
  const Message = ({ variant, children }) => {
    const variantClasses = {
      danger: 'bg-red-100 border border-red-400 text-red-700',
      success: 'bg-green-100 border border-green-400 text-green-700',
      info: 'bg-blue-100 border border-blue-400 text-blue-700',
    }

    return (
      <div className={`px-4 py-3 rounded mb-4 ${variantClasses[variant] || variantClasses.info}`}>
        {children}
      </div>
    )
  }

  return (
    <div className="w-full px-4 py-8">
      <Link
        href="/admin/bannerlist"
        className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
      >
        ← Zpět
      </Link>

      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Banner</h1>

        {/* Image Requirements */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800 font-medium">
            📏 Obrázek musí mít rozměry 1296x382px
          </p>
        </div>

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <form onSubmit={submitHandler} className="space-y-6">
            {/* Banner Title */}
            <div>
              <label
                htmlFor="banner-title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Název
              </label>
              <input
                type="text"
                id="banner-title"
                placeholder="Název"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Banner Image */}
            <div>
              <label htmlFor="banner-file" className="block text-sm font-medium text-gray-700 mb-2">
                Banner
              </label>

              {/* Current image display */}
              <input
                type="text"
                placeholder="Obrázek"
                value={image}
                readOnly
                className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />

              {/* File upload */}
              <div className="relative">
                <input
                  type="file"
                  id="banner-file"
                  onChange={uploadFileHandler}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
              </div>

              {uploading && (
                <div className="mt-3 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mr-2"></div>
                  <span className="text-sm text-gray-600">Nahrávání...</span>
                </div>
              )}

              {/* Image preview */}
              {image && !uploading && (
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    // src={image.startsWith('/') ? image : `/${image}`}
                    src={image}
                    alt="Banner preview"
                    className="w-full h-auto max-h-48 object-contain bg-gray-50"
                  />
                  <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-600">Náhled banneru</p>
                  </div>
                </div>
              )}
            </div>

            {/* Category (hidden field for now, can be made visible if needed) */}
            <input type="hidden" value={category} onChange={(e) => setCategory(e.target.value)} />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loadingUpdate || uploading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {loadingUpdate ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Ukládání...
                </>
              ) : (
                'Uložit'
              )}
            </button>
          </form>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pokyny pro nahrávání:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              Podporované formáty: JPG, PNG, GIF
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              Doporučené rozměry: 1296x382px
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              Maximální velikost souboru: 5MB
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              Banner se zobrazí v hlavní části webu
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BannerEditPage
