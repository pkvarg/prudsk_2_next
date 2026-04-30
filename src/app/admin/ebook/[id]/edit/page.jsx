'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import * as Icon from 'react-bootstrap-icons'
import useEbookStore from '@/store/ebookStore'
import useUserStore from '@/store/userStore'

const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
  </div>
)

const Message = ({ variant = 'info', children }) => {
  const variantClasses = {
    danger: 'bg-red-100 border border-red-400 text-red-700',
    success: 'bg-green-100 border border-green-400 text-green-700',
  }
  return (
    <div className={`px-4 py-3 rounded mb-4 ${variantClasses[variant] || ''}`}>{children}</div>
  )
}

const formatDateTime = (value) => {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString('sk-SK')
  } catch {
    return '—'
  }
}

const EbookEditPage = () => {
  const params = useParams()
  const router = useRouter()
  const ebookId = params.id
  const { userInfo } = useUserStore()

  const {
    ebookDetails,
    ebookUpdate,
    getEbookDetails,
    updateEbook,
    uploadEbookFiles,
    resetEbookUpdate,
  } = useEbookStore()

  const [name, setName] = useState('')
  const [type, setType] = useState('hwmr')
  const [filename, setFilename] = useState('')
  const [price, setPrice] = useState('0')
  const [language, setLanguage] = useState('sk')
  const [available, setAvailable] = useState(true)
  const [pdfFile, setPdfFile] = useState(null)
  const [qrFile, setQrFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const { loading, error, ebook } = ebookDetails
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = ebookUpdate

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      router.push('/login')
      return
    }
    if (ebookId) getEbookDetails(ebookId)
  }, [ebookId, userInfo, router, getEbookDetails])

  useEffect(() => {
    if (ebook && ebook.id === ebookId) {
      setName(ebook.name || '')
      setType(ebook.type || 'hwmr')
      setFilename(ebook.filename || '')
      setPrice(String(ebook.price ?? 0))
      setLanguage(ebook.language || 'sk')
      setAvailable(ebook.available !== false)
    }
  }, [ebook, ebookId])

  useEffect(() => {
    if (successUpdate) {
      resetEbookUpdate()
      router.push('/admin/ebooklist')
    }
  }, [successUpdate, resetEbookUpdate, router])

  const submitHandler = async (e) => {
    e.preventDefault()
    setUploadError(null)

    try {
      let uploaded = {}
      if (pdfFile || qrFile || coverFile) {
        setUploading(true)
        uploaded = await uploadEbookFiles({
          ebookId,
          pdf: pdfFile,
          qrCode: qrFile,
          bookImage: coverFile,
        })
        setUploading(false)
      }

      const payload = {
        name,
        type,
        filename,
        price: Number(price) || 0,
        language,
        available,
      }
      if (uploaded.pdfUrl) payload.pdfUrl = uploaded.pdfUrl
      if (uploaded.qrCodeUrl) payload.qrCode = uploaded.qrCodeUrl
      if (uploaded.bookImageUrl) payload.bookImage = uploaded.bookImageUrl

      await updateEbook(ebookId, payload)
    } catch (err) {
      setUploading(false)
      setUploadError(err.message || 'Chyba pri ukladaní')
    }
  }

  return (
    <div className="w-full px-4 py-8">
      <Link
        href="/admin/ebooklist"
        className="inline-flex items-center px-4 my-4 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
      >
        ← Späť
      </Link>

      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Upraviť ebook</h1>

        {loadingUpdate || uploading ? <Loader /> : null}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {uploadError && <Message variant="danger">{uploadError}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Názov</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="hwmr">hwmr</option>
                <option value="other">other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Názov súboru (zobrazený)
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cena (€)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jazyk</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="sk">sk</option>
                <option value="cz">cz</option>
                <option value="en">en</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                id="available"
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="h-4 w-4 mr-2"
              />
              <label htmlFor="available" className="text-sm text-gray-700">
                Aktívny (zobraziť používateľom)
              </label>
            </div>

            <hr />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PDF súbor</label>
              {ebook?.pdfUrl && (
                <p className="text-xs text-gray-500 mb-2">
                  Aktuálne nahrané PDF (môžete prepísať novým).
                </p>
              )}
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">QR kód obrázok</label>
              {ebook?.qrCode && (
                <img
                  src={ebook.qrCode}
                  alt="QR"
                  className="h-32 w-32 object-contain mb-2 border rounded"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setQrFile(e.target.files?.[0] || null)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Obrázok titulky knihy
              </label>
              {ebook?.bookImage && (
                <img
                  src={ebook.bookImage}
                  alt="Cover"
                  className="h-40 object-contain mb-2 border rounded"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <button
              type="submit"
              disabled={loadingUpdate || uploading}
              className="w-full bg-[#2bb2e6] hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {loadingUpdate || uploading ? 'Ukladám…' : 'Uložiť'}
            </button>
          </form>
        )}
      </div>

      {ebook?.downloads?.length > 0 && (
        <div className="max-w-2xl mx-auto mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-bold mb-3">História stiahnutí</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 uppercase text-xs">
                <th className="py-2">Používateľ</th>
                <th className="py-2">E-mail</th>
                <th className="py-2">Kedy</th>
              </tr>
            </thead>
            <tbody>
              {ebook.downloads.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="py-2">{d.user?.name || '—'}</td>
                  <td className="py-2">{d.user?.email || '—'}</td>
                  <td className="py-2">{formatDateTime(d.downloadedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default EbookEditPage
