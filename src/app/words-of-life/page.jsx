'use client'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import useAudioStore from '@/store/audioStore'
import usePlayerStore from '@/store/playerStore'

const WordsOfLife = () => {
  const [subcategory, setSubcategory] = useState('Božie evanjelium')
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

  const category = 'Slová života'

  // All subcategories for easier management - matching database exactly
  const subcategories = [
    'Boh v liste Rimanom',
    'Božie evanjelium',
    'Charakter Pánovho pracovníka',
    'Človek a dva stromy',
    'Evanjelium kráľovstva',
    'Fakt viera a skúsenosť',
    'Hlavné Kristove kroky',
    'Kresťanský život',
    'Kristovo vzkriesenie',
    'Kristus ako zľutovnica',
    'Naplnenie starého zákona',
    'Nevystihnuteľné Kristovo bohatstvo',
    'O človeku',
    'O Duchu',
    'O Kristovi',
    'Porátať sa s hriechmi',
    'Porátať sa so svetom',
    'Posolstvo evanjelia',
    'Prežívanie Krista',
    'Rada pre nových veriacich',
    'Rok milosti',
    'Skúsenosti veriacich s Kristovým vzkriesením',
    'Skúsenosť života',
    'Spasenie',
    'Svedomie',
    'Štruktúra Božieho evanjelia',
    'Trojnásobné semeno',
    'Učenie apoštolov',
    'Udeľovanie života',
    'Večný Boží plán',
    'Vzoprieť sa satanovi',
    'Zjavenie života',
    'Základné prvky kresťanského života',
  ]

  useEffect(() => {
    getAllAudios()
  }, [getAllAudios])

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
          Späť
        </Link>
      </div>

      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#071e46] mb-4">Poslucháreň</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-[#9b7d57] mb-4">
          SLOVÁ ŽIVOTA A PRAVDY
        </h2>
        <p className="text-gray-700 leading-relaxed max-w-4xl">
          Program Slová života a pravdy, ktorý vysielalo Rádio 7, je založený na krátkych úryvkoch z
          kníh Watchmana Nee a Witnessa Lee. Jednotlivé, približne pätnásťminútové nahrávky
          prinášajú svieži pohľad na pravdu zjavenú v Písme z perspektívy božského života, z ktorého
          sa tešia všetci veriaci v Krista.
        </p>
      </div>

      {/* Error handling */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Chyba pri načítavaní audio súborov: {error}</p>
        </div>
      )}

      {/* Subcategories section */}
      <div className="mb-8">
        <div className="hidden md:block mb-4">
          <h3 className="text-lg font-semibold text-[#071e46] bg-[#edeae4] px-4 py-2 rounded">
            Predmet
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
          nahrávok)
        </h4>

        {wordsOfLife.filter((audio) => audio.subcategory === subcategory).length > 0 ? (
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
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <p className="text-sm text-[#9b7d57] font-medium mb-2 text-center">
                        {audio.subcategory}
                      </p>
                      <h5 className="text-[#071e46] font-semibold text-center line-clamp-2 mb-2">
                        {audio.audioTitle}
                      </h5>
                      <p className="text-xs text-gray-500 text-center">Kliknite pre prehranie</p>
                    </div>
                  </div>
                ),
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-[#071e46] mb-2">Žiadne nahrávky nenájdené</h3>
            <p className="text-[#9b7d57]">
              Pre kategóriu "{subcategory}" nie sú momentálne k dispozícii žiadne audio nahrávky.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default WordsOfLife
