import { NextResponse } from 'next/server'
import prisma from '@/db/db'

const DAY = 24 * 60 * 60 * 1000

// Retention periods published in the privacy policy (/safety-privacy#formulare).
const BOT_LOG_DAYS = 90
const IP_REPUTATION_DAYS = 90

/**
 * Deletes spam-protection records past their published retention period.
 * Intended to be called once a day by a scheduler (n8n). Protected by CRON_TOKEN.
 */
export async function GET(request) {
  const expected = process.env.CRON_TOKEN
  if (!expected) {
    return NextResponse.json({ error: 'Cron not configured' }, { status: 503 })
  }
  const url = new URL(request.url)
  const provided =
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    url.searchParams.get('token') ||
    ''
  if (provided !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = Date.now()
    const olderThan = (days) => new Date(now - days * DAY)

    const [botLogs, ipReputations] = await Promise.all([
      prisma.botLog.deleteMany({ where: { createdAt: { lt: olderThan(BOT_LOG_DAYS) } } }),
      // Permanent bans are kept; expired temporary bans go once the IP has been quiet.
      prisma.iPReputation.deleteMany({
        where: {
          isPermanentBan: false,
          lastSeen: { lt: olderThan(IP_REPUTATION_DAYS) },
          OR: [{ bannedUntil: null }, { bannedUntil: { lt: new Date(now) } }],
        },
      }),
    ])

    return NextResponse.json({
      ok: true,
      deleted: { botLogs: botLogs.count, ipReputations: ipReputations.count },
    })
  } catch (error) {
    console.error('data-retention error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
