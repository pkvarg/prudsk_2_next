'use client'
import React, { useState } from 'react'
import PropTypes from 'prop-types'

const YoutubeEmbed = ({
  embedId,
  title = 'YouTube video',
  autoplay = false,
  showControls = true,
  enablePrivacyMode = true,
  className = '',
  aspectRatio = '16/9', // '16/9', '4/3', '1/1'
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Build YouTube URL with parameters
  const getYouTubeUrl = () => {
    const baseUrl = enablePrivacyMode
      ? 'https://www.youtube-nocookie.com/embed'
      : 'https://www.youtube.com/embed'

    const params = new URLSearchParams({
      ...(autoplay && { autoplay: '1' }),
      ...(showControls && { controls: '1' }),
      rel: '0', // Don't show related videos from other channels
      modestbranding: '1', // Minimal YouTube branding
    })

    return `${baseUrl}/${embedId}?${params.toString()}`
  }

  const handleLoad = () => {
    setIsLoaded(true)
    setHasError(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(true)
  }

  // Aspect ratio classes
  const aspectRatioClass =
    {
      '16/9': 'aspect-video', // 16:9 ratio
      '4/3': 'aspect-[4/3]', // 4:3 ratio
      '1/1': 'aspect-square', // 1:1 ratio
    }[aspectRatio] || 'aspect-video'

  if (!embedId) {
    return (
      <div
        className={`${aspectRatioClass} bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-2"
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
          <p className="text-gray-500 text-sm">Video není k dispozici</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative ${aspectRatioClass} bg-black rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#071e46] rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-[#9b7d57] rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-2 h-2 bg-[#071e46] rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center p-4">
            <svg
              className="mx-auto h-12 w-12 text-red-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-red-600 text-sm font-medium">Chyba při načítání videa</p>
            <p className="text-gray-500 text-xs mt-1">Video ID: {embedId}</p>
          </div>
        </div>
      )}

      {/* YouTube iframe */}
      <iframe
        className="absolute inset-0 w-full h-full border-0"
        src={getYouTubeUrl()}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Play button overlay (optional) */}
      {!autoplay && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-red-600 bg-opacity-80 rounded-full p-4 transform transition-transform hover:scale-110">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Video info overlay (optional) */}
      {title !== 'YouTube video' && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm font-medium truncate">{title}</p>
        </div>
      )}
    </div>
  )
}

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired,
  title: PropTypes.string,
  autoplay: PropTypes.bool,
  showControls: PropTypes.bool,
  enablePrivacyMode: PropTypes.bool,
  className: PropTypes.string,
  aspectRatio: PropTypes.oneOf(['16/9', '4/3', '1/1']),
}

export default YoutubeEmbed
