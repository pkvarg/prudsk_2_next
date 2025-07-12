// app/new-books/[id]/page.js (Server Component)
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Product from '@/app/components/Product'

// CRITICAL: Add this to enable ISR (revalidate every 4 hours)
export const revalidate = 14400 // 4 hours in seconds

// Generate static params for all years at build time
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/api/products/all`, {
      cache: 'force-cache',
    })

    if (!response.ok) {
      console.error('Failed to fetch products for year static generation')
      return []
    }

    const data = await response.json()

    // Handle the known response structure
    const products = data.products || data

    if (!Array.isArray(products) || products.length === 0) {
      console.warn('No products found for year static generation')
      return []
    }

    // Extract unique years from products
    const yearsSet = new Set()

    products.forEach((product) => {
      if (product.year && product.year.trim()) {
        yearsSet.add(product.year.trim())
      }
    })

    const years = Array.from(yearsSet).filter((year) => year) // Remove empty years
    console.log(`Found ${years.length} years for static generation:`, years)

    // Return array of params for each year
    return years.map((year) => ({
      id: year.toString(),
    }))
  } catch (error) {
    console.error('Error generating year static params:', error)
    return []
  }
}

// Server function to fetch all products
async function getAllProducts() {
  // Skip API calls during build if server isn't available
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.SKIP_BUILD_PRODUCT_VALIDATION === 'true'
  ) {
    return []
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/api/products/all`, {
      cache: 'force-cache',
      next: { revalidate: 14400 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()

    // Handle the known response structure
    return data.products || data || []
  } catch (error) {
    // Silently fail during build - pages will be hydrated at runtime
    if (process.env.NODE_ENV !== 'development') {
      return []
    }
    console.error('Error fetching all products:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const year = resolvedParams.id

  if (!year) {
    return {
      title: 'Knihy podle roku - Proud života',
      description: 'Procházejte křesťanské knihy podle roku vydání.',
    }
  }

  // Get products to count them for description
  const allProducts = await getAllProducts()
  const productsByYear = allProducts.filter((product) => product.year === year)
  const productCount = productsByYear.length

  return {
    title: `Knihy ${year} - Křesťanská literatura | Proud života`,
    description:
      productCount > 0
        ? `Objevte ${productCount} ${
            productCount === 1 ? 'knihu' : productCount < 5 ? 'knihy' : 'knih'
          } křesťanské literatury z roku ${year}. Watchman Nee, Witness Lee a další duchovní knihy.`
        : `Křesťanské knihy z roku ${year}. Procházejte naši sbírku duchovních knih a Bible studií.`,
    keywords: `knihy ${year}, křesťanské knihy ${year}, křesťanská literatura, duchovní knihy, Bible, studium Biblie, Watchman Nee, Witness Lee, rok ${year}`,
    openGraph: {
      title: `Knihy ${year} - Křesťanská literatura | Proud života`,
      description:
        productCount > 0
          ? `Objevte ${productCount} ${
              productCount === 1 ? 'knihu' : productCount < 5 ? 'knihy' : 'knih'
            } křesťanské literatury z roku ${year}`
          : `Křesťanské knihy z roku ${year}`,
      type: 'website',
      url: `https://proudzivota.cz/new-books/${year}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Knihy ${year} - Křesťanská literatura`,
      description: `${productCount} ${
        productCount === 1 ? 'kniha' : productCount < 5 ? 'knihy' : 'knih'
      } křesťanské literatury z roku ${year}`,
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
export default async function NewBooksPage({ params }) {
  const resolvedParams = await params
  const year = resolvedParams.id

  if (!year) {
    notFound()
  }

  // Get all products
  const allProducts = await getAllProducts()

  // Filter products by year
  const productsByYear = allProducts.filter((product) => product.year === year)

  // Sort products by name
  productsByYear.sort((a, b) => (a.name || '').localeCompare(b.name || ''))

  // Generate JSON-LD structured data for year page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Knihy ${year}`,
    description:
      productsByYear.length > 0
        ? `${productsByYear.length} ${
            productsByYear.length === 1 ? 'kniha' : productsByYear.length < 5 ? 'knihy' : 'knih'
          } křesťanské literatury z roku ${year}`
        : `Křesťanské knihy z roku ${year}`,
    url: `https://proudzivota.cz/new-books/${year}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: productsByYear.length,
      itemListElement: productsByYear.slice(0, 10).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          url: `https://proudzivota.cz/product/${product.id}`,
          ...(product.author && { author: { '@type': 'Person', name: product.author } }),
          ...(product.price && {
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'CZK',
            },
          }),
          ...(product.year && { datePublished: product.year }),
        },
      })),
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
          name: 'Knihy podle roku',
          item: 'https://proudzivota.cz/new-books',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `Knihy ${year}`,
          item: `https://proudzivota.cz/new-books/${year}`,
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

      <div className="mx-auto lg:mx-[10%] px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/"
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

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#071e46] mb-2">Knihy {year}</h1>
          {productsByYear.length > 0 && (
            <p className="text-[#9b7d57] text-lg">
              Nalezeno {productsByYear.length}{' '}
              {productsByYear.length === 1 ? 'kniha' : productsByYear.length < 5 ? 'knihy' : 'knih'}
            </p>
          )}
        </div>

        {/* Products grid */}
        {productsByYear.length > 0 ? (
          <>
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {productsByYear.map((product) => (
                <div key={product.id} className="flex flex-col h-full">
                  <Product product={product} />
                </div>
              ))}
            </div>

            {/* Mobile grid */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {productsByYear.map((product) => (
                <div key={`mobile-${product.id}`} className="flex flex-col">
                  <Product product={product} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-[#9b7d57]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#071e46] mb-2">Žádné knihy nenalezeny</h3>
              <p className="text-[#9b7d57]">
                Pro rok {year} nejsou momentálně k dispozici žádné knihy.
              </p>
              <div className="mt-6">
                <Link
                  href="/eshop/abecední-seznam-kníh"
                  className="inline-flex items-center px-4 py-2 bg-[#071e46] text-white rounded hover:bg-[#9b7d57] transition-colors duration-200"
                >
                  Procházet všechny knihy
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
