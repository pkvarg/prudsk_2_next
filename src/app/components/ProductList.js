// app/products/page.js or any client component
'use client'

import { useState, useEffect } from 'react'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch products when component mounts
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products/')

        console.log('response', response)

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()
        console.log('data', data)
        setProducts(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <div>Loading products...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Products</h1>
      {/* {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      )} */}
    </div>
  )
}
