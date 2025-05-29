import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'
import { auth } from '../../../../lib/auth'
import isAdmin from '../../../../lib/isAdmin'

const prisma = new PrismaClient()

// @desc Fetch single product
// @desc GET /api/products/:id
// @access Public

export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Validate the ID format (MongoDB ObjectID)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 })
    }

    // Find the product by ID
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (product) {
      return NextResponse.json(product)
    } else {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error fetching product:', error)

    return NextResponse.json(
      { error: 'Failed to fetch product', details: error.message },
      { status: 500 },
    )
  }
}

// @desc Delete a product
// @desc DELETE /api/products/:id
// @access Private/Admin
export async function DELETE(request, { params }) {
  try {
    const user = await isAdmin()

    if (!user.isAdmin) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params

    // Validate the ID format (MongoDB ObjectID)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete the product
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Product removed' })
  } catch (error) {
    console.error('Error deleting product:', error)

    return NextResponse.json(
      { error: 'Failed to delete product', details: error.message },
      { status: 500 },
    )
  }
}

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export async function PUT(request, { params }) {
  const user = await isAdmin()

  if (!user.isAdmin) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { id } = await params

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

    // Normal update case
    // Generate searchName from name with diacritics removed
    const searchName = name ? name.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : ''

    // Update the product
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
