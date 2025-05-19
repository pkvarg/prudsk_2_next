// src/db/db.js
import { PrismaClient } from '../prisma/generated/prisma'

const db = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

export default db
