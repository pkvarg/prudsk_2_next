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
  const { userInfo, getUserDetails } = useUserStore()

  const [ebook, setEbook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paid, setPaid] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(null)

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
        const res = await fetch(`/api/ebooks/${ebookId}`, { credentials: 'include' })
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

  const downloadHandler = async () => {
    if (!paid) return
    setDownloading(true)
    setDownloadError(null)
    try {
      const res = await fetch(`/api/ebooks/${ebookId}/download`, { credentials: 'include' })
      if (!res.ok) {
        setDownloadError('Stiahnutie zlyhalo.')
        setDownloading(false)
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const cdHeader = res.headers.get('Content-Disposition') || ''
      const match = /filename="?([^"]+)"?/i.exec(cdHeader)
      a.download = match?.[1] || `${ebook?.filename || ebook?.name || 'ebook'}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      if (userInfo?.id) {
        getUserDetails(userInfo.id)
      }
    } catch (err) {
      setDownloadError('Chyba pri sťahovaní.')
    } finally {
      setDownloading(false)
    }
  }

  if (!userInfo?.hwmr) {
    return null
  }

  if (loading) return <Loader />
  if (error)
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-red-600">{error}</p>
        <Link href="/" className="text-blue-600 underline">
          Späť
        </Link>
      </main>
    )

  if (!ebook) return null

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/" className="inline-block mb-6 text-sm text-blue-600 hover:underline">
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
            <img
              src={ebook.bookImage}
              alt={ebook.name}
              className="max-h-96 object-contain"
            />
          </div>
        )}
        {ebook.qrCode && (
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-600 mb-3">Naskenujte QR kód a zaplaťte</p>
            <img
              src={ebook.qrCode}
              alt="QR kód platby"
              className="max-h-72 object-contain"
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-xl">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={paid}
            onChange={(e) => setPaid(e.target.checked)}
            className="h-5 w-5"
          />
          <span className="text-gray-800 leading-none">
            Zaplatil som <strong>{Number(ebook.price || 0).toFixed(2)} €</strong>
          </span>
        </label>

        <button
          type="button"
          disabled={!paid || downloading}
          onClick={downloadHandler}
          className="mt-5 w-full bg-[#2bb2e6] hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {downloading ? 'Sťahujem…' : 'Stiahnuť PDF'}
        </button>

        {downloadError && (
          <p className="mt-3 text-sm text-red-600">{downloadError}</p>
        )}
      </div>
    </main>
  )
}

export default EbookDetailPage
