// src/db/db.js
import { PrismaClient } from '../prisma/generated/prisma'

const db = new PrismaClient()

export default db
