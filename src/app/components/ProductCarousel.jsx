// 'use client'
// import React, { useEffect, useState } from 'react'
// import { usePathname } from 'next/navigation'
// import axios from 'axios'
// import Image from 'next/image'

// import Loader from './Loader'
// import Message from './Message'

// const ProductCarousel = () => {
//   const [images, setImages] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [currentIndex, setCurrentIndex] = useState(0)

//   const [isDesktop, setIsDesktop] = useState(false)

//   const pathname = usePathname()
//   const isHomePage = pathname === '/'

//   // ALL useEffect hooks must be at the top level, before any returns
//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         setLoading(true)
//         const { data } = await axios.get(`/api/banner`)
//         const banners = data.banners || []
//         setImages(banners)
//         setError(null)
//       } catch (err) {
//         console.error('Error fetching banners:', err)
//         setError('Failed to load banners')
//       } finally {
//         setLoading(false)
//       }
//     }

//     // Only fetch if we're on the home page
//     if (isHomePage) {
//       fetchImages()
//     }
//   }, [isHomePage])

//   // Auto-advance carousel every 5 seconds
//   useEffect(() => {
//     if (images.length > 1) {
//       const interval = setInterval(() => {
//         setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
//       }, 5000)

//       return () => clearInterval(interval)
//     }
//   }, [images.length])

//   // Check screen size
//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsDesktop(window.innerWidth >= 1024) // lg breakpoint
//     }

//     // Check initial screen size
//     checkScreenSize()

//     // Listen for resize events
//     window.addEventListener('resize', checkScreenSize)
//     return () => window.removeEventListener('resize', checkScreenSize)
//   }, [])

//   // NOW we can do conditional returns after all hooks
//   if (!isHomePage) {
//     return null
//   }

//   if (!isDesktop) {
//     return null
//   }

//   if (loading) {
//     return <Loader />
//   }

//   if (error) {
//     return <Message variant="danger">{error}</Message>
//   }

//   if (!images || images.length === 0) {
//     return null
//   }

//   return (
//     <div className="hidden lg:flex my-8 -z-10">
//       {/* Simple slider container */}
//       <div className="relative h-96 w-full overflow-hidden">
//         {images.map((image, index) => {
//           let positionClass = ''
//           if (index === currentIndex) {
//             positionClass = 'translate-x-0'
//           } else if (index === (currentIndex + 1) % images.length) {
//             positionClass = 'translate-x-full'
//           } else {
//             positionClass = 'translate-x-full'
//           }

//           return (
//             <div
//               key={image.id}
//               className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${positionClass}`}
//             >
//               <Image
//                 src={image.image}
//                 alt={image.bannerTitle || `Banner ${index + 1}`}
//                 fill
//                 className="object-fit w-full h-96 mt-0 mb-0 ml-0 p-0"
//                 sizes="100vw"
//                 priority={index === 0}
//               />
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default ProductCarousel
import Image from 'next/image'
import ProductCarouselClient from './ProductCarouselClient'

export default function ProductCarousel({ images }) {
  // Don't render anything if no images
  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="hidden lg:flex my-8 -z-10">
      <div className="relative h-96 w-full overflow-hidden">
        {/* Server-render the first image for SEO */}
        <div className="absolute inset-0">
          <Image
            src={images[0].image}
            alt={images[0].bannerTitle || 'Banner 1'}
            fill
            className="object-fit w-full h-96 mt-0 mb-0 ml-0 p-0"
            sizes="100vw"
            priority
          />
        </div>

        {/* Client component for carousel functionality */}
        {images.length > 1 && <ProductCarouselClient images={images} />}
      </div>
    </div>
  )
}
