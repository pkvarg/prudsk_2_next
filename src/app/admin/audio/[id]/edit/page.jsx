'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useAudioStore from '@/store/audioStore'
import Image from 'next/image'

const AudioEditPage = () => {
  const params = useParams()
  const router = useRouter()
  const audioId = params.id

  const [audioTitle, setAudioTitle] = useState('')
  const [mp3file, setMp3file] = useState('')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false)

  const { audioDetails, audioUpdate, listAudioDetails, updateAudio, resetAudioUpdate } =
    useAudioStore()

  const { loading, error, audio } = audioDetails
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = audioUpdate

  // Categories and subcategories data
  const categories = ['Slova života', 'Studium života']

  const subcategoriesSlova = [
    'Bůh v listu Římanům',
    'Boží evangelium',
    'Člověk a dva stromy',
    'Evangelium království',
    'Fakt, víra a prožitek',
    'Hlavní Kristovy kroky',
    'Charakter Pánova pracovníka',
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

  const subcategoriesStudium = ['Studium života']

  // Load audio details only when audioId changes
  useEffect(() => {
    if (audioId) {
      listAudioDetails(audioId)
    }
  }, [audioId]) // Only depend on audioId

  // Handle success update
  useEffect(() => {
    if (successUpdate) {
      resetAudioUpdate()
      router.push('/admin/audiolist')
    }
  }, [successUpdate])

  // Set form values when audio loads
  useEffect(() => {
    if (audio && audio.id === audioId) {
      setAudioTitle(audio.audioTitle || '')
      setMp3file(audio.mp3file || '')
      setCategory(audio.category || '')
      setSubcategory(audio.subcategory || '')
    }
  }, [audio, audioId])

  const submitHandler = (e) => {
    e.preventDefault()
    updateAudio({
      id: audioId,
      audioTitle,
      mp3file,
      category,
      subcategory,
    })
  }

  // Loading component
  const Loader = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  )

  // Message component
  const Message = ({ variant, children }) => {
    const variantClasses = {
      danger: 'bg-red-100 border border-red-400 text-red-700',
      success: 'bg-green-100 border border-green-400 text-green-700',
      info: 'bg-blue-100 border border-blue-400 text-blue-700',
    }

    return (
      <div className={`px-4 py-3 rounded mb-4 ${variantClasses[variant] || variantClasses.info}`}>
        {children}
      </div>
    )
  }

  // Dropdown component
  const Dropdown = ({ title, options, value, onChange, show, onToggle }) => (
    <div className="relative mb-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex justify-between items-center transition-colors"
      >
        {title}
        <svg
          className={`w-4 h-4 transform transition-transform ${show ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {show && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option)
                onToggle()
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
            >
              <h5 className="text-sm font-medium text-gray-700">{option}</h5>
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="w-full px-4 py-8">
      <Link
        href="/admin/audiolist"
        className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        ← Zpět
      </Link>

      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Audio</h1>

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <form onSubmit={submitHandler} className="space-y-6">
            {/* Audio Title */}
            <div>
              <label htmlFor="audio-title" className="block text-sm font-medium text-gray-700 mb-2">
                Název (napr. Bůh v listu Římanům I)
              </label>
              <input
                type="text"
                id="audio-title"
                placeholder="Název"
                value={audioTitle}
                onChange={(e) => setAudioTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Audio File */}
            <div>
              <label htmlFor="audio-file" className="block text-sm font-medium text-gray-700 mb-2">
                Linka z Google drive (bez uvozovek)
              </label>
              <div className="mb-3">
                <Image
                  src="/images/iframe.webp"
                  alt="iframe"
                  width={400}
                  height={200}
                  priority
                  className="rounded-lg border border-gray-300"
                />
              </div>
              <input
                type="text"
                id="audio-file"
                placeholder="Linka z Google drive"
                value={mp3file}
                onChange={(e) => setMp3file(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
              <Dropdown
                title="Kategorie"
                options={categories}
                value={category}
                onChange={setCategory}
                show={showCategoryDropdown}
                onToggle={() => setShowCategoryDropdown(!showCategoryDropdown)}
              />
              <input
                type="text"
                placeholder="Kategorie"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Subcategory */}
            {category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Podkategorie</label>
                <Dropdown
                  title="Podkategorie"
                  options={
                    category === 'Studium života' ? subcategoriesStudium : subcategoriesSlova
                  }
                  value={subcategory}
                  onChange={setSubcategory}
                  show={showSubcategoryDropdown}
                  onToggle={() => setShowSubcategoryDropdown(!showSubcategoryDropdown)}
                />
                <input
                  type="text"
                  placeholder="Podkategorie"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loadingUpdate}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {loadingUpdate ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Ukládání...
                </>
              ) : (
                'Uložit'
              )}
            </button>
          </form>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(showCategoryDropdown || showSubcategoryDropdown) && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => {
            setShowCategoryDropdown(false)
            setShowSubcategoryDropdown(false)
          }}
        />
      )}
    </div>
  )
}

export default AudioEditPage
