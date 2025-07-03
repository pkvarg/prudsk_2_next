// components/ProductCarouselClient.jsx (Client Component for interactivity)
'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function ProductCarouselClient({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [images.length])

  return (
    <>
      {images.map((image, index) => {
        if (index === 0) return null // First image is server-rendered

        let positionClass = ''
        if (index === currentIndex) {
          positionClass = 'translate-x-0'
        } else {
          positionClass = 'translate-x-full'
        }

        return (
          <div
            key={image.id}
            className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${positionClass}`}
          >
            <Image
              src={image.image}
              alt={image.bannerTitle || `Banner ${index + 1}`}
              fill
              className="object-fit w-full h-96 mt-0 mb-0 ml-0 p-0"
              sizes="100vw"
            />
          </div>
        )
      })}
    </>
  )
}
