import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../src/prisma/generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  // @desc Fetch all NO LIMIT products
  // @desc GET /api/products/all
  // @access Public

  try {
    // The commented out code was for adding searchName to products - keeping for reference
    /*
    const products = await prisma.product.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    for (const prod of products) {
      // Fetch the product by ID
      // const searchName = prod.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      // Update the product with searchName
      // await prisma.product.update({
      //   where: { id: prod.id },
      //   data: { searchName: searchName }
      // });
    }
    */

    // Fetch all products with no limit, sorted by name
    const products = await prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching all products:', error)

    return NextResponse.json(
      { error: 'Failed to fetch all products', details: error.message },
      { status: 500 },
    )
  }
}
