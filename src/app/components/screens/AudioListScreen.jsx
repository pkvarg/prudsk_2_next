'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listAudio, createAudio, deleteAudio } from '@/store/slices/audioSlice'
import Link from 'next/link'

const AudioListScreen = () => {
  const dispatch = useDispatch()
  const [keyword, setKeyword] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  // Extract data from the Redux store
  const { audios, loading, error, page, pages } = useSelector((state) => state.audio.audioList)

  const {
    loading: loadingCreate,
    success: successCreate,
    error: errorCreate,
    audio: createdAudio,
  } = useSelector((state) => state.audio.audioCreate)

  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = useSelector((state) => state.audio.audioDelete)

  // Load audio list on component mount or when dependencies change
  useEffect(() => {
    dispatch(listAudio({ keyword, pageNumber }))
  }, [dispatch, keyword, pageNumber, successCreate, successDelete])

  // Handle creating a new audio
  const createAudioHandler = () => {
    if (window.confirm('Are you sure you want to create a new audio?')) {
      dispatch(createAudio())
    }
  }

  // Handle deleting an audio
  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this audio?')) {
      dispatch(deleteAudio(id))
    }
  }

  // Pagination handlers
  const goToPrevPage = () => {
    if (page > 1) {
      setPageNumber(page - 1)
    }
  }

  const goToNextPage = () => {
    if (page < pages) {
      setPageNumber(page + 1)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Audio Files</h1>

      {/* Search & Create */}
      <div className="flex justify-between mb-4">
        <div className="w-1/2">
          <input
            type="text"
            placeholder="Search audio..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <button
          onClick={createAudioHandler}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loadingCreate}
        >
          {loadingCreate ? 'Creating...' : 'Create Audio'}
        </button>
      </div>

      {/* Success/Error Messages */}
      {successCreate && (
        <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
          Audio created successfully!
        </div>
      )}
      {errorCreate && (
        <div className="bg-red-100 text-red-800 p-2 mb-4 rounded">
          Error creating audio: {errorCreate}
        </div>
      )}
      {successDelete && (
        <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
          Audio deleted successfully!
        </div>
      )}
      {errorDelete && (
        <div className="bg-red-100 text-red-800 p-2 mb-4 rounded">
          Error deleting audio: {errorDelete}
        </div>
      )}

      {/* Audio List */}
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-2 mb-4 rounded">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">TITLE</th>
                  <th className="py-2 px-4 border-b">CATEGORY</th>
                  <th className="py-2 px-4 border-b">SUBCATEGORY</th>
                  <th className="py-2 px-4 border-b">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {audios.map((audio) => (
                  <tr key={audio.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{audio.id}</td>
                    <td className="py-2 px-4 border-b">{audio.audioTitle || 'No title'}</td>
                    <td className="py-2 px-4 border-b">{audio.category || 'No category'}</td>
                    <td className="py-2 px-4 border-b">{audio.subcategory || 'None'}</td>
                    <td className="py-2 px-4 border-b flex space-x-2">
                      <Link
                        href={`/admin/audio/${audio.id}/edit`}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteHandler(audio.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {audios.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-4 text-center">
                      No audio files found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={page === 1}
                className={`px-3 py-1 rounded ${
                  page === 1
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {page} of {pages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={page === pages}
                className={`px-3 py-1 rounded ${
                  page === pages
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AudioListScreen
