// app/products/page.js
import ProductList from '@/app/components/ProductList'

export const metadata = {
  title: 'Our Products',
  description: 'Browse our collection of products',
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Katalog produktov</h1>
      <ProductList />
    </div>
  )
}
