// import NextAuth from 'next-auth'
// import GitHubProvider from 'next-auth/providers/github'
// import GoogleProvider from 'next-auth/providers/google'

// import Credentials from 'next-auth/providers/credentials'

// export const { auth, handlers, signIn, signOut } = NextAuth({
//   //providers: [GitHub],
//   providers: [
//     GitHubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       authorization: {
//         params: {
//           scope: 'read:user user:email', // crucial for email access
//         },
//       },
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     Credentials({
//       name: 'Credentials',
//       credentials: {
//         //username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
//         email: { label: 'Email', type: 'text', placeholder: 'jsmith@yahoo.com' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         // move encrypted password to .env
//         const users = [
//           {
//             id: 'test-user-1',
//             userName: 'test1',
//             name: 'Test 1',
//             password: 'pass',
//             email: process.env.ADMIN_EMAIL,
//           },
//           {
//             id: 'test-user-2',
//             userName: 'test2',
//             name: 'Test 2',
//             password: 'pass',
//             email: 'test2@donotreply.com',
//           },
//         ]
//         const user = users.find(
//           (user) => user.email === credentials.email && user.password === credentials.password,
//         )
//         return user ? { id: user.id, name: user.name, email: user.email } : null
//       },
//     }),
//   ],

//   secret: process.env.NEXTAUTH_SECRET,
// })

// auth.js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        // Include any other user data you want to pass to the client

        if (account) {
          token.provider = account.provider
        }
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.user.id = token.id
      session.user.role = token.role

      // Add JWT token to user object for API authentication
      session.user.token = token.id

      return session
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'jsmith@yahoo.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        // ONLY allow this if you're confident this path is called AFTER validation
        if (!credentials.email) return null

        // Optionally: decode extra fields if passed in credentials
        return {
          id: credentials.id,
          name: credentials.name,
          email: credentials.email,
          role: credentials.role,
        }
      },
    }),
  ],
})

// Export middleware to protect routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
