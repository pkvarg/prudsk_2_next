'use client'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import useAudioStore from '@/store/audioStore'
import usePlayerStore from '@/store/playerStore'

const WordsOfLife = () => {
  const [subcategory, setSubcategory] = useState('Boží evangelium')
  const [selectedAudio, setSelectedAudio] = useState(null)
  const myRef = useRef(null)

  // Zustand store
  const { audios, error, loading, getAllAudios } = useAudioStore()
  const { setCurrentAudio } = usePlayerStore()

  const subHandler = (sub) => {
    setSubcategory(sub)
    if (myRef.current) {
      myRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const category = 'Slova života'

  // All subcategories for easier management
  const subcategories = [
    'Bůh v listu Římanům',
    'Boží evangelium',
    'Charakter Pánova pracovníka',
    'Člověk a dva stromy',
    'Evangelium království',
    'Fakt, víra a prožitek',
    'Hlavní Kristovy kroky',
    'Kristovo vzkříšení',
    'Kristus jako slitovnice',
    'Křesťanský život',
    'Milostivé léto',
    'Naplnění Starého zákona',
    'Nevystižitelné Kristovo bohatství',
    'O člověku',
    'O Duchu',
    'O Kristu',
    'Poselství evangelia',
    'Prožívání Krista',
    'Rozdílení života',
    'Řada pro nové věřící',
    'Spasení',
    'Struktura Božího evangelia',
    'Svědomí',
    'Trojnásobné semeno',
    'Učení apoštolů',
    'Věčný Boží plán',
    'Vypořádání se s hříchy',
    'Vypořádání se se světem',
    'Vzepřít se Satanovi',
    'Základní prvky křesťanského života',
    'Zjevení života',
    'Zkušenosti věřících s Kristovým vzkříšením',
    'Zkušenost života',
  ]

  useEffect(() => {
    getAllAudios()
  }, [getAllAudios])

  const searchParams = useSearchParams()

  // Handle subcategory from URL parameter
  useEffect(() => {
    const urlSubcategory = searchParams.get('subcategory')
    if (urlSubcategory && subcategories.includes(urlSubcategory)) {
      setSubcategory(urlSubcategory)
      // Scroll to content after a short delay to ensure page is loaded
      setTimeout(() => {
        if (myRef.current) {
          myRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 500)
    }
  }, [])

  // Filter audios from store directly with safety check
  const wordsOfLife = useMemo(() => {
    if (!Array.isArray(audios)) {
      return []
    }
    return audios.filter((audio) => audio.category === category)
  }, [audios, category])

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
        <h2 className="text-xl md:text-2xl font-semibold text-[#9b7d57] mb-4">
          SLOVA ŽIVOTA A PRAVDY
        </h2>
        <p className="text-gray-700 leading-relaxed max-w-4xl">
          Pořad Slova života a pravdy, který odvysílalo Rádio 7, je založen na krátkých úryvcích z
          knih Watchmana Neeho a Witnesse Leeho. Jednotlivé, zhruba patnáctiminutové nahrávky
          přinášejí svěží pohled na pravdu zjevenou v Písmu z perspektivy božského života, z něhož
          se těší všichni věřící v Krista.
        </p>
      </div>

      {/* Error handling */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Chyba při načítání audio souborů: {error}</p>
        </div>
      )}

      {/* Subcategories section */}
      <div className="mb-8">
        <div className="hidden md:block mb-4">
          <h3 className="text-lg font-semibold text-[#071e46] bg-[#edeae4] px-4 py-2 rounded">
            Předmět
          </h3>
        </div>

        {/* Subcategory buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => subHandler(sub)}
              className={`px-3 py-2 text-sm rounded transition-colors duration-200 text-left ${
                subcategory === sub
                  ? 'bg-[#071e46] text-white'
                  : 'bg-[#edeae4] text-[#071e46] hover:bg-[#9b7d57] hover:text-white'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll target */}
      <div ref={myRef} className="scroll-mt-8"></div>

      {/* Audio content section */}
      <div className="mt-8">
        <h4 className="text-xl font-semibold text-[#071e46] mb-6">
          {subcategory} ({wordsOfLife.filter((audio) => audio.subcategory === subcategory).length}{' '}
          nahrávek)
        </h4>

        {wordsOfLife.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wordsOfLife.map(
                (audio, index) =>
                  audio.subcategory === subcategory && (
                    <div
                      key={audio.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#071e46]"
                      onClick={() => setCurrentAudio(audio)}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-center w-16 h-16 bg-[#071e46] rounded-full mx-auto mb-4">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <p className="text-sm text-[#9b7d57] font-medium mb-2 text-center">
                          {audio.subcategory}
                        </p>
                        <h5 className="text-[#071e46] font-semibold text-center line-clamp-2 mb-2">
                          {audio.audioTitle}
                        </h5>
                        <p className="text-xs text-gray-500 text-center">Klikněte pro přehrání</p>
                      </div>
                    </div>
                  ),
              )}
            </div>
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-[#071e46] mb-2">Žádné nahrávky nenalezeny</h3>
              <p className="text-[#9b7d57]">
                Pro kategorii "{subcategory}" nejsou momentálně k dispozici žádné audio nahrávky.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default WordsOfLife
