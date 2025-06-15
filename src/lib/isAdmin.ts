import { auth } from './auth'
import prisma from '@/db/db'

export default async function isAdmin() {
  const session = await auth()
  const email = session?.user.email

  console.log('in isAdmin', email)

  const user = await prisma.user.findFirst({
    where: { email: email },
    select: {
      isAdmin: true,
      id: true,
      name: true,
    },
  })

  return user
}
