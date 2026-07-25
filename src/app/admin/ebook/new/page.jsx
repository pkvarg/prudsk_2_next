'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useEbookStore from '@/store/ebookStore'
import useUserStore from '@/store/userStore'

const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
  </div>
)

const EbookNewPage = () => {
  const router = useRouter()
  const { userInfo } = useUserStore()
  const { ebookCreate, createEbook, resetEbookCreate } = useEbookStore()

  const [name, setName] = useState('')
  const [type, setType] = useState('hwmr')
  const [filename, setFilename] = useState('')
  const [price, setPrice] = useState('0')
  const [language, setLanguage] = useState('sk')
  const [available, setAvailable] = useState(true)
  const [mobileQR, setMobileQR] = useState('')

  const { loading, error } = ebookCreate

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      router.push('/login')
      return
    }
    resetEbookCreate()
  }, [userInfo, router, resetEbookCreate])

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const created = await createEbook({
        name,
        type,
        filename,
        price: Number(price) || 0,
        language,
        available,
        mobileQR,
      })
      if (created?.id) {
        router.push(`/admin/ebook/${created.id}/edit`)
      }
    } catch (err) {
      // surfaced via store
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
        <h1 className="text-2xl font-bold mb-2">Nový ebook</h1>
        <p className="text-sm text-gray-500 mb-4">
          Najprv vytvorte záznam — potom v ďalšom kroku nahrajte PDF, QR kód a obrázok titulky.
        </p>

        {error && (
          <div className="px-4 py-3 rounded mb-4 bg-red-100 border border-red-400 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <Loader />
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
                placeholder="napr. moja-kniha.pdf"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobilná platobná linka (mobileQR)
              </label>
              <input
                type="url"
                value={mobileQR}
                onChange={(e) => setMobileQR(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="https://payme.sk/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Zobrazí sa používateľom ako tlačidlo „Ak ste na mobile použite túto linku“.
              </p>
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
                Aktívny
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2bb2e6] hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Vytvoriť a pokračovať
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default EbookNewPage
