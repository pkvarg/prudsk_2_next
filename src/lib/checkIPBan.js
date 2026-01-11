// Server-side IP ban checker
// This runs in Node.js runtime (not edge), so it can access Prisma/MongoDB
// Checks both subnet-level and individual IP bans

import { isIPBanned, getBanInfo, isSubnetBanned, getSubnetBanInfo } from './ipReputation'

/**
 * Check if request IP is banned (checks subnet first, then individual IP)
 * Use this in API routes and server components
 */
export async function checkIPBan(request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'

  // PRIORITY 1: Check if IP's subnet is banned (blocks entire /24 range)
  const subnetBanned = await isSubnetBanned(ip)
  if (subnetBanned) {
    const subnet = ip.split('.').slice(0, 3).join('.') + '.0/24'
    const subnetBanInfo = await getSubnetBanInfo(subnet)
    console.log(`🚫 BLOCKED REQUEST from banned SUBNET: ${subnet} (IP: ${ip})`, subnetBanInfo)
    return {
      isBanned: true,
      ip,
      banInfo: {
        ...subnetBanInfo,
        banType: 'subnet',
        subnet,
      },
    }
  }

  // PRIORITY 2: Check if individual IP is banned
  const ipBanned = await isIPBanned(ip)
  if (ipBanned) {
    const banInfo = await getBanInfo(ip)
    console.log(`🚫 BLOCKED REQUEST from banned IP: ${ip}`, banInfo)
    return {
      isBanned: true,
      ip,
      banInfo: {
        ...banInfo,
        banType: 'ip',
      },
    }
  }

  return {
    isBanned: false,
    ip,
  }
}
