// components/ProductCarousel.jsx (Server Component)
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
