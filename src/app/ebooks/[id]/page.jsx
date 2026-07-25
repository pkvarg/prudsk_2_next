'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useUserStore from '@/store/userStore'

const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
  </div>
)

const EbookDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const ebookId = params.id
  const { userInfo } = useUserStore()

  const [ebook, setEbook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const unitPrice = Number(ebook?.price || 0)
  const total = unitPrice * (Number(quantity) || 0)

  useEffect(() => {
    if (!userInfo) {
      router.push('/login')
      return
    }
    if (!userInfo.hwmr) {
      router.push('/')
      return
    }
  }, [userInfo, router])

  useEffect(() => {
    if (!ebookId) return
    if (!userInfo?.hwmr) return

    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/ebooks/${ebookId}?public=true`, {
          credentials: 'include',
          cache: 'no-store',
        })
        if (!res.ok) {
          setError('Ebook sa nepodarilo načítať.')
          setLoading(false)
          return
        }
        const data = await res.json()
        if (!cancelled) {
          setEbook(data)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError('Chyba pri načítaní ebooku.')
          setLoading(false)
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [ebookId, userInfo?.hwmr])

  if (!userInfo?.hwmr) {
    return null
  }

  if (loading) return <Loader />
  if (error)
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-red-600">{error}</p>
        <Link href="/ebooks" className="text-blue-600 underline">
          Späť
        </Link>
      </main>
    )

  if (!ebook) return null

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/ebooks" className="inline-block mb-6 text-sm text-blue-600 hover:underline">
        ← Späť
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{ebook.name}</h1>
      <p className="text-gray-500 mb-6">
        Jazyk: <span className="uppercase">{ebook.language}</span> · Cena:{' '}
        {Number(ebook.price || 0).toFixed(2)} €
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {ebook.bookImage && (
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-center">
            <img src={ebook.bookImage} alt={ebook.name} className="max-h-96 object-contain" />
          </div>
        )}
        {ebook.qrCode && (
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-600 mb-3">Naskenujte QR kód a zaplaťte</p>
            <img src={ebook.qrCode} alt="QR kód platby" className="max-h-72 object-contain" />
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-xl mb-6">
        <div className="flex items-center gap-3 mb-4">
          <label htmlFor="quantity" className="text-gray-700">
            Pre koľkých užívateľov kupujete?
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            max="100"
            step="1"
            value={quantity}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10)
              setQuantity(Number.isNaN(v) ? '' : Math.min(100, Math.max(1, v)))
            }}
            className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2bb2e6]"
          />
        </div>
        <p className="text-gray-600 text-sm">
          {Number(quantity) || 0} × {unitPrice.toFixed(2)} €
        </p>
        <p className="text-xl font-bold text-gray-900 mt-1">
          Pri platbe zadajte sumu spolu: {total.toFixed(2)} €
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-xl">
        <p className="text-gray-800 font-medium mb-4">Zaplatili ste za všetkých užívateľov?</p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push(`/ebooks/${ebookId}/download`)}
            className="flex-1 bg-[#2bb2e6] hover:bg-[#218334] !text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Áno
          </button>
          <button
            type="button"
            onClick={() => router.push('/ebooks')}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Nie
          </button>
        </div>
      </div>
    </main>
  )
}

export default EbookDetailPage
