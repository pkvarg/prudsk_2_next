import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      message,
      honeypot,
      detectionType,
      detectionDetails,
      locale,
      origin,
      timeSpent,
    } = body

    // Extract IP and User Agent from headers
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'Unknown'

    // Log to console (you can replace this with database storage if needed)
    console.log('🤖 BOT ATTEMPT DETECTED:', {
      timestamp: new Date().toISOString(),
      detectionType,
      detectionDetails,
      formData: {
        name: name || null,
        email: email || null,
        phone: phone || null,
        message: message || null,
        honeypot: honeypot || null,
      },
      userAgent,
      ipAddress,
      timeSpent: timeSpent || null,
      locale: locale || null,
      origin: origin || null,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Bot attempt logged successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error logging bot attempt:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to log bot attempt',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
