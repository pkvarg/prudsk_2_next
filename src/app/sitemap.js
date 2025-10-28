// app/sitemap.js
// Dynamic sitemap generation for Next.js 15

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://prud.sk'
  const siteUrl = 'https://prud.sk'

  // Static routes
  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/watchman-nee`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/witness-lee`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Fetch all products for dynamic routes
  let productRoutes = []
  try {
    const response = await fetch(`${baseUrl}/api/products/all`, {
      cache: 'no-store', // Always get fresh data for sitemap
    })

    if (response.ok) {
      const data = await response.json()
      const products = data.products || data

      if (Array.isArray(products)) {
        productRoutes = products.map((product) => {
          const productId = product.id || product._id
          return {
            url: `${siteUrl}/product/${productId}`,
            lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          }
        })
      }
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
  }

  // Fetch all categories for dynamic routes
  let categoryRoutes = []
  try {
    const response = await fetch(`${baseUrl}/api/categories`, {
      cache: 'no-store',
    })

    if (response.ok) {
      const categories = await response.json()

      if (Array.isArray(categories)) {
        categoryRoutes = categories.map((category) => ({
          url: `${siteUrl}/eshop/${category.slug || category.name}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
  }

  // Fetch all new books for dynamic routes
  let newBookRoutes = []
  try {
    const response = await fetch(`${baseUrl}/api/new-books`, {
      cache: 'no-store',
    })

    if (response.ok) {
      const newBooks = await response.json()

      if (Array.isArray(newBooks)) {
        newBookRoutes = newBooks.map((book) => {
          const bookId = book.id || book._id
          return {
            url: `${siteUrl}/new-books/${bookId}`,
            lastModified: book.createdAt ? new Date(book.createdAt) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
          }
        })
      }
    }
  } catch (error) {
    console.error('Error fetching new books for sitemap:', error)
  }

  // Combine all routes
  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...newBookRoutes]
}
