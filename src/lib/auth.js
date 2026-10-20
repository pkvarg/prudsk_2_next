// auth.js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import prisma from '@/db/db'
import authConfig from './auth.config'

export const authOptions = {
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // The session is created only after the password is checked here. Identity and role come
      // from the database, never from what the browser sends.
      async authorize(credentials) {
        const email = String(credentials?.email || '').trim()
        const password = String(credentials?.password || '')
        if (!email || !password) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user?.password || !user.isRegistered) return null
        if (!(await bcrypt.compare(password, user.password))) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.isAdmin ? 'admin' : 'user',
        }
      },
    }),
  ],
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
