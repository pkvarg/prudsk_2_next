// app/eshop/[category]/page.js (Server Component)
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Product from '@/app/components/Product'
import CategoryClient from './CategoryClient'

// CRITICAL: Add this to enable ISR (revalidate every 2 hours)
export const revalidate = 7200 // 2 hours in seconds

// Generate static params for all categories at build time
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/api/products/all`, {
      cache: 'force-cache',
    })

    if (!response.ok) {
      console.error('Failed to fetch products for category static generation')
      return []
    }

    const data = await response.json()

    // Handle the known response structure
    const products = data.products || data

    if (!Array.isArray(products) || products.length === 0) {
      console.warn('No products found for category static generation')
      return []
    }

    // Extract unique categories from products
    const categoriesSet = new Set()

    products.forEach((product) => {
      if (product.category) {
        categoriesSet.add(product.category)
      }
      if (product.category2) {
        categoriesSet.add(product.category2)
      }
    })

    // Add special categories
    categoriesSet.add('abecední-seznam-kníh')

    const categories = Array.from(categoriesSet)
    //console.log(`Found ${categories.length} categories for static generation:`, categories)

    // Return array of params for each category
    return categories.map((category) => ({
      category: encodeURIComponent(category),
    }))
  } catch (error) {
    console.error('Error generating category static params:', error)
    return []
  }
}

// Server function to fetch all products
async function getAllProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/api/products/all`, {
      cache: 'force-cache',
      next: { revalidate: 7200 },
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
  const category = resolvedParams.category ? decodeURIComponent(resolvedParams.category) : null

  // Format category name for display
  const formatCategoryName = (cat) => {
    if (!cat) return 'Eshop'
    if (cat === 'abecední-seznam-kníh') return 'Abecední seznam knih'
    const formatted = cat.replace(/-/g, ' ')
    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase()
  }

  const categoryName = formatCategoryName(category)

  // Get products to count them for description
  const products = await getAllProducts()
  const filteredProducts = products.filter(
    (product) =>
      !category ||
      category === 'abecední-seznam-kníh' ||
      product.category === category ||
      product.category2 === category,
  )

  const productCount = filteredProducts.length

  return {
    title: `${categoryName} - Křesťanská literatura | Proud života`,
    description:
      category === 'abecední-seznam-kníh'
        ? `Kompletní abecední seznam všech ${productCount} knih křesťanské literatury. Watchman Nee, Witness Lee a další duchovní knihy.`
        : `Objevte ${productCount} knih v kategorii ${categoryName}. Křesťanská literatura, duchovní knihy a Bible studium. Rychlé dodání.`,
    keywords: `${categoryName}, křesťanské knihy, křesťanská literatura, duchovní knihy, Bible, studium Biblie, Watchman Nee, Witness Lee${
      category ? `, ${category}` : ''
    }`,
    openGraph: {
      title: `${categoryName} - Křesťanská literatura | Proud života`,
      description:
        category === 'abecední-seznam-kníh'
          ? `Kompletní abecední seznam všech ${productCount} knih křesťanské literatury`
          : `Objevte ${productCount} knih v kategorii ${categoryName}. Křesťanská literatura a duchovní knihy.`,
      type: 'website',
      url: `https://proudzivota.cz/eshop/${category}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} - Křesťanská literatura`,
      description: `${productCount} knih křesťanské literatury v kategorii ${categoryName}`,
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
export default async function CategoryPage({ params }) {
  const resolvedParams = await params
  const category = resolvedParams.category ? decodeURIComponent(resolvedParams.category) : null

  // Format category name for display
  const formatCategoryName = (cat) => {
    if (!cat) return 'Eshop'
    if (cat === 'abecední-seznam-kníh') return 'Abecední seznam knih'
    const formatted = cat.replace(/-/g, ' ')
    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase()
  }

  // Get all products
  const allProducts = await getAllProducts()

  // Filter products by category
  const filteredProducts = allProducts.filter(
    (product) =>
      !category ||
      category === 'abecední-seznam-kníh' ||
      product.category === category ||
      product.category2 === category,
  )

  // Sort products by name by default
  filteredProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''))

  // Generate JSON-LD structured data for category
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: formatCategoryName(category),
    description:
      category === 'abecední-seznam-kníh'
        ? `Kompletní abecední seznam všech ${filteredProducts.length} knih křesťanské literatury`
        : `${filteredProducts.length} knih v kategorii ${formatCategoryName(category)}`,
    url: `https://proudzivota.cz/eshop/${category}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: filteredProducts.length,
      itemListElement: filteredProducts.slice(0, 10).map((product, index) => ({
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
          name: 'Eshop',
          item: 'https://proudzivota.cz/eshop',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: formatCategoryName(category),
          item: `https://proudzivota.cz/eshop/${category}`,
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

      <div className="container mx-auto px-4 py-8">
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

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#071e46] mb-2">
            {formatCategoryName(category)}
          </h1>
          <p className="text-[#9b7d57] text-lg">
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1
              ? 'produkt'
              : filteredProducts.length < 5
              ? 'produkty'
              : 'produktů'}
          </p>
        </div>

        {/* Client-side wrapper for search and filtering */}
        <CategoryClient initialProducts={filteredProducts} category={category} />
      </div>
    </>
  )
}
