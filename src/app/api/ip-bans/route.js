import { NextResponse } from 'next/server'
import {
  getAllBannedIPs,
  getStats,
  clearAllBans,
  getBanInfo,
} from '@/lib/ipReputation'

// GET /api/ip-bans - Get all banned IPs
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'stats') {
      const stats = getStats()
      return NextResponse.json({ success: true, stats })
    }

    const bannedIPs = getAllBannedIPs()

    return NextResponse.json({
      success: true,
      count: bannedIPs.length,
      bannedIPs,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// DELETE /api/ip-bans - Clear all bans (admin only)
export async function DELETE(request) {
  try {
    // TODO: Add admin authentication check here
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    clearAllBans()

    return NextResponse.json({
      success: true,
      message: 'All IP bans have been cleared',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// POST /api/ip-bans/check - Check if specific IP is banned
export async function POST(request) {
  try {
    const { ip } = await request.json()

    if (!ip) {
      return NextResponse.json(
        {
          success: false,
          error: 'IP address is required',
        },
        { status: 400 }
      )
    }

    const banInfo = getBanInfo(ip)

    return NextResponse.json({
      success: true,
      ip,
      ...banInfo,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
