import { NextResponse } from 'next/server'
import prisma from '@/db/db'

// @desc    Update a product when adding favorite of to a product
// @route   PUT /api/products/:id/anybody
// @access  Private/Admin
export async function PUT(request, { params }) {
  try {
    // In Next.js 15, we need to await the id
    const id = await params.id

    // Parse request body
    const body = await request.json()
    const {
      name,
      price,
      discount,
      discountedPrice,
      description,
      excerpt,
      image,
      author,
      category,
      countInStock,
      catalog,
      weight,
      related,
      related2,
      related3,
      tags,
      language,
      binding,
      pages,
      isbn,
      year,
      searchName,
      favoriteOf,
    } = body

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: { favoriteOf: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Handle favoriteOf separately (it's a special case that adds to an array)
    if (favoriteOf) {
      await prisma.favorite.create({
        data: {
          favoriteOf: favoriteOf,
          productId: id,
        },
      })

      const updatedProduct = await prisma.product.findUnique({
        where: { id },
        include: { favoriteOf: true },
      })

      return NextResponse.json(updatedProduct)
    }

    // Normal update case - note: this endpoint keeps searchName as provided instead of regenerating it
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        discount,
        discountedPrice,
        description,
        excerpt,
        image,
        author,
        category,
        countInStock,
        catalog,
        weight,
        related,
        related2,
        related3,
        tags,
        language,
        binding,
        pages,
        isbn,
        year,
        searchName,
      },
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)

    return NextResponse.json(
      { error: 'Failed to update product', details: error.message },
      { status: 500 },
    )
  }
}
