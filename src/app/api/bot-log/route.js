import { NextResponse } from 'next/server'
import { recordViolation } from '@/lib/ipReputation'
import { checkIPBan } from '@/lib/checkIPBan'
import prisma from '@/db/db'

export async function POST(request) {
  try {
    // Check if IP is banned first
    const ipCheck = await checkIPBan(request)
    if (ipCheck.isBanned) {
      return NextResponse.json(
        {
          error: 'Access Denied',
          message: ipCheck.banInfo.message,
          code: 'IP_BANNED',
        },
        { status: 403 }
      )
    }

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
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'Unknown'

    // Store in BotLog database
    const botLog = await prisma.botLog.create({
      data: {
        ipAddress,
        userAgent,
        detectionType,
        detectionDetails: detectionDetails || null,
        formData: {
          name: name || null,
          email: email || null,
          phone: phone || null,
          message: message || null,
          honeypot: honeypot || null,
        },
        timeSpent: timeSpent || null,
        locale: locale || null,
        origin: origin || null,
      },
    })

    // Log to console
    console.log('🤖 BOT ATTEMPT DETECTED:', {
      id: botLog.id,
      timestamp: new Date().toISOString(),
      detectionType,
      detectionDetails,
      ipAddress,
      userAgent,
      origin,
    })

    // Record IP violation and get ban status
    const violationResult = await recordViolation(ipAddress, detectionType, detectionDetails)

    return NextResponse.json(
      {
        success: true,
        message: 'Bot attempt logged successfully',
        logId: botLog.id,
        ipReputation: {
          violations: violationResult.violations,
          isBanned: violationResult.isBanned,
          banMessage: violationResult.banMessage,
        },
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
