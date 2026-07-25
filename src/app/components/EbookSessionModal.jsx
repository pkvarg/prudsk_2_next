'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import * as Icon from 'react-bootstrap-icons'
import useUserStore from '@/store/userStore'

const SESSION_FLAG = 'ebook_modal_shown'

const formatDate = (value) => {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString('sk-SK', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return ''
  }
}

const EbookSessionModal = () => {
  const { userInfo } = useUserStore()

  const [ebooks, setEbooks] = useState([])
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) return
    if (typeof window === 'undefined') return
    if (!userInfo?.id) return
    if (!userInfo?.hwmr) return

    let cancelled = false
    const fetchNew = async () => {
      try {
        const res = await fetch('/api/ebooks/new-for-me', {
          credentials: 'include',
          cache: 'no-store',
        })
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        const list = Array.isArray(data?.ebooks) ? data.ebooks : []
        if (list.length === 0) return
        setEbooks(list)
        setLoaded(true)
        const seen = sessionStorage.getItem(SESSION_FLAG)
        if (seen === 'minimized') {
          setMinimized(true)
          setOpen(false)
        } else if (seen === 'closed') {
          setMinimized(false)
          setOpen(false)
        } else {
          setOpen(true)
        }
      } catch (err) {
        // ignore
      }
    }

    fetchNew()
    return () => {
      cancelled = true
    }
  }, [userInfo?.id, userInfo?.hwmr, loaded])

  const minimizeHandler = () => {
    sessionStorage.setItem(SESSION_FLAG, 'minimized')
    setOpen(false)
    setMinimized(true)
  }

  const reopenHandler = () => {
    setOpen(true)
    setMinimized(false)
  }

  const closeHandler = async () => {
    sessionStorage.setItem(SESSION_FLAG, 'closed')
    setOpen(false)
    setMinimized(false)
    try {
      await fetch('/api/ebooks/seen', { method: 'POST', credentials: 'include' })
    } catch (err) {
      // ignore
    }
  }

  if (!userInfo?.hwmr) return null
  if (ebooks.length === 0) return null

  if (open) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
          <button
            type="button"
            onClick={minimizeHandler}
            className="absolute top-2 right-10 text-gray-500 hover:text-gray-700"
            title="Minimalizovať"
          >
            <Icon.DashLg size={20} />
          </button>
          <button
            type="button"
            onClick={closeHandler}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            title="Zavrieť"
          >
            <Icon.X size={24} />
          </button>

          <h2 className="text-lg font-bold mb-3 text-gray-900">Nový ebook na stiahnutie</h2>
          <ul className="space-y-2">
            {ebooks.map((ebook) => (
              <li key={ebook.id}>
                <Link
                  href={`/ebooks/${ebook.id}`}
                  onClick={minimizeHandler}
                  className="block px-3 py-2 rounded border border-gray-200 hover:bg-blue-50 transition-colors"
                >
                  Nový ebook <strong>{ebook.name}</strong> pridaný{' '}
                  {formatDate(ebook.createdAt)} na stiahnutie tu.
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/ebooks"
            onClick={minimizeHandler}
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            Zobraziť všetky ebooky →
          </Link>
        </div>
      </div>
    )
  }

  if (minimized) {
    return (
      <button
        type="button"
        onClick={reopenHandler}
        className="fixed bottom-5 right-5 z-[100] bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg px-4 py-3 flex items-center gap-2"
        title="Nový ebook"
      >
        <Icon.BookFill size={20} />
        <span className="text-sm font-medium">Nový ebook</span>
      </button>
    )
  }

  return null
}

export default EbookSessionModal
