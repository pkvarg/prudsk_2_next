// hooks/useAuth.js
'use client'

import { signIn, signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import useUserStore from '@/store/userStore'

/**
 * Simple hook that provides authentication methods using NextAuth
 */
export function useAuth() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { setLoading, setError } = useUserStore()

  // Login with credentials
  const login = async (email, password) => {
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError(result.error)
        setLoading(false)
        return false
      }

      setLoading(false)
      return true
    } catch (error) {
      setError(error.message)
      setLoading(false)
      return false
    }
  }

  // Google login
  const googleLogin = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      setError(error.message)
    }
  }

  // Logout
  const logout = async () => {
    try {
      await signOut({ redirect: false })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Helper functions
  const isAuthenticated = status === 'authenticated' && !!session?.user
  const isAdmin = isAuthenticated && session?.user?.role === 'admin'

  return {
    user: session?.user,
    status,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    googleLogin,
  }
}

export default useAuth
