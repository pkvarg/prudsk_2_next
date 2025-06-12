'use client'
import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import YoutubeEmbed from '@/app/components/YouTubeEmbed'
import axios from 'axios'
import useVideoStore from '@/store/videoStore'

const Video = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('title') // 'title', 'date', 'duration'
  const [viewMode, setViewMode] = useState('grid') // 'grid', 'list'

  const { videos: links = [], getAllVideos } = useVideoStore() // Default to empty array

  useEffect(() => {
    getAllVideos()
  }, [])

  // Sort and filter videos
  const processedVideos = useMemo(() => {
    // Ensure links is an array before processing
    if (!Array.isArray(links)) {
      return []
    }

    let filteredLinks = [...links]

    // Filter by search term
    if (searchTerm) {
      filteredLinks = filteredLinks.filter(
        (link) =>
          link.videoTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          link.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          link.category?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort videos
    filteredLinks.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.videoTitle || '').localeCompare(b.videoTitle || '')
        case 'date':
          return new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0)
        case 'duration':
          return (b.duration || 0) - (a.duration || 0)
        default:
          return (a.videoTitle || '').localeCompare(b.videoTitle || '')
      }
    })

    return filteredLinks
  }, [links, searchTerm, sortBy]) // Add 'links' to dependency array

  // Get unique categories for filtering (with safety check)
  const categories = useMemo(() => {
    if (!Array.isArray(links)) {
      return []
    }
    const uniqueCategories = [...new Set(links.map((link) => link.category).filter(Boolean))]
    return uniqueCategories.sort()
  }, [links])

  // const { videos: links, getAllVideos } = useVideoStore()

  // console.log('videos', links)

  // useEffect(() => {
  //   getAllVideos()
  // }, [])

  // // Sort and filter videos
  // const processedVideos = useMemo(() => {
  //   let filteredLinks = [...links]

  //   // Filter by search term
  //   if (searchTerm) {
  //     filteredLinks = filteredLinks.filter(
  //       (link) =>
  //         link.videoTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         link.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         link.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  //     )
  //   }

  //   // Sort videos
  //   filteredLinks.sort((a, b) => {
  //     switch (sortBy) {
  //       case 'title':
  //         return a.videoTitle.localeCompare(b.videoTitle)
  //       case 'date':
  //         return new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0)
  //       case 'duration':
  //         return (b.duration || 0) - (a.duration || 0)
  //       default:
  //         return a.videoTitle.localeCompare(b.videoTitle)
  //     }
  //   })

  //   return filteredLinks
  // }, [searchTerm, sortBy])

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

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#071e46] mb-4">Video</h1>
      </div>

      {/* Video Content */}
      {processedVideos.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
          }
        >
          {processedVideos.map((link) => (
            <div
              key={link.id || link.code}
              className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${
                viewMode === 'list' ? 'md:flex md:items-center' : ''
              }`}
            >
              <div className={viewMode === 'list' ? 'md:w-1/2 md:flex-shrink-0' : ''}>
                <YoutubeEmbed embedId={link.code} />
              </div>

              {(link.videoTitle || link.description || link.category) && (
                <div className={`p-4 ${viewMode === 'list' ? 'md:w-1/2' : ''}`}>
                  {link.videoTitle && (
                    <h3 className="text-lg font-semibold text-[#071e46] mb-2 line-clamp-2">
                      {link.videoTitle}
                    </h3>
                  )}

                  {link.category && (
                    <span className="inline-block bg-[#edeae4] text-[#071e46] text-xs px-2 py-1 rounded-full mb-2">
                      {link.category}
                    </span>
                  )}

                  {link.description && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-2">{link.description}</p>
                  )}

                  {link.duration && (
                    <div className="flex items-center text-xs text-[#9b7d57]">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {link.duration}
                    </div>
                  )}
                </div>
              )}
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
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#071e46] mb-2">
              {searchTerm ? 'Žádná videa nenalezena' : 'Žádná videa k dispozici'}
            </h3>
            <p className="text-[#9b7d57] mb-4">
              {searchTerm
                ? `Pro hledaný výraz "${searchTerm}" nebyly nalezeny žádné výsledky.`
                : 'Momentálně nejsou k dispozici žádná videa.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-[#071e46] text-white rounded hover:bg-[#9b7d57] transition-colors duration-200"
              >
                Zobrazit všechna videa
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Video
