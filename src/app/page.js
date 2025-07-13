// app/page.js
import { Suspense } from 'react'
import ProductsClient from './components/ProductsClient'
import ProductCarousel from './components/ProductCarousel'
import Loader from './components/Loader'

// CRITICAL: Add this to enable ISR (revalidate every 30 minutes for homepage)
export const revalidate = 1800 // 30 minutes in seconds

// Enhanced metadata for better SEO
export const metadata = {
  metadataBase: new URL('https://proudzivota.cz'),
  title: 'Proud života - Křesťanská literatura a duchovní knihy',
  description:
    'Přinášet bohatství Božího slova všemu Božímu lidu. Objevte křesťanské knihy, duchovní literaturu a Bible studia od Watchman Nee, Witness Lee a dalších.',
  keywords:
    'křesťanské knihy, křesťanská literatura, duchovní knihy, duchovní literatúra, Bůh, trojjediný Bůh, Kristus, Ježíš Kristus, Duch, Duch Svatý, Život, Studium života, Bible, svatá Bible, studium Biblie, Písmo, Svaté Písmo, křesťanství, křesťané, církev, Církev, místní církev, místní cirkve, Watchman Nee, Witness Lee',
  openGraph: {
    title: 'Proud života - Křesťanská literatura a duchovní knihy',
    description:
      'Přinášet bohatství Božího slova všemu Božímu lidu. Křesťanské knihy, duchovní literatura a Bible studia.',
    type: 'website',
    url: 'https://proudzivota.cz',
    siteName: 'Proud života',
    locale: 'cs_CZ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proud života - Křesťanská literatura',
    description: 'Křesťanské knihy, duchovní literatura a Bible studia',
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
  alternates: {
    canonical: 'https://proudzivota.cz',
  },
}

// Add this near the top of your homepage file, after the metadata
export const dynamic = 'force-static'

// Server function to fetch initial products with ISR-friendly caching
async function getInitialProducts(searchKeyword = '', page = 1, pageSize = 8) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(
      `${baseUrl}/api/products?keyword=${searchKeyword}&page=${page}&pageSize=${pageSize}`,
      {
        cache: 'force-cache', // Changed from 'no-store' to enable static generation
        next: { revalidate: 1800 }, // Revalidate every 30 minutes
      },
    )

    if (!response.ok) {
      return { products: [], pages: 0 }
    }

    return await response.json()
  } catch (error) {
    // Silently fail during build - pages will be hydrated at runtime
    if (process.env.NODE_ENV !== 'development') {
      return { products: [], pages: 0 }
    }
    console.error('[HOMEPAGE] Error fetching initial products:', error)
    return { products: [], pages: 0, error: 'Failed to load products' }
  }
}

// Server function to fetch banner images
async function getBannerImages() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/api/banner`, {
      cache: 'force-cache', // Banners probably don't change often
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.banners || []
  } catch (error) {
    // Silently fail during build - pages will be hydrated at runtime
    if (process.env.NODE_ENV !== 'development') {
      return []
    }
    console.error('[HOMEPAGE] Error fetching banners:', error)
    return []
  }
}

// Server function to get featured/top products for structured data
async function getFeaturedProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/api/products/top`, {
      cache: 'force-cache',
      next: { revalidate: 1800 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.products || data || []
  } catch (error) {
    // Silently fail during build
    if (process.env.NODE_ENV !== 'development') {
      return []
    }
    console.error('Error fetching featured products:', error)
    return []
  }
}

// Simple loading fallback
function ProductsLoader() {
  return (
    <div className="mx-[7%]">
      <div className="flex justify-center items-center py-8">
        <Loader />
      </div>
    </div>
  )
}

// Main server component
export default async function HomePage({ searchParams }) {
  const resolvedSearchParams = await searchParams
  const keyword = resolvedSearchParams?.keyword || ''

  // Fetch initial data on the server (always page 1 for SSR)
  const [initialProductData, bannerImages, featuredProducts] = await Promise.all([
    getInitialProducts(keyword, 1, 8),
    getBannerImages(),
    getFeaturedProducts(),
  ])

  // Generate JSON-LD structured data for homepage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Proud života',
    description: 'Přinášet bohatství Božího slova všemu Božímu lidu',
    url: 'https://proudzivota.cz',
    publisher: {
      '@type': 'Organization',
      name: 'Distribuce Proud',
      logo: {
        '@type': 'ImageObject',
        url: 'https://proudzivota.cz/logo.png',
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://proudzivota.cz/eshop/abecední-seznam-kníh?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    ...(featuredProducts.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        name: 'Doporučené knihy',
        numberOfItems: featuredProducts.length,
        itemListElement: featuredProducts.slice(0, 8).map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.image,
            url: `https://proudzivota.cz/product/${product.id}`,
            ...(product.author && {
              author: {
                '@type': 'Person',
                name: product.author,
              },
            }),
            ...(product.price && {
              offers: {
                '@type': 'Offer',
                price: product.price,
                priceCurrency: 'CZK',
                availability:
                  product.countInStock > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
              },
            }),
          },
        })),
      },
    }),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Domů',
          item: 'https://proudzivota.cz',
        },
      ],
    },
  }

  // Organization structured data
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Distribuce Proud',
    alternateName: 'Proud života',
    url: 'https://proudzivota.cz',
    logo: 'https://proudzivota.cz/logo.png',
    description: 'Distribuce křesťanské literatury a duchovních knih',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+420 724 526 926',
      contactType: 'customer service',
      email: 'proud@proudnihy.cz',
    },
    sameAs: [
      // Add your social media URLs here if you have any
    ],
  }

  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <main className="mx-[7%]">
        {/* Server-rendered carousel */}
        <ProductCarousel images={bannerImages} />

        <h1 className="!text-3xl !font-normal text-[#9E7B54] mb-4">Naše publikace</h1>
        <hr className="border-gray-300 mb-6" />

        {/* Client component with Suspense boundary */}
        <Suspense fallback={<ProductsLoader />}>
          <ProductsClient
            initialProducts={initialProductData.products || []}
            initialPages={initialProductData.pages || 0}
            initialError={initialProductData.error}
            initialKeyword={keyword}
          />
        </Suspense>

        {/* SEO-friendly content section */}
        <section className="mt-12 mb-8">
          <div className="bg-[#f8f9fa] p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-[#071e46] mb-4">O nás - Proud života</h2>
            <p className="text-[#191817] leading-relaxed mb-4">
              Jsme distribuce křesťanské literatury, která si klade za cíl přinášet bohatství Božího
              slova všemu Božímu lidu. Naše knihy obsahují díla Watchmana Nee a Witnesse Lee, která
              vám pomohou v duchovním růstu a hlubším poznání Boha.
            </p>
            <p className="text-[#191817] leading-relaxed">
              Nabízíme široký výběr křesťanských knih, duchovní literatury a materiálů pro studium
              Bible. Každá kniha je pečlivě vybrána pro svou duchovní hodnotu a schopnost obohatit
              váš křesťanský život.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
