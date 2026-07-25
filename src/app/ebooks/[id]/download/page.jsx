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

const EbookDownloadPage = () => {
  const params = useParams()
  const router = useRouter()
  const ebookId = params.id
  const { userInfo, getUserDetails } = useUserStore()

  const [ebook, setEbook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

  const downloadHandler = async () => {
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
        <Link href="/ebooks" className="text-blue-600 underline">
          Späť
        </Link>
      </main>
    )

  if (!ebook) return null

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link
        href={`/ebooks/${ebookId}`}
        className="inline-block mb-6 text-sm text-blue-600 hover:underline"
      >
        ← Späť
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{ebook.name}</h1>
      <p className="text-gray-500 mb-8">
        Jazyk: <span className="uppercase">{ebook.language}</span>
      </p>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700 mb-5">Ďakujeme. Vašu publikáciu si môžete stiahnuť nižšie.</p>

        <button
          type="button"
          disabled={downloading}
          onClick={downloadHandler}
          className="w-full bg-[#2bb2e6] hover:bg-[#218334] disabled:bg-gray-300 !text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          {downloading ? 'Sťahujem…' : 'Stiahnuť PDF'}
        </button>

        {downloadError && <p className="mt-3 text-sm text-red-600">{downloadError}</p>}
      </div>
    </main>
  )
}

export default EbookDownloadPage
