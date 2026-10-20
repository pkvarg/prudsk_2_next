import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import isAdmin from '@/lib/isAdmin'

const TOKEN_TTL_SECONDS = 10 * 60

// Short-lived pass for uploading images to the hono API. Only an admin gets one; hono checks the
// signature with the same PRUDSK2NEXT_UPLOAD_SECRET, which never reaches the browser.
export async function POST() {
  const user = await isAdmin()
  if (!user?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const secret = process.env.PRUDSK2NEXT_UPLOAD_SECRET
  if (!secret) {
    console.error('PRUDSK2NEXT_UPLOAD_SECRET is not set')
    return NextResponse.json({ message: 'Upload is not configured' }, { status: 500 })
  }

  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS
  const payload = Buffer.from(JSON.stringify({ client: 'prudsk2next', exp })).toString('base64url')
  const signature = createHmac('sha256', secret).update(payload).digest('base64url')

  return NextResponse.json({ token: `${payload}.${signature}`, expiresAt: exp * 1000 })
}
