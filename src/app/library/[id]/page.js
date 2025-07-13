// app/library/[id]/page.js (Server Component)
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import LibraryClient from './LibraryClient'

// CRITICAL: Add this to enable ISR (revalidate every 6 hours)
export const revalidate = 21600 // 6 hours in seconds

// Generate static params for all products with excerpts at build time
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/api/products/all`, {
      cache: 'force-cache',
    })

    if (!response.ok) {
      console.error('Failed to fetch products for library static generation')
      return []
    }

    const data = await response.json()

    // Handle the known response structure
    const products = data.products || data

    if (!Array.isArray(products) || products.length === 0) {
      console.warn('No products found for library static generation')
      return []
    }

    // Filter products that have excerpts
    const productsWithExcerpts = products.filter(
      (product) => product.excerpt && product.excerpt.excerpt && product.excerpt.excerpt.trim(),
    )

    console.log(`Found ${productsWithExcerpts.length} products with excerpts for static generation`)

    // Return array of params for each product with excerpt
    return productsWithExcerpts
      .map((product) => {
        const productId = product.id || product._id
        if (!productId) {
          console.warn('Product missing ID:', product)
          return null
        }
        return {
          id: productId.toString(),
        }
      })
      .filter(Boolean)
  } catch (error) {
    console.error('Error generating library static params:', error)
    return []
  }
}

// Server function to fetch specific product
async function getProduct(id) {
  // Skip API calls during build if server isn't available
  // if (
  //   process.env.NODE_ENV === 'production' &&
  //   process.env.SKIP_BUILD_PRODUCT_VALIDATION === 'true'
  // ) {
  //   return null
  // }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'force-cache',
      next: { revalidate: 21600 },
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    // Silently fail during build - pages will be hydrated at runtime
    if (process.env.NODE_ENV !== 'development') {
      return null
    }
    console.error('Error fetching product for library:', error)
    return null
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const productId = resolvedParams.id

  const product = await getProduct(productId)

  if (!product || !product.excerpt?.excerpt) {
    return {
      title: 'Ukázka nenalezena - Proud života',
      description: 'Požadovaná ukázka z knihy nebyla nalezena.',
    }
  }

  // Create excerpt preview (first 150 characters)
  const excerptPreview =
    product.excerpt.excerpt.length > 150
      ? product.excerpt.excerpt.substring(0, 150) + '...'
      : product.excerpt.excerpt

  return {
    title: `${product.name} - Ukázka z knihy | Proud života`,
    description: `Přečtěte si ukázku z knihy "${product.name}"${
      product.author ? ` od ${product.author}` : ''
    }. ${excerptPreview}`,
    keywords: `${product.name}, ukázka z knihy, ${
      product.author || ''
    }, křesťanské knihy, křesťanská literatura, duchovní knihy, Bible, studium Biblie, čítárna${
      product.tags ? `, ${product.tags}` : ''
    }`,
    openGraph: {
      title: `${product.name} - Ukázka z knihy | Proud života`,
      description: `Přečtěte si ukázku z knihy "${product.name}"${
        product.author ? ` od ${product.author}` : ''
      }`,
      images:
        product.excerpt.image || product.image
          ? [
              {
                url: product.excerpt.image || product.image,
                width: 800,
                height: 600,
                alt: `Ukázka z knihy ${product.name}`,
              },
            ]
          : [],
      type: 'article',
      url: `https://proudzivota.cz/library/${productId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - Ukázka z knihy`,
      description: `Přečtěte si ukázku z knihy "${product.name}"${
        product.author ? ` od ${product.author}` : ''
      }`,
      images:
        product.excerpt.image || product.image ? [product.excerpt.image || product.image] : [],
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
export default async function LibraryPage({ params }) {
  const resolvedParams = await params
  const productId = resolvedParams.id

  if (!productId) {
    notFound()
  }

  // Get the specific product
  const product = await getProduct(productId)

  if (!product) {
    notFound()
  }

  // Check if product has excerpt
  if (!product.excerpt?.excerpt) {
    notFound()
  }

  // Generate JSON-LD structured data for book excerpt
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Ukázka z knihy: ${product.name}`,
    description: `Přečtěte si ukázku z knihy "${product.name}"${
      product.author ? ` od ${product.author}` : ''
    }`,
    image: product.excerpt.image || product.image,
    datePublished: product.createdAt,
    dateModified: product.updatedAt,
    author: product.author
      ? {
          '@type': 'Person',
          name: product.author,
        }
      : {
          '@type': 'Organization',
          name: 'Proud života',
        },
    publisher: {
      '@type': 'Organization',
      name: 'Proud života',
      logo: {
        '@type': 'ImageObject',
        url: 'https://proudzivota.cz/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://proudzivota.cz/library/${productId}`,
    },
    isPartOf: {
      '@type': 'Book',
      name: product.name,
      author: product.author
        ? {
            '@type': 'Person',
            name: product.author,
          }
        : undefined,
      isbn: product.isbn || undefined,
      url: `https://proudzivota.cz/product/${productId}`,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Domů',
          item: 'https://proudzivota.cz',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Čítárna',
          item: 'https://proudzivota.cz/library',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.name,
          item: `https://proudzivota.cz/library/${productId}`,
        },
      ],
    },
  }

  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href={`/library`}
            className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
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

        <div className="my-3">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#071e46] mb-8">{product.name}</h1>
            {product.author && (
              <h2 className="text-xl text-[#9b7d57] mb-6">Autor: {product.author}</h2>
            )}

            <div className="relative">
              <Link href={`/product/${product.id}`} className="float-left mr-8 mb-6 block">
                <Image
                  src={product.excerpt.image || product.image}
                  alt={`Ukázka z knihy ${product.name}`}
                  width={800}
                  height={600}
                  className="w-full max-w-xl h-auto object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-200"
                  priority
                />
              </Link>

              <div className="text-justify">
                <div className="mb-4 p-4 bg-[#f8f9fa] rounded-lg">
                  <p className="text-sm text-[#6c757d] font-medium">Ukázka z knihy</p>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-[#191817] text-[18px] leading-relaxed whitespace-pre-line">
                    {product.excerpt.excerpt}
                  </p>
                </div>
              </div>

              <div className="clear-both"></div>
            </div>
          </div>
        </div>

        {/* Client component for scroll to top */}
        <LibraryClient />
      </div>
    </>
  )
}
