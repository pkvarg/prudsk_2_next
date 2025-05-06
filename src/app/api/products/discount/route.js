import { PrismaClient } from '../../../../../src/prisma/generated/prisma'

const prisma = new PrismaClient()

// @desc POST /api/products/discount
// @access Admin

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json()
    const discount = body.discount

    if (discount === undefined || discount === null) {
      return NextResponse.json({ error: 'Discount value is required' }, { status: 400 })
    }

    // Get all products
    const products = await prisma.product.findMany()

    if (products && products.length > 0) {
      // Update each product with the discount
      for (const product of products) {
        const price = product.price || 0
        const newPrice = price - (price * discount) / 100
        const roundedPriceToFiveCents = Math.ceil(newPrice * 20) / 20

        // Update the product with the new values
        await prisma.product.update({
          where: { id: product.id },
          data: {
            discount: discount,
            discountedPrice: roundedPriceToFiveCents,
          },
        })
      }

      return NextResponse.json(
        {
          message: 'Discounts set for all products',
        },
        { status: 200 },
      )
    } else {
      return NextResponse.json({ error: 'No products found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error setting discounts:', error)

    return NextResponse.json(
      { error: 'Failed to set discounts', details: error.message },
      { status: 500 },
    )
  }
}
