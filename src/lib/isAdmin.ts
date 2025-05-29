import { auth } from './auth'
import { PrismaClient } from '../../src/prisma/generated/prisma'

const prisma = new PrismaClient()

export default async function isAdmin() {
  const session = await auth()
  const email = session?.user.email

  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      isAdmin: true,
      id: true,
    },
  })

  return user
}
