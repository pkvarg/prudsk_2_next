'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import useVideoStore from '@/store/videoStore'
import * as Icon from 'react-bootstrap-icons'

const VideoListPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageNumber = searchParams.get('page') || 1

  const {
    videoList,
    videoDelete,
    videoCreate,
    listVideo,
    deleteVideo,
    createVideo,
    resetVideoCreate,
    resetVideoDelete,
  } = useVideoStore()

  const { loading, error, videos } = videoList
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = videoDelete
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    video: createdVideo,
  } = videoCreate

  useEffect(() => {
    resetVideoCreate()

    if (successCreate && createdVideo?.id) {
      router.push(`/admin/video/${createdVideo.id}/edit`)
    } else {
      listVideo('', pageNumber)
    }
  }, [successDelete, successCreate, createdVideo, pageNumber, listVideo, resetVideoCreate, router])

  // Reset delete state after successful deletion
  useEffect(() => {
    if (successDelete) {
      resetVideoDelete()
      listVideo('', pageNumber) // Refresh the list
    }
  }, [successDelete, resetVideoDelete, listVideo, pageNumber])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      deleteVideo(id)
    }
  }

  const createVideoHandler = () => {
    createVideo()
  }

  // Sort videos alphabetically by title
  const sortedVideos = videos
    ? [...videos].sort((a, b) => {
        return a.videoTitle?.localeCompare(b.videoTitle) || 0
      })
    : []

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
    <div className="w-full px-4 py-8">
      {/* Header Row - Desktop */}
      <div className="hidden md:flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">YouTube Video</h1>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          onClick={createVideoHandler}
          disabled={loadingCreate}
        >
          {loadingCreate ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Icon.Plus size={20} />
          )}
          Přidat YouTube Video
        </button>
      </div>

      {/* Header Row - Mobile */}
      <div className="md:hidden flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">YouTube Video</h1>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-lg flex items-center gap-2 transition-colors"
          onClick={createVideoHandler}
          disabled={loadingCreate}
        >
          {loadingCreate ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Icon.Plus size={18} />
          )}
          <span className="text-sm">Přidat YouTube Video</span>
        </button>
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
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Název (v tomto -abecední-seznam-kníh- pořadí budou videa zobrazená)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akce
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedVideos.map((video) => (
                    <tr key={video.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {video.videoTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {video.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/video/${video.id}/edit`}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
                          >
                            <Icon.PencilFill size={16} />
                          </Link>
                          <button
                            className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                            onClick={() => deleteHandler(video.id)}
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
            {sortedVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {video.videoTitle}
                  </h3>
                  <div className="flex gap-2 ml-2">
                    <Link
                      href={`/admin/video/${video.id}/edit`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
                    >
                      <Icon.PencilFill size={14} />
                    </Link>
                    <button
                      className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                      onClick={() => deleteHandler(video.id)}
                    >
                      <Icon.Trash size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium text-gray-700">Video kód:</span>
                    <span className="ml-2">{video.code}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {sortedVideos.length === 0 && (
            <div className="text-center py-12">
              <Icon.PlayBtn className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Žádná YouTube videa</h3>
              <p className="text-gray-500 mb-6">Začněte přidáním prvního YouTube videa.</p>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                onClick={createVideoHandler}
              >
                <Icon.Plus size={20} className="inline mr-2" />
                Přidat YouTube Video
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default VideoListPage
