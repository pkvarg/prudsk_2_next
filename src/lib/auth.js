import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

import Credentials from 'next-auth/providers/credentials'

export const { auth, handlers, signIn, signOut } = NextAuth({
  //providers: [GitHub],
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user user:email', // crucial for email access
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        //username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        email: { label: 'Email', type: 'text', placeholder: 'jsmith@yahoo.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // move encrypted password to .env
        const users = [
          {
            id: 'test-user-1',
            userName: 'test1',
            name: 'Test 1',
            password: 'pass',
            email: process.env.ADMIN_EMAIL,
          },
          {
            id: 'test-user-2',
            userName: 'test2',
            name: 'Test 2',
            password: 'pass',
            email: 'test2@donotreply.com',
          },
        ]
        const user = users.find(
          (user) => user.email === credentials.email && user.password === credentials.password,
        )
        return user ? { id: user.id, name: user.name, email: user.email } : null
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Optional: log or inspect `profile`
      return true
    },
    async jwt({ token, user, account, profile }) {
      if (account && profile) {
        token.email = profile.email
      }
      return token
    },
    async session({ session, token, user }) {
      if (token?.email) {
        session.user.email = token.email
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})
