// src/db/db.js
import { PrismaClient } from '@/prisma/generated/prisma'

// const prisma = new PrismaClient({
//   log: ['query', 'info', 'warn', 'error'],
// })
const prisma = new PrismaClient({})

export default prisma
