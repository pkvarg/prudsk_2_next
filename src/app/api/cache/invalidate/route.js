// app/api/cache/invalidate/route.js
import { revalidateTag, revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import isAdmin from '@/lib/isAdmin'

export async function POST(request) {
  const user = await isAdmin()
  if (!user?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

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
