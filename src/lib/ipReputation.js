// IP Reputation & Ban Management System
// Implements progressive banning with exponential backoff
// Uses MongoDB for persistence with in-memory cache
// Includes subnet-level blocking for bot networks

import prisma from '@/db/db'

// In-memory cache for faster lookups
const ipReputationCache = new Map()
const subnetReputationCache = new Map()
const CACHE_TTL = 60 * 1000 // 1 minute cache

// Ban durations in milliseconds
const BAN_DURATIONS = {
  FIRST: 24 * 60 * 60 * 1000, // 24 hours - First offense gets banned
  SECOND: Infinity, // Permanent ban - Second offense is permanent
}

// Subnet blocking threshold
const SUBNET_BLOCK_THRESHOLD = 2 // Block entire subnet when 2 IPs from it are detected

/**
 * Extract /24 subnet from IP address
 * @param {string} ip - IP address (e.g., "185.220.101.139")
 * @returns {string} Subnet in CIDR notation (e.g., "185.220.101.0/24")
 */
function getSubnet(ip) {
  const parts = ip.split('.')
  if (parts.length !== 4) return null
  return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`
}

/**
 * Check if IP is in a subnet
 * @param {string} ip - IP address
 * @param {string} subnet - Subnet in CIDR notation (e.g., "185.220.101.0/24")
 * @returns {boolean}
 */
function isIPInSubnet(ip, subnet) {
  const subnetBase = subnet.split('/')[0].split('.').slice(0, 3).join('.')
  const ipBase = ip.split('.').slice(0, 3).join('.')
  return ipBase === subnetBase
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

  // Check if subnet should be banned
  const subnetBan = await checkAndBanSubnet(ip)

  return {
    ...updatedReputation,
    banMessage,
    isBanned: await isIPBanned(ip),
    subnetBanned: subnetBan !== null,
    subnet: subnetBan ? subnetBan.subnet : null,
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

  const allSubnets = await prisma.subnetReputation.findMany()
  const bannedSubnets = await getAllBannedSubnets()

  return {
    totalIPs: allReputations.length,
    bannedIPs: bannedIPs.length,
    permanentBans: permanent,
    temporaryBans: bannedIPs.length - permanent,
    totalSubnets: allSubnets.length,
    bannedSubnets: bannedSubnets.length,
    permanentSubnetBans: allSubnets.filter((s) => s.isPermanentBan).length,
  }
}

// ============================================
// SUBNET-LEVEL BLOCKING FUNCTIONS
// ============================================

/**
 * Get subnet reputation data from database
 * @param {string} subnet - Subnet in CIDR notation
 * @returns {Promise<object|null>} Subnet reputation data
 */
export async function getSubnetReputation(subnet) {
  if (!subnet) return null

  // Check cache first
  const cached = subnetReputationCache.get(subnet)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  // Get from database
  const reputation = await prisma.subnetReputation.findUnique({
    where: { subnet },
  })

  if (reputation) {
    // Update cache
    subnetReputationCache.set(subnet, {
      data: reputation,
      timestamp: Date.now(),
    })
  }

  return reputation
}

/**
 * Check if IP's subnet is banned
 * @param {string} ip - IP address
 * @returns {Promise<boolean>} True if subnet is banned
 */
export async function isSubnetBanned(ip) {
  const subnet = getSubnet(ip)
  if (!subnet) return false

  const reputation = await getSubnetReputation(subnet)
  if (!reputation) return false

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
    await prisma.subnetReputation.update({
      where: { subnet },
      data: { bannedUntil: null },
    })
    subnetReputationCache.delete(subnet)
  }

  return false
}

/**
 * Check if subnet should be banned based on IP violations
 * Creates or updates subnet ban when threshold is reached
 * @param {string} ip - IP address that just got a violation
 * @returns {Promise<object|null>} Subnet reputation if subnet was banned, null otherwise
 */
export async function checkAndBanSubnet(ip) {
  const subnet = getSubnet(ip)
  if (!subnet) return null

  // Get all IPs from this subnet that have violations
  const allIPsInDB = await prisma.iPReputation.findMany()
  const ipsInSubnet = allIPsInDB.filter((rep) => isIPInSubnet(rep.ipAddress, subnet))

  // Check if we've reached the threshold (2 IPs)
  if (ipsInSubnet.length < SUBNET_BLOCK_THRESHOLD) {
    return null
  }

  console.log(`🚨 SUBNET THRESHOLD REACHED: ${subnet} has ${ipsInSubnet.length} violating IPs`)

  // Check if ANY of the IPs already existed in the database before this session
  // For simplicity, we check if any IP has more than 0 violations (meaning it existed before)
  const hasExistingIP = ipsInSubnet.some((rep) => rep.violations > 0)

  // Get or create subnet reputation
  let subnetRep = await getSubnetReputation(subnet)

  if (!subnetRep) {
    // Create new subnet reputation
    const violatingIPs = ipsInSubnet.map((rep) => rep.ipAddress)

    // Determine ban duration: immediate permanent if any IP already existed
    let bannedUntil
    let isPermanentBan = false
    let banMessage = ''

    if (hasExistingIP) {
      // IMMEDIATE PERMANENT BAN - Known bot network
      bannedUntil = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000)
      isPermanentBan = true
      banMessage = `SUBNET IMMEDIATELY PERMANENTLY BANNED: Known bot IPs detected in ${subnet}`
    } else {
      // First offense - 24 hour ban
      bannedUntil = new Date(Date.now() + BAN_DURATIONS.FIRST)
      banMessage = `Subnet ${subnet} banned for 24 hours (1st offense)`
    }

    subnetRep = await prisma.subnetReputation.create({
      data: {
        subnet,
        violatingIPs,
        violations: 1,
        bannedUntil,
        isPermanentBan,
        detectionHistory: [
          {
            type: 'subnet-threshold',
            details: `${ipsInSubnet.length} IPs detected from subnet`,
            timestamp: Date.now(),
            ips: violatingIPs,
          },
        ],
      },
    })

    console.log(`⛔ ${banMessage}`)
    console.log(`   Violating IPs: ${violatingIPs.join(', ')}`)
  } else {
    // Update existing subnet reputation
    const newViolations = subnetRep.violations + 1
    const violatingIPs = [...new Set([...subnetRep.violatingIPs, ...ipsInSubnet.map((r) => r.ipAddress)])]

    const detectionHistory = Array.isArray(subnetRep.detectionHistory) ? subnetRep.detectionHistory : []
    detectionHistory.push({
      type: 'subnet-violation',
      details: `Additional violations detected, total: ${newViolations}`,
      timestamp: Date.now(),
      ips: violatingIPs,
    })

    // Second+ offense - PERMANENT BAN
    const bannedUntil = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000)
    const isPermanentBan = true

    subnetRep = await prisma.subnetReputation.update({
      where: { subnet },
      data: {
        violations: newViolations,
        violatingIPs,
        bannedUntil,
        isPermanentBan,
        detectionHistory,
      },
    })

    console.log(`⛔ SUBNET PERMANENTLY BANNED: ${subnet} (2nd+ offense)`)
    console.log(`   Total violating IPs: ${violatingIPs.length}`)
  }

  // Clear cache
  subnetReputationCache.delete(subnet)

  return subnetRep
}

/**
 * Get ban information for a subnet
 * @param {string} subnet - Subnet in CIDR notation
 * @returns {Promise<object>} Subnet ban info
 */
export async function getSubnetBanInfo(subnet) {
  const reputation = await getSubnetReputation(subnet)
  const isBanned = await isSubnetBanned(subnet.replace('/24', '.0/24'))

  if (!isBanned || !reputation) {
    return {
      isBanned: false,
      message: 'Subnet not banned',
    }
  }

  if (reputation.isPermanentBan) {
    return {
      isBanned: true,
      isPermanent: true,
      message: `Subnet ${subnet} permanently banned (${reputation.violatingIPs.length} IPs from this subnet)`,
      violations: reputation.violations,
      violatingIPs: reputation.violatingIPs,
    }
  }

  const remainingTime = new Date(reputation.bannedUntil) - new Date()
  const remainingHours = Math.ceil(remainingTime / 3600000)

  return {
    isBanned: true,
    isPermanent: false,
    bannedUntil: new Date(reputation.bannedUntil).toISOString(),
    message: `Subnet ${subnet} temporarily banned for ${remainingHours} more hours`,
    violations: reputation.violations,
    violatingIPs: reputation.violatingIPs,
  }
}

/**
 * Get all banned subnets
 * @returns {Promise<array>} List of banned subnets
 */
export async function getAllBannedSubnets() {
  const allSubnets = await prisma.subnetReputation.findMany()
  const banned = []

  for (const reputation of allSubnets) {
    const isBanned =
      reputation.isPermanentBan ||
      (reputation.bannedUntil && new Date() < new Date(reputation.bannedUntil))

    if (isBanned) {
      const banInfo = await getSubnetBanInfo(reputation.subnet)
      banned.push({
        subnet: reputation.subnet,
        ...banInfo,
        ipCount: reputation.violatingIPs.length,
        firstSeen: reputation.firstSeen.toISOString(),
        lastSeen: reputation.lastSeen.toISOString(),
      })
    }
  }

  return banned
}
