// import HomeScreen from './components/Home'

// export default function Home() {
//   return (
//       <HomeScreen />
//   )
// }

// app/page.js
import { Suspense } from 'react'
import ProductsClient from './components/ProductsClient'
import ProductCarousel from './components/ProductCarousel'
import Loader from './components/Loader'

// This generates the metadata on the server
export const metadata = {
  title: 'Proud života',
  description: 'Přinášet bohatství Božího slova všemu Božímu lidu',
  keywords:
    'křesťanské knihy, křesťanská literatura, duchovní knihy, duchovní literatúra, Bůh, trojjediný Bůh, Kristus, Ježíš Kristus, Duch, Duch Svatý, Život, Studium života, Bible, svatá Bible, studium Biblie, Písmo, Svaté Písmo, křesťanství, křesťané, církev, Církev, místní církev, místní cirkve',
}

// Server function to fetch initial data
async function getInitialProducts(searchKeyword = '', page = 1, pageSize = 8) {
  try {
    // Replace with your actual API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const response = await fetch(
      `${baseUrl}/api/products?keyword=${searchKeyword}&page=${page}&pageSize=${pageSize}`,
      {
        cache: 'no-store', // For dynamic data, or use 'force-cache' for static data
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    return { products: [], pages: 0, error: 'Failed to load products' }
  }
}

// Server function to fetch banner images
async function getBannerImages() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/banner`, {
      cache: 'force-cache', // Banners probably don't change often
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error('Failed to fetch banners')
    }

    const data = await response.json()
    return data.banners || []
  } catch (error) {
    console.error('Error fetching banners:', error)
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
  const [initialProductData, bannerImages] = await Promise.all([
    getInitialProducts(keyword, 1, 8),
    getBannerImages(),
  ])

  return (
    <main className="mx-[7%]">
      {/* Server-rendered carousel */}
      <ProductCarousel images={bannerImages} />

      <h1 className="!text-3xl !font-normal text-[#9E7B54] mb-4">Naše publikace</h1>
      <hr className="border-gray-300 mb-6" />

      {/* Client component with Suspense boundary */}
      <Suspense fallback={<ProductsLoader />}>
        <ProductsClient
          initialProducts={initialProductData.products}
          initialPages={initialProductData.pages}
          initialError={initialProductData.error}
          initialKeyword={keyword}
        />
      </Suspense>
    </main>
  )
}

// // Main server component
// export default async function HomePage({ searchParams }) {
//   const resolvedSearchParams = await searchParams
//   const keyword = resolvedSearchParams?.keyword || ''

//   // Fetch initial data on the server (always page 1 for SSR)
//   const [initialProductData, bannerImages] = await Promise.all([
//     getInitialProducts(keyword, 1, 8), // Always start with page 1
//     getBannerImages(),
//   ])

//   return (
//     <main className="mx-[7%]">
//       {/* Server-rendered carousel */}
//       <ProductCarousel images={bannerImages} />

//       <h1 className="!text-3xl !font-normal text-[#9E7B54] mb-4">Naše publikace</h1>
//       <hr className="border-gray-300 mb-6" />

//       {/* Client component for interactive functionality */}
//       <ProductsClient
//         initialProducts={initialProductData.products}
//         initialPages={initialProductData.pages}
//         initialError={initialProductData.error}
//         initialKeyword={keyword}
//       />
//     </main>
//   )
// }
