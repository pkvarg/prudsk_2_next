import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db/db'

export async function GET() {
  console.log('here')

  try {
    // Fetch all products
    // const products = await prisma.video.findMany()

    const products = await prisma.video.findMany()
    console.log(products)

    // Return successful response
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch products',
      },
      {
        status: 500,
      },
    )
  }

  // try {
  //   console.log('Testing database connection...')

  //   // Try a simple database operation
  //   // For MongoDB, we can check if we can connect and list database info
  //   const databaseInfo = await prisma.$runCommandRaw({
  //     dbStats: 1,
  //   })

  //   console.log('Database connection successful!')
  //   console.log('Database info:', databaseInfo)

  //   // List all collections in the database
  //   const collections = await prisma.$runCommandRaw({
  //     listCollections: 1,
  //   })

  //   return NextResponse.json({
  //     success: true,
  //     message: 'Database connection successful',
  //     databaseInfo,
  //     collections,
  //     databaseName: databaseInfo.db,
  //     collectionCount: collections.cursor.firstBatch.length,
  //     collectionNames: collections.cursor.firstBatch.map((coll) => coll.name),
  //   })
  // } catch (error) {
  //   console.error('Database connection error:', error)

  //   return NextResponse.json(
  //     {
  //       success: false,
  //       message: 'Database connection failed',
  //       error: error.message,
  //       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  //     },
  //     {
  //       status: 500,
  //     },
  //   )
  // }
}
