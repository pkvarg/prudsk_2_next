'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useUserStore from '@/store/userStore'

const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
  </div>
)

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

const ANNOUNCEMENT = [
  'Milí svätí,',
  'rozhodli sme sa sprístupniť publikáciu Sväté slovo na ranné oživenie aj v elektronickom formáte.',
  'Odteraz bude možné si jeho aktuálne vydanie stiahnuť vo formáte PDF na týchto stránkach.',
  'Súčasná cena knižnej formy Oživenia sa odvíja od počtu výtlačkov. Ak znížime počet výtlačkov, cena za jeden kus bude vyššia. Takýmto spôsobom by tí, ktorí si objednávajú tlačené knižky, platili stále viac, zatiaľ čo ostatní by mali „PDF zdarma“. Aby sme tomu predišli a mohli sa postarať o všetkých rovnako, poplatok za PDF formát bude rovnaký ako za tlačenú verziu a bude viazaný na používateľa.',
  'Teda ak chcete niekomu (aj rodinným príslušníkom) preposlať „vaše PDF“, prosím, vráťte sa sem na stránku, uhraďte príslušný počet „preposlaní“ a informujte aj dotyčného, komu ste „vaše Oživenie“ takto preposlali, že nejde o voľne šíriteľnú publikáciu.',
]

const EbooksIndexPage = () => {
  const router = useRouter()
  const { userInfo } = useUserStore()

  const [latest, setLatest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    if (!userInfo?.hwmr) return

    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/ebooks?public=true', {
          credentials: 'include',
          cache: 'no-store',
        })
        if (!res.ok) {
          setError('Ebooky sa nepodarilo načítať.')
          setLoading(false)
          return
        }
        const data = await res.json()
        if (!cancelled) {
          const list = Array.isArray(data?.ebooks) ? data.ebooks : []
          setLatest(list[0] || null)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError('Chyba pri načítaní ebookov.')
          setLoading(false)
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [userInfo?.hwmr])

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

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="inline-block mb-6 text-sm text-blue-600 hover:underline">
        ← Späť
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Ranné oživenie</h1>

      <div className="bg-white rounded-lg shadow p-6 md:p-8 space-y-4 text-gray-800 leading-relaxed">
        {ANNOUNCEMENT.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <p>
          Všetko nech je na budovanie.
          <br />
          1Kor 14:26
        </p>
      </div>

      {latest ? (
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700">
            <span className="font-semibold">Názov aktuálnej publikácie:</span> {latest.name}
          </p>
          <p className="text-gray-700 mt-1">
            <span className="font-semibold">Dátum sprístupnenia:</span>{' '}
            {formatDate(latest.createdAt)}
          </p>

          <Link
            href={`/ebooks/${latest.id}`}
            className="mt-6 inline-block bg-[#2bb2e6] hover:bg-[#218334] !text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Pokračovať
          </Link>
        </div>
      ) : (
        <p className="mt-8 text-gray-500">Momentálne nie je k dispozícii žiadna publikácia.</p>
      )}
    </main>
  )
}

export default EbooksIndexPage
