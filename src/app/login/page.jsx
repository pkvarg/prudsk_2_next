'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import useUserStore from './../../store/userStore'
import { PersonFill, LockFill, ExclamationCircleFill } from 'react-bootstrap-icons'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  //const callbackUrl = searchParams.get('callbackUrl') || '/'
  //const callbackUrl = 'http://localhost:3015/auth/github/callback'
  const callbackUrl = 'http://localhost:3015'

  //console.log('callburl', callbackUrl)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Get the setUserInfo function from your Zustand store
  const setUserInfo = useUserStore((state) => state.setUserInfo)

  const { data: session } = useSession()

  // Handle credentials login
  const handleCredentialsLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Prosím, vyplňte email a heslo')
      return
    }

    try {
      setLoading(true)
      setError('')

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Show custom error message from backend
        setError(data.message || 'Přihlášení selhalo')
        return
      }

      //console.log('data', data)

      setUserInfo({
        email: data.email,
        id: data.id,
        name: data.name,
        role: data.isAdmin ? 'admin' : 'user',
      })

      // At this point, you got what you needed
      // Manually trigger session creation
      await signIn('credentials', {
        redirect: false,
        email: data.email,
        id: data.id,
        name: data.name,
        role: data.isAdmin ? 'admin' : 'user',
      })

      router.push(callbackUrl)
    } catch (err) {
      setError('Přihlášení selhalo. Zkuste to znovu.')
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    try {
      await signIn('github', { callbackUrl }) // or your dashboard URL
    } catch (err) {
      setError('Přihlášení přes GitHub selhalo. Zkuste to znovu.')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signIn('google', { callbackUrl })
    } catch (err) {
      setError('Přihlášení přes Google selhalo. Zkuste to znovu.')
    }
  }

  // useEffect(() => {
  //   if (session?.user?.email) {
  //     console.log('User email:', session.user.email)
  //     setUserInfo({ name: session.user.email }) // Or whatever state you want to update
  //   }
  // }, [session])

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Přihlášení</h1>
          <p className="text-gray-600">Přihlaste se ke svému účtu Proud Distribution</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
            <ExclamationCircleFill className="mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Credentials form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PersonFill className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Heslo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockFill className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Heslo"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Zapamatovat
              </label>
            </div>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Zapomenuté heslo?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Přihlašování...' : 'Přihlásit se'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">nebo pokračujte s</span>
          </div>
        </div>

        {/* Social login buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 48 48"
              className="mr-2"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.74 1.22 9.26 3.22l6.9-6.9C35.78 2.01 30.2 0 24 0 14.64 0 6.65 5.67 2.92 13.74l8.02 6.23C13.3 13.26 18.26 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.15 24.54c0-1.53-.14-3.01-.4-4.45H24v8.43h12.4c-.54 2.9-2.1 5.37-4.5 7.06l7.05 5.46C42.63 37.21 46.15 31.34 46.15 24.54z"
              />
              <path
                fill="#FBBC05"
                d="M10.94 28.12a14.57 14.57 0 0 1-.76-4.62c0-1.6.27-3.15.76-4.62l-8.02-6.23A23.93 23.93 0 0 0 0 23.5c0 3.83.91 7.45 2.53 10.62l8.41-6z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.2 0 11.4-2.03 15.2-5.52l-7.05-5.46c-2.06 1.38-4.71 2.18-8.15 2.18-5.74 0-10.7-3.76-12.57-8.97l-8.41 6C6.65 42.33 14.64 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Přihlásit se přes Google
          </button>
          <button
            type="button"
            onClick={handleGitHubLogin}
            className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-github"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
            <span className="ml-1">Přihlásit se přes GitHub</span>
          </button>
        </div>

        {/* Registration link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Nemáte účet?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Zaregistrujte se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
