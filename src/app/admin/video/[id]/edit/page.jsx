'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useVideoStore from '@/store/videoStore'
import Image from 'next/image'

const VideoEditPage = () => {
  const params = useParams()
  const router = useRouter()
  const videoId = params.id

  const [videoTitle, setVideoTitle] = useState('')
  const [code, setCode] = useState('')

  const { videoDetails, videoUpdate, listVideoDetails, updateVideo, resetVideoUpdate } =
    useVideoStore()

  const { loading, error, video } = videoDetails
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = videoUpdate

  // Load video details only when videoId changes
  useEffect(() => {
    if (videoId) {
      listVideoDetails(videoId)
    }
  }, [videoId])

  // Handle success update
  useEffect(() => {
    if (successUpdate) {
      resetVideoUpdate()
      router.push('/admin/videolist')
    }
  }, [successUpdate, resetVideoUpdate, router])

  // Set form values when video loads
  useEffect(() => {
    if (video && video.id === videoId) {
      setVideoTitle(video.videoTitle || '')
      setCode(video.code || '')
    }
  }, [video, videoId])

  const submitHandler = (e) => {
    e.preventDefault()
    updateVideo({
      id: videoId,
      videoTitle,
      code,
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

  return (
    <div className="w-full px-4 py-8">
      <Link
        href="/admin/videolist"
        className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
      >
        ← Späť
      </Link>

      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">YouTube Video</h1>

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <form onSubmit={submitHandler} className="space-y-6">
            {/* Video Title */}
            <div>
              <label htmlFor="video-title" className="block text-sm font-medium text-gray-700 mb-2">
                Název (Videa se zobrazí v abecedním resp. číselném pořadí)
              </label>
              <input
                type="text"
                id="video-title"
                placeholder="Název"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Video Code */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Link kód
              </label>
              <input
                type="text"
                id="code"
                placeholder="Link kód"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 leading-relaxed">
                (kód je třeba zkopírovat z url adresy youtube videa, je to 11 znaků mezi '=' a '&',
                viz příklad ze screenshotu níže)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loadingUpdate}
              className="w-full bg-[#2bb2e6] hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
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

      {/* YouTube Code Example Image */}
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Příklad YouTube kódu:</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Image
              src="/images/YTcode.png"
              alt="YouTube code example"
              width={800}
              height={400}
              className="w-full h-auto"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Zkopírujte 11-znakový kód z URL adresy YouTube videa (mezi '=' a '&').
          </p>
        </div>
      </div>
    </div>
  )
}

export default VideoEditPage
