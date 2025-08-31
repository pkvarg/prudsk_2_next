// app/page.js
import { Suspense } from 'react'
import ProductsClient from './components/ProductsClient'
import ProductCarousel from './components/ProductCarousel'
import Loader from './components/Loader'

// CRITICAL: Add this to enable ISR (revalidate every 30 minutes for homepage)
export const revalidate = 1800 // 30 minutes in seconds

// Enhanced metadata for better SEO
export const metadata = {
  metadataBase: new URL('https://prud.sk'),
  title: 'Prúd života - Kresťanská literatúra a duchovné knihy',
  description:
    'Prinášať bohatstvo Božieho slova celému Božiemu ľudu. Objavte kresťanské knihy, duchovnú literatúru a štúdiá Biblie od Watchman Nee, Witness Lee a ďalších.',
  keywords:
    'kresťanské knihy, kresťanská literatúra, duchovné knihy, duchovná literatúra, Boh, trojjediný Boh, Kristus, Ježiš Kristus, Duch, Duch Svätý, Život, Štúdium života, Biblia, svätá Biblia, štúdium Biblie, Písmo, Sväté písmo, kresťanstvo, kresťania, cirkev, Cirkev, miestna cirkev, miestne cirkvi, Watchman Nee, Witness Lee',
  openGraph: {
    title: 'Prúd života - Kresťanská literatúra a duchovné knihy',
    description:
      'Prinášať bohatstvo Božieho slova celému Božiemu ľudu. Kresťanské knihy, duchovná literatúra a štúdiá Biblie.',
    type: 'website',
    url: 'https://prud.sk',
    siteName: 'Prúd života',
    locale: 'cs_CZ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prúd života - Kresťanská literatúra',
    description: 'Kresťanské knihy, duchovná literatúra a štúdiá Biblie',
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
    canonical: 'https://prud.sk',
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
    return { products: [], pages: 0, error: 'Nepodarilo sa načítať produkty' }
  }
}

// Server function to fetch banner images
async function getBannerImages() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/api/banner`, {
      cache: 'force-cache', // Banners probably don't change often
      next: { revalidate: 3600 }, // Revalidate every hour
      tags: ['banners'],
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
    name: 'Prúd života',
    description: 'Prinášať bohatstvo Božieho slova celému Božiemu ľudu',
    url: 'https://prud.sk',
    publisher: {
      '@type': 'Organization',
      name: 'Prúd života',
      logo: {
        '@type': 'ImageObject',
        url: 'https://prud.sk/logo.png',
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://prud.sk/eshop/abecední-seznam-kníh?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    ...(featuredProducts.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        name: 'Odporúčané knihy',
        numberOfItems: featuredProducts.length,
        itemListElement: featuredProducts.slice(0, 8).map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.image,
            url: `https://prud.sk/product/${product.id}`,
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
                priceCurrency: 'EUR',
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
          name: 'Domov',
          item: 'https://prud.sk',
        },
      ],
    },
  }

  // Organization structured data
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Prúd života',
    alternateName: 'Prúd života',
    url: 'https://prud.sk',
    logo: 'https://prud.sk/logo.png',
    description: 'Distribúcia kresťanskej literatúry a duchovných kníh',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+421 904 060 262',
      contactType: 'customer service',
      email: 'eshop@prud.sk',
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

        <h1 className="!text-3xl !font-normal text-[#9E7B54] mb-4">Naše publikácie</h1>
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
            <h2 className="text-2xl font-semibold text-[#071e46] mb-4">O nás - Prúd života</h2>
            <p className="text-[#191817] leading-relaxed mb-4">
              Sme distribúcia kresťanskej literatúry, ktorá si kladie za cieľ prinášať bohatstvo
              Božieho slova celému Božiemu ľudu. Naše knihy obsahujú diela Watchmana Nee a Witnessa
              Lee, ktoré vám pomôžu v duchovnom raste a hlbšom poznaní Boha.
            </p>
            <p className="text-[#191817] leading-relaxed">
              Ponúkame široký výber kresťanských kníh, duchovnej literatúry a materiálov na štúdium
              Biblie. Každá kniha je starostlivo vybraná pre svoju duchovnú hodnotu a schopnosť
              obohatiť váš kresťanský život.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
