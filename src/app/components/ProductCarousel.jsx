// 'use client'
// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import Image from 'next/image'

// import Loader from './Loader'
// import Message from './Message'

// const ProductCarousel = () => {
//   const [images, setImages] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [currentIndex, setCurrentIndex] = useState(0)

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         setLoading(true)
//         const { data } = await axios.get(`/api/banner`)
//         const banners = data.banners || []
//         console.log('banners', banners)
//         setImages(banners)
//         setError(null)
//       } catch (err) {
//         console.error('Error fetching banners:', err)
//         setError('Failed to load banners')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchImages()
//   }, [])

//   console.log('images', images)

//   // Auto-advance carousel every 5 seconds
//   useEffect(() => {
//     if (images.length > 1) {
//       const interval = setInterval(() => {
//         setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
//       }, 5000)

//       return () => clearInterval(interval)
//     }
//   }, [images.length])

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
//     <div className="my-8 -z-10 mx-4 lg:mx-[10%]">
//       {/* Simple slider container */}
//       <div className="relative h-96 w-full overflow-hidden">
//         {images.map((image, index) => (
//           <div
//             key={image.id}
//             className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
//               index === currentIndex ? 'opacity-100' : 'opacity-0'
//             }`}
//           >
//             <Image
//               src={image.image}
//               alt={image.bannerTitle || `Banner ${index + 1}`}
//               fill
//               className="object-cover w-full h-96 mt-0 mb-0 ml-0 p-0"
//               sizes="100vw"
//               priority={index === 0}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ProductCarousel

'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'

import Loader from './Loader'
import Message from './Message'

const ProductCarousel = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`/api/banner`)
        const banners = data.banners || []
        console.log('banners', banners)
        setImages(banners)
        setError(null)
      } catch (err) {
        console.error('Error fetching banners:', err)
        setError('Failed to load banners')
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  console.log('images', images)

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [images.length])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <Message variant="danger">{error}</Message>
  }

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="my-8 -z-10">
      {/* Simple slider container */}
      <div className="relative h-96 w-full overflow-hidden">
        {images.map((image, index) => {
          let positionClass = ''
          if (index === currentIndex) {
            positionClass = 'translate-x-0'
          } else if (index === (currentIndex + 1) % images.length) {
            positionClass = 'translate-x-full'
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
                className="object-cover w-full h-96 mt-0 mb-0 ml-0 p-0"
                sizes="100vw"
                priority={index === 0}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductCarousel
