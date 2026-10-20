// auth.config.js
// Edge-safe part of the Auth.js setup (no database), used by middleware to read the session.
// The providers that need the database are added in auth.js.
const authConfig = {
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
  providers: [],
}

export default authConfig
