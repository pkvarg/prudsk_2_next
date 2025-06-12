'use client'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import useAudioStore from '@/store/audioStore'

const WordsOfLife = () => {
  const [subcategory, setSubcategory] = useState('Boží evangelium')

  const myRef = useRef(null)

  // Zustand store (if you have audio-related state there)
  const { audios, error, loading, getAllAudios } = useAudioStore()

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
  }, [])

  // Filter audios from store directly with safety check
  const wordsOfLife = useMemo(() => {
    // Ensure audios is an array before filtering
    if (!Array.isArray(audios)) {
      return []
    }
    return audios.filter((audio) => audio.category === category)
  }, [audios, category])

  const filteredAudios = wordsOfLife.filter((audio) => audio.subcategory === subcategory)

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
          className="inline-flex items-center px-4 py-2 bg-[#9b7d57] text-white rounded hover:bg-[#071e46] transition-colors duration-200"
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
        <h3 className="text-xl md:text-2xl font-semibold text-[#9b7d57] mb-4">
          SLOVA ŽIVOTA A PRAVDY
        </h3>
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
          <h4 className="text-lg font-semibold text-[#071e46] bg-[#edeae4] px-4 py-2 rounded">
            Předmět
          </h4>
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
        <h5 className="text-xl font-semibold text-[#071e46] mb-6">
          {subcategory} ({filteredAudios.length} nahrávek)
        </h5>

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
                  <h6 className="text-[#071e46] font-semibold mb-2 line-clamp-2">
                    {audio.audioTitle}
                  </h6>
                  {/* <a
                    href={audio.mp3file}
                    download
                    className="inline-flex items-center text-sm text-[#071e46] hover:text-[#9b7d57] transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Stáhnout
                  </a> */}
                </div>

                {/* Audio player iframe */}
                <div className="aspect-video">
                  <iframe
                    src={audio.mp3file}
                    className="w-full h-full"
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
              <h3 className="text-lg font-medium text-[#071e46] mb-2">Žádné nahrávky nenalezeny</h3>
              <p className="text-[#9b7d57]">
                Pro kategorii "{subcategory}" nejsou momentálně k dispozici žádné audio nahrávky.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation back to podcast categories */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-medium text-[#071e46] mb-4">Prohlédněte si také</h3>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/life-study"
              className="px-4 py-2 bg-[#edeae4] text-[#071e46] rounded hover:bg-[#9b7d57] hover:text-white transition-colors duration-200"
            >
              Studium života
            </Link>
            <Link
              href="/video"
              className="px-4 py-2 bg-[#edeae4] text-[#071e46] rounded hover:bg-[#9b7d57] hover:text-white transition-colors duration-200"
            >
              Video obsah
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WordsOfLife
