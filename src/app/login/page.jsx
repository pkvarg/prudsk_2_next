'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import useUserStore from './../../store/userStore'
// Optional: You can use these icons or your own
import { PersonFill, LockFill, ExclamationCircleFill } from 'react-bootstrap-icons'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  //const callbackUrl = searchParams.get('callbackUrl') || '/'
  //const callbackUrl = 'http://localhost:3015/auth/github/callback'
  const callbackUrl = 'http://localhost:3015'

  console.log('callburl', callbackUrl)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Get the setUserInfo function from your Zustand store
  const setUserInfo = useUserStore((state) => state.setUserInfo)

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

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        setUserInfo({ name: email })
        router.push(callbackUrl)
      }
    } catch (err) {
      setError('Přihlášení selhalo. Zkuste to znovu.')
    } finally {
      setLoading(false)
    }
  }

  // Handle GitHub login
  const handleGitHubLogin = async () => {
    try {
      const gitHub = await signIn('github', { callbackUrl })
      console.log('ghres', gitHub)
      //setUserInfo({ name: email })
    } catch (err) {
      setError('Přihlášení přes GitHub selhalo. Zkuste to znovu.')
    }
  }

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
            </svg>{' '}
            Přihlásit se přes GitHub
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
