// app/product/[id]/page.js (Server Component)
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import BackButton from '../../components/BackButton'
import FavoriteButton from '../../components/FavoriteButton'
import CartSection from '../../components/CartSection'
import ProductReviews from '../../components/ProductReviews'

// CRITICAL: Add this to enable ISR (revalidate every hour)
export const revalidate = 3600 // 1 hour in seconds

// Generate static params for all products at build time
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/api/products/all`, {
      cache: 'force-cache',
    })

    if (!response.ok) {
      console.error('Failed to fetch products for static generation')
      return []
    }

    const data = await response.json()

    // Handle the known response structure
    const products = data.products || data

    if (!Array.isArray(products) || products.length === 0) {
      console.warn('No products found for static generation')
      return []
    }

    console.log(`Found ${products.length} products for static generation`)

    // Return array of params for each product
    const params = products
      .map((product) => {
        // Handle both _id and id fields (MongoDB compatibility)
        const productId = product.id || product._id
        if (!productId) {
          console.warn('Product missing ID:', product)
          return null
        }
        return {
          id: productId.toString(),
        }
      })
      .filter(Boolean) // Remove any null entries

    console.log('Final static params:', params.length, 'products')
    return params
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Server function to fetch product data
async function getProduct(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'force-cache', // Changed from 'no-store' to enable static generation
      next: { revalidate: 3600 }, // Alternative way to set revalidation
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    // Add source identification
    //console.error(`🔍 [PRODUCT PAGE] getProduct(${id}) failed:`, error.message)

    // Silently fail during build - pages will be hydrated at runtime
    if (process.env.NODE_ENV !== 'development') {
      return null
    }
    console.error('Error fetching product:', error)
    return null
  }
}

// Server function to fetch product reviews
async function getProductReviews(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/api/products/${id}/reviews`, {
      cache: 'force-cache', // Changed from 'no-store'
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data || []
  } catch (error) {
    // Silently fail during build - pages will be hydrated at runtime
    if (process.env.NODE_ENV !== 'development') {
      return []
    }
    console.error('Error fetching reviews:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const product = await getProduct(resolvedParams.id)

  if (!product) {
    return {
      title: 'Produkt nenalezen - Proud života',
      description: 'Požadovaný produkt nebyl nalezen.',
    }
  }

  return {
    title: `${product.name} - Proud života`,
    description:
      product.description ||
      `Křesťanská literatura - ${product.name}. Přinášet bohatství Božího slova všemu Božímu lidu.`,
    keywords: `${product.name}, ${
      product.author || ''
    }, křesťanské knihy, křesťanská literatura, duchovní knihy, Bible, studium Biblie, ${
      product.tags || ''
    }`,
    openGraph: {
      title: `${product.name} - Proud života`,
      description: product.description || `Křesťanská literatura - ${product.name}`,
      images: product.image
        ? [
            {
              url: product.image,
              width: 800,
              height: 600,
              alt: product.name,
            },
          ]
        : [],
      type: 'website',
      url: `https://proudzivota.cz/product/${resolvedParams.id}`, // Add canonical URL
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - Proud života`,
      description: product.description || `Křesťanská literatura - ${product.name}`,
      images: product.image ? [product.image] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// Main server component
export default async function ProductPage({ params }) {
  const resolvedParams = await params
  const [product, reviews] = await Promise.all([
    getProduct(resolvedParams.id),
    getProductReviews(resolvedParams.id),
  ])

  if (!product) {
    notFound()
  }

  const acknowledgedReviews = reviews.filter((review) => review.isAcknowledged)

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: `https://proudzivota.cz/product/${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'Proud života',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'CZK',
      availability:
        product.countInStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Proud života',
      },
    },
    ...(product.author && {
      author: {
        '@type': 'Person',
        name: product.author,
      },
    }),
    ...(product.isbn && {
      isbn: product.isbn,
    }),
    ...(reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingCount: reviews.length,
        ratingValue:
          reviews.reduce((sum, review) => sum + (review.rating || 5), 0) / reviews.length,
      },
    }),
  }

  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-4 lg:mx-[10%]">
        {/* Back button - client component */}
        <BackButton />

        <div key={product.id}>
          <div className="flex flex-wrap -mx-4">
            {/* Product Image and Sidebar */}
            <div className="w-full md:w-1/4 px-4 mb-6">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                className="w-full rounded-lg"
                priority
              />

              {/* Desktop Sidebar */}
              <div className="hidden md:block mx-6 mt-6 p-4 bg-white rounded-lg shadow">
                <h5 className="text-lg font-semibold mb-2">Katalog</h5>
                <h6 className="mb-4">{product.catalog}</h6>

                {(product.related || product.related2 || product.related3) && (
                  <h5 className="text-lg font-semibold mb-2">Pozrite si tiež</h5>
                )}

                {product.related && (
                  <Link href={`/product/${product.related.id}`} className="block">
                    <h6 className="text-blue-600 hover:underline mb-2">{product.related.name}</h6>
                  </Link>
                )}
                {product.related2 && (
                  <Link href={`/product/${product.related2.id}`} className="block">
                    <h6 className="text-blue-600 hover:underline mb-2">{product.related2.name}</h6>
                  </Link>
                )}
                {product.related3 && (
                  <Link href={`/product/${product.related3.id}`} className="block">
                    <h6 className="text-blue-600 hover:underline mb-2">{product.related3.name}</h6>
                  </Link>
                )}

                {product.weight && (
                  <>
                    <h5 className="text-lg font-semibold mb-2">Hmotnost</h5>
                    <h6 className="mb-4">{product.weight.replace('.', ',')}kg</h6>
                  </>
                )}

                {product.tags && (
                  <>
                    <h5 className="text-lg font-semibold mb-2">Tagy</h5>
                    <h6 className="mb-4">{product.tags}</h6>
                  </>
                )}

                {product.binding && (
                  <>
                    <h5 className="text-lg font-semibold mb-2">Vazba</h5>
                    <h6 className="mb-4">{product.binding}</h6>
                  </>
                )}

                {product.pages && (
                  <>
                    <h5 className="text-lg font-semibold mb-2">Počet stran</h5>
                    <h6 className="mb-4">{product.pages}</h6>
                  </>
                )}

                {product.isbn && (
                  <>
                    <h5 className="text-lg font-semibold mb-2">ISBN:</h5>
                    <h6 className="mb-4">{product.isbn}</h6>
                  </>
                )}

                <h5 className="text-lg font-semibold mb-2">Jazyk</h5>
                {product.language === 'SK' ? (
                  <Image
                    src="/images/flag_sk40px_0.png"
                    alt="Slovenský jazyk"
                    width={40}
                    height={40}
                  />
                ) : (
                  <Image
                    src="/images/flag_cz40px_2_27.png"
                    alt="Český jazyk"
                    width={40}
                    height={40}
                  />
                )}

                {product.excerpt?.excerpt && (
                  <Link href={`/library/${product.id}`}>
                    <h5 className="text-lg font-semibold mb-2 text-blue-600 hover:underline">
                      Do čítárny
                    </h5>
                  </Link>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full md:w-1/2 px-4 mb-6">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <FavoriteButton product={product} />
                  </div>
                  {product.author && <h2 className="text-xl mt-2">{product.author}</h2>}
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <p>Cena: {product.price} Kč</p>
                </div>

                {product.description && (
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p>Popis: {product.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shopping Cart Section */}
            <div className="w-full md:w-1/4 px-4">
              <CartSection product={product} />
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {product && (
          <div className="md:hidden mt-6 p-4 bg-white rounded-lg shadow">
            <h5 className="text-lg font-semibold mb-2">Katalog</h5>
            <h6 className="mb-4">{product.catalog}</h6>

            {(product.related || product.related2 || product.related3) && (
              <h5 className="text-lg font-semibold mb-2">Podívejte se také na</h5>
            )}

            {product.related && (
              <Link href={`/product/${product.related.id}`} className="block">
                <h6 className="text-blue-600 hover:underline mb-2">{product.related.name}</h6>
              </Link>
            )}
            {product.related2 && (
              <Link href={`/product/${product.related2.id}`} className="block">
                <h6 className="text-blue-600 hover:underline mb-2">{product.related2.name}</h6>
              </Link>
            )}
            {product.related3 && (
              <Link href={`/product/${product.related3.id}`} className="block">
                <h6 className="text-blue-600 hover:underline mb-2">{product.related3.name}</h6>
              </Link>
            )}

            {product.weight && (
              <>
                <h5 className="text-lg font-semibold mb-2">Hmotnost</h5>
                <h6 className="mb-4">{product.weight}</h6>
              </>
            )}

            {product.tags && (
              <>
                <h5 className="text-lg font-semibold mb-2">Tagy</h5>
                <h6 className="mb-4">{product.tags}</h6>
              </>
            )}

            {product.binding && (
              <>
                <h5 className="text-lg font-semibold mb-2">Vazba</h5>
                <h6 className="mb-4">{product.binding}</h6>
              </>
            )}

            {product.pages && (
              <>
                <h5 className="text-lg font-semibold mb-2">Počet stran</h5>
                <h6 className="mb-4">{product.pages}</h6>
              </>
            )}

            {product.isbn && (
              <>
                <h5 className="text-lg font-semibold mb-2">ISBN:</h5>
                <h6 className="mb-4">{product.isbn}</h6>
              </>
            )}

            <h5 className="text-lg font-semibold mb-2">Jazyk</h5>
            {product.language === 'SK' && (
              <Image src="/images/flag_sk40px_0.png" alt="Slovenský jazyk" width={40} height={40} />
            )}
            {product.language === 'CZ' && (
              <Image src="/images/flag_cz40px_2_27.png" alt="Český jazyk" width={40} height={40} />
            )}

            {product.excerpt?.excerpt && (
              <Link href={`/library/${product.id}`}>
                <h5 className="text-lg font-semibold mb-2 text-blue-600 hover:underline">
                  Do čítárny
                </h5>
              </Link>
            )}
          </div>
        )}

        {/* Reviews Section */}
        <ProductReviews product={product} initialReviews={acknowledgedReviews} />
      </main>
    </>
  )
}
