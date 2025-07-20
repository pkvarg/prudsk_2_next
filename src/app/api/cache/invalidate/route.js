// app/api/cache/invalidate/route.js
import { revalidateTag, revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    // Option 2: Revalidate specific paths
    revalidatePath('/products') // revalidate products page
    revalidatePath('/product/[id]', 'page')
    revalidatePath('/library/[id]', 'page')
    revalidatePath('/library')
    revalidatePath('/new-books/[id]', 'page')
    revalidatePath('/') // revalidate homepage if it shows products
    revalidateTag('banners')

    return NextResponse.json({
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cache invalidation error:', error)
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 })
  }
}
