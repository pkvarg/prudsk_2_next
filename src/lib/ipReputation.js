// IP Reputation & Ban Management System
// Implements progressive banning with exponential backoff
// Uses MongoDB for persistence with in-memory cache

import prisma from '@/db/db'

// In-memory cache for faster lookups
const ipReputationCache = new Map()
const CACHE_TTL = 60 * 1000 // 1 minute cache

// Ban durations in milliseconds
const BAN_DURATIONS = {
  FIRST: 24 * 60 * 60 * 1000, // 24 hours - First offense gets banned
  SECOND: Infinity, // Permanent ban - Second offense is permanent
}

/**
 * Get IP reputation data from database
 * @param {string} ip - IP address
 * @returns {Promise<object>} Reputation data
 */
export async function getIPReputation(ip) {
  // Check cache first
  const cached = ipReputationCache.get(ip)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  // Get from database
  let reputation = await prisma.iPReputation.findUnique({
    where: { ipAddress: ip },
  })

  // Create new reputation if not exists
  if (!reputation) {
    reputation = await prisma.iPReputation.create({
      data: {
        ipAddress: ip,
        violations: 0,
        detectionHistory: [],
      },
    })
  }

  // Update cache
  ipReputationCache.set(ip, {
    data: reputation,
    timestamp: Date.now(),
  })

  return reputation
}

/**
 * Record a bot violation from an IP
 * @param {string} ip - IP address
 * @param {string} detectionType - Type of bot detection
 * @param {string} detectionDetails - Details about the violation
 * @returns {Promise<object>} Updated reputation with ban status
 */
export async function recordViolation(ip, detectionType, detectionDetails) {
  const reputation = await getIPReputation(ip)

  const newViolations = reputation.violations + 1
  const detectionHistory = Array.isArray(reputation.detectionHistory)
    ? reputation.detectionHistory
    : []

  detectionHistory.push({
    type: detectionType,
    details: detectionDetails,
    timestamp: Date.now(),
  })

  // Calculate ban duration based on violation count
  let bannedUntil = null
  let isPermanentBan = false
  let banMessage = ''

  switch (newViolations) {
    case 1:
      // First violation - 24 hour ban
      bannedUntil = new Date(Date.now() + BAN_DURATIONS.FIRST)
      banMessage = '1st offense: Banned for 24 hours'
      break

    default:
      // Second+ violation - PERMANENT BAN
      bannedUntil = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000) // 100 years (effective permanent)
      isPermanentBan = true
      banMessage = '2nd+ offense: PERMANENT BAN'
      break
  }

  // Update database
  const updatedReputation = await prisma.iPReputation.update({
    where: { ipAddress: ip },
    data: {
      violations: newViolations,
      bannedUntil,
      isPermanentBan,
      detectionHistory,
    },
  })

  // Clear cache for this IP
  ipReputationCache.delete(ip)

  console.log(`🚨 IP VIOLATION RECORDED:`, {
    ip,
    violations: newViolations,
    detectionType,
    banMessage,
    bannedUntil: bannedUntil ? bannedUntil.toISOString() : 'Not banned',
  })

  return {
    ...updatedReputation,
    banMessage,
    isBanned: await isIPBanned(ip),
  }
}

/**
 * Check if an IP is currently banned
 * @param {string} ip - IP address
 * @returns {Promise<boolean>} True if banned
 */
export async function isIPBanned(ip) {
  const reputation = await getIPReputation(ip)

  // Check permanent ban
  if (reputation.isPermanentBan) {
    return true
  }

  // Check temporary ban
  if (reputation.bannedUntil && new Date() < new Date(reputation.bannedUntil)) {
    return true
  }

  // Ban expired, clear it
  if (reputation.bannedUntil && new Date() >= new Date(reputation.bannedUntil)) {
    await prisma.iPReputation.update({
      where: { ipAddress: ip },
      data: { bannedUntil: null },
    })
    ipReputationCache.delete(ip)
  }

  return false
}

/**
 * Get ban information for an IP
 * @param {string} ip - IP address
 * @returns {Promise<object>} Ban info
 */
export async function getBanInfo(ip) {
  const reputation = await getIPReputation(ip)
  const isBanned = await isIPBanned(ip)

  if (!isBanned) {
    return {
      isBanned: false,
      message: 'Not banned',
    }
  }

  if (reputation.isPermanentBan) {
    return {
      isBanned: true,
      isPermanent: true,
      message: 'Permanently banned due to repeated violations',
      violations: reputation.violations,
    }
  }

  const remainingTime = new Date(reputation.bannedUntil) - new Date()
  const remainingMinutes = Math.ceil(remainingTime / 60000)
  const remainingHours = Math.ceil(remainingTime / 3600000)

  return {
    isBanned: true,
    isPermanent: false,
    bannedUntil: new Date(reputation.bannedUntil).toISOString(),
    remainingTime,
    message:
      remainingMinutes < 60
        ? `Temporarily banned for ${remainingMinutes} more minutes`
        : `Temporarily banned for ${remainingHours} more hours`,
    violations: reputation.violations,
  }
}

/**
 * Clear all bans (admin function)
 */
export async function clearAllBans() {
  await prisma.iPReputation.deleteMany({})
  ipReputationCache.clear()
  console.log('✅ All IP bans cleared from database')
}

/**
 * Get all banned IPs (admin function)
 * @returns {Promise<array>} List of banned IPs
 */
export async function getAllBannedIPs() {
  const allReputations = await prisma.iPReputation.findMany()
  const banned = []

  for (const reputation of allReputations) {
    const isBanned =
      reputation.isPermanentBan ||
      (reputation.bannedUntil && new Date() < new Date(reputation.bannedUntil))

    if (isBanned) {
      const banInfo = await getBanInfo(reputation.ipAddress)
      banned.push({
        ip: reputation.ipAddress,
        ...banInfo,
        violations: reputation.violations,
        firstSeen: reputation.firstSeen.toISOString(),
        lastSeen: reputation.lastSeen.toISOString(),
      })
    }
  }

  return banned
}

/**
 * Get IP reputation statistics
 * @returns {Promise<object>} Statistics
 */
export async function getStats() {
  const allReputations = await prisma.iPReputation.findMany()
  const bannedIPs = await getAllBannedIPs()
  const permanent = allReputations.filter((r) => r.isPermanentBan).length

  return {
    totalIPs: allReputations.length,
    bannedIPs: bannedIPs.length,
    permanentBans: permanent,
    temporaryBans: bannedIPs.length - permanent,
  }
}
