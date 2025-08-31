'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import useAudioStore from '@/store/audioStore'
import * as Icon from 'react-bootstrap-icons'

// Loading component
const PageLoader = () => (
  <div className="container px-4 py-8">
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  </div>
)

// Main audio list component
const AudioList = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageNumber = searchParams.get('page') || 1

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredAudios, setFilteredAudios] = useState([])

  const {
    audioList,
    audioDelete,
    audioCreate,
    listAudio,
    deleteAudio,
    createAudio,
    resetAudioCreate,
    resetAudioDelete,
  } = useAudioStore()

  const { loading, error, audios } = audioList
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = audioDelete
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    audio: createdAudio,
  } = audioCreate

  useEffect(() => {
    resetAudioCreate()

    if (successCreate && createdAudio) {
      router.push(`/admin/audio/${createdAudio.id}/edit`)
    } else {
      listAudio('', pageNumber)
    }
  }, [successDelete, successCreate, createdAudio, pageNumber, listAudio, resetAudioCreate, router])

  // Reset delete state after successful deletion
  useEffect(() => {
    if (successDelete) {
      resetAudioDelete()
      listAudio('', pageNumber) // Refresh the list
    }
  }, [successDelete, resetAudioDelete, listAudio, pageNumber])

  // Filter audios based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAudios(audios)
    } else {
      const filtered = audios.filter(
        (audio) =>
          audio.audioTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          audio.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          audio.mp3file?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredAudios(filtered)
    }
  }, [audios, searchTerm])

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  console.log('filtered audions', filteredAudios)

  const deleteHandler = (id) => {
    if (window.confirm('Jste si jisti?')) {
      deleteAudio(id)
    }
  }

  const createAudioHandler = () => {
    createAudio()
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

  return (
    <div className="container px-4 py-8">
      {/* Header Row - Desktop */}
      <div className="hidden md:flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Audio súbory</h1>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          onClick={createAudioHandler}
          disabled={loadingCreate}
        >
          {loadingCreate ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Icon.Plus size={20} />
          )}
          Pridať audio súbor
        </button>
      </div>

      {/* Header Row - Mobile */}
      <div className="md:hidden flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Audio</h1>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-lg flex items-center gap-2 transition-colors"
          onClick={createAudioHandler}
          disabled={loadingCreate}
        >
          {loadingCreate ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Icon.Plus size={18} />
          )}
          <span className="text-sm">Pridať audio súbor</span>
        </button>
      </div>

      {/* Search Box */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Hľadať audio súbory..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <Icon.Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icon.X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Error and Loading Messages */}
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}

      {/* Main Content */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Název
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Súbor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akce
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAudios.map((audio) => (
                    <tr key={audio.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900">
                        {audio.audioTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {audio.mp3file}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {audio.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/audio/${audio.id}/edit`}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
                          >
                            <Icon.PencilFill size={16} />
                          </Link>
                          <button
                            className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                            onClick={() => deleteHandler(audio.id)}
                          >
                            <Icon.Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredAudios.map((audio) => (
              <div
                key={audio.id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {audio.audioTitle}
                  </h3>
                  <div className="flex gap-2 ml-2">
                    <Link
                      href={`/admin/audio/${audio.id}/edit`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
                    >
                      <Icon.PencilFill size={14} />
                    </Link>
                    <button
                      className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                      onClick={() => deleteHandler(audio.id)}
                    >
                      <Icon.Trash size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium text-gray-700">Súbor:</span>
                    <span className="ml-2">{audio.mp3file}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Kategorie:</span>
                    <span className="ml-2">{audio.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAudios.length === 0 && (
            <div className="text-center py-12">
              <Icon.MusicNote className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Žiadne audio súbory</h3>
              <p className="text-gray-500 mb-6">Začnite pridávaním prvého audio súboru.</p>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                onClick={createAudioHandler}
              >
                <Icon.Plus size={20} className="inline mr-2" />
                Pridať audio súbor
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Main component with Suspense boundary
const AudioListPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <AudioList />
    </Suspense>
  )
}

export default AudioListPage
