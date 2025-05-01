'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import useUserStore from '../../store/userStore'
import {
  PersonFill,
  LockFill,
  EnvelopeFill,
  ExclamationCircleFill,
  CheckCircleFill,
} from 'react-bootstrap-icons'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const redirect = searchParams.get('redirect') || '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  // Get state and actions from Zustand store
  const { register, registerLoading, registerError, registerSuccess, resetRegister } =
    useUserStore()

  // Reset register state when component mounts
  useEffect(() => {
    resetRegister()
  }, [resetRegister])

  // Redirect after successful registration
  useEffect(() => {
    if (registerSuccess) {
      // Redirect after 3 seconds to allow user to see success message
      const timer = setTimeout(() => {
        router.push('/login')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [registerSuccess, router])

  const submitHandler = async (e) => {
    e.preventDefault()

    // Validate form
    if (password !== confirmPassword) {
      setMessage('Hesla se neshodují')
      return
    }

    if (password.length < 6) {
      setMessage('Heslo musí obsahovat alespoň 6 znaků')
      return
    }

    setMessage('')

    try {
      // Call register function from Zustand store
      await register(name, email, password)
    } catch (error) {
      // Error is handled within the store
      console.error('Registration error:', error)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Registrace</h1>
          <p className="text-gray-600">Vytvořte si nový účet Proud Distribution</p>
        </div>

        {/* Success message */}
        {registerSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center">
            <CheckCircleFill className="mr-2 flex-shrink-0" />
            <p className="text-sm">
              Registrace byla úspěšná! Za okamžik budete přesměrováni na přihlášení.
            </p>
          </div>
        )}

        {/* Error message */}
        {(registerError || message) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
            <ExclamationCircleFill className="mr-2 flex-shrink-0" />
            <p className="text-sm">{registerError || message}</p>
          </div>
        )}

        {/* Registration form */}
        <form onSubmit={submitHandler} className="space-y-4 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Jméno
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PersonFill className="text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jméno"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeFill className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
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
                required
                minLength={6}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Potvrdit heslo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockFill className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Potvrdit heslo"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={registerLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              registerLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {registerLoading ? 'Registrace...' : 'Registrovat se'}
          </button>
        </form>

        {/* Login link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Už máte účet?{' '}
            <Link
              href={redirect ? `/login?redirect=${redirect}` : '/login'}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Přihlaste se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
