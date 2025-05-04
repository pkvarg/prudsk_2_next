// // auth.js
// import NextAuth from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import GoogleProvider from 'next-auth/providers/google'

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   session: {
//     strategy: 'jwt',
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   pages: {
//     signIn: '/login',
//     error: '/error',
//   },
//   callbacks: {
//     async jwt({ token, user, account }) {
//       // Initial sign in
//       if (user) {
//         token.id = user.id
//         token.email = user.email
//         token.name = user.name
//         token.role = user.role
//         // Include any other user data you want to pass to the client

//         if (account) {
//           token.provider = account.provider
//         }
//       }
//       return token
//     },
//     async session({ session, token }) {
//       // Send properties to the client
//       session.user.id = token.id
//       session.user.role = token.role

//       // Add JWT token to user object for API authentication
//       session.user.token = token.id

//       return session
//     },
//   },
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: {
//           label: 'Email',
//           type: 'text',
//           placeholder: 'jsmith@yahoo.com',
//         },
//         password: {
//           label: 'Password',
//           type: 'password',
//         },
//       },
//       async authorize(credentials) {
//         // ONLY allow this if you're confident this path is called AFTER validation
//         if (!credentials.email) return null

//         // Optionally: decode extra fields if passed in credentials
//         return {
//           id: credentials.id,
//           name: credentials.name,
//           email: credentials.email,
//           role: credentials.role,
//         }
//       },
//     }),
//   ],
// })

// // Export middleware to protect routes
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// }

// auth.js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

// Export authOptions separately
export const authOptions = {
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
}

// Initialize NextAuth with authOptions
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)

// Export middleware to protect routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
