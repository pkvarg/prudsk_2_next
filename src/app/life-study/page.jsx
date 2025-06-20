'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import useAudioStore from '@/store/audioStore'

const LifeStudy = () => {
  const [lifeStudy, setLifeStudy] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')

  // Zustand store (if you have audio-related state there)
  const { listAudio } = useAudioStore()

  const category = 'Studium života'

  useEffect(() => {
    const getAudio = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/audio')
        if (!response.ok) {
          throw new Error('Chyba při načítání audio souborů')
        }

        const data = await response.json()
        const audios = data.audios || []
        const lsAudios = audios.filter((audio) => audio.category === category)
        setLifeStudy(lsAudios)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getAudio()
  }, [])

  // Get unique subcategories for filtering
  const subcategories = [...new Set(lifeStudy.map((audio) => audio.subcategory))].sort()

  // Filter audio files based on search term and subcategory
  const filteredAudios = lifeStudy.filter((audio) => {
    const matchesSearch =
      audio.audioTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audio.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedSubcategory === 'all' || audio.subcategory === selectedSubcategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#071e46]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Zpět
        </Link>
      </div>

      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#071e46] mb-4">Posluchárna</h1>
        <h3 className="text-xl md:text-2xl font-semibold text-[#9b7d57] mb-6">STUDIUM ŽIVOTA</h3>
        <div className="bg-[#edeae4] p-6 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            Dvacetiminutové relace jsou věnovány rozsáhlému dílu Witnesse Leeho – Studiu života v
            Bibli. Studium života v Bibli je obsáhlé a klasické knižní dílo, které navazuje na vše,
            co Pán zjevil své církvi v průběhu minulých staletí až do dnešních dnů. Se svými více
            než 25 000 stranami komentářů ke všem biblickým knihám se řadí k nejbohatším současným a
            aktuálním výkladům biblické pravdy.
          </p>
        </div>
      </div>

      {/* Error handling */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Chyba při načítání audio souborů: {error}</p>
        </div>
      )}

      {/* Audio content section */}
      <div className="mt-8">
        {filteredAudios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAudios.map((audio) => (
              <div
                key={audio.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                {/* Audio info header */}
                <div className="p-4 bg-[#edeae4]">
                  <p className="text-sm text-[#9b7d57] font-medium mb-1">{audio.subcategory}</p>
                  <h4 className="text-[#071e46] font-semibold mb-3 line-clamp-2 leading-tight">
                    {audio.audioTitle}
                  </h4>
                </div>

                {/* Audio player iframe */}
                <div className="aspect-video">
                  <iframe
                    src={audio.mp3file}
                    className="w-full h-full border-0"
                    allow="autoplay"
                    title={audio.audioTitle}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-[#9b7d57]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#071e46] mb-2">
                {searchTerm || selectedSubcategory !== 'all'
                  ? 'Žádné výsledky nenalezeny'
                  : 'Žádné nahrávky k dispozici'}
              </h3>
              <p className="text-[#9b7d57] mb-4">
                {searchTerm || selectedSubcategory !== 'all'
                  ? 'Zkuste upravit vyhledávání nebo filtr.'
                  : 'Momentálně nejsou k dispozici žádné nahrávky Studia života.'}
              </p>
              {(searchTerm || selectedSubcategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedSubcategory('all')
                  }}
                  className="px-4 py-2 bg-[#071e46] text-white rounded hover:bg-[#9b7d57] transition-colors duration-200"
                >
                  Zrušit filtry
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LifeStudy
