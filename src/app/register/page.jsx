'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import useUserStore from '../../store/userStore'
import {
  PersonFill,
  LockFill,
  EnvelopeFill,
  ExclamationCircleFill,
  CheckCircleFill,
} from 'react-bootstrap-icons'

// Loading component
function PageLoader() {
  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  )
}

// Main register form component
function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const redirect = searchParams.get('redirect') || '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  // Bot protection states
  const [honeypot, setHoneypot] = useState('')
  const [formStartTime, setFormStartTime] = useState(0)

  // Get state and actions from Zustand store
  const { register, registerLoading, registerError, registerSuccess, resetRegister } =
    useUserStore()

  // Reset register state when component mounts
  useEffect(() => {
    resetRegister()
  }, [resetRegister])

  // Initialize form start time for time-based validation
  useEffect(() => {
    setFormStartTime(Date.now())
  }, [])

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

  // AVOID REGISTERING HERE WITH GOOGLE EMAIL
  useEffect(() => {
    if (email.includes('@gmail.com')) {
      setMessage(`Pre ${email} prosím použite možnosť Prihlásiť sa cez Google`)
      return
    }
  }, [email])

  // Bot protection: Content validation function
  const isSpamContent = (text) => {
    if (!text || text.trim().length < 3) return true

    // Check 1: Excessive special characters (more than 40% of content)
    const specialChars = text.match(/[^a-zA-Z0-9\s]/g) || []
    if (specialChars.length / text.length > 0.4) return true

    // Check 2: Random character patterns (less than 20% vowels)
    const vowels = text.match(/[aeiouAEIOUáéíóúýäëïöüÁÉÍÓÚÝ]/g) || []
    if (vowels.length / text.length < 0.2) return true

    // Check 3: Excessive uppercase (more than 50% uppercase letters)
    const uppercase = text.match(/[A-Z]/g) || []
    const letters = text.match(/[a-zA-Z]/g) || []
    if (letters && letters.length > 0 && uppercase.length / letters.length > 0.5) return true

    // Check 4: Repetitive characters (same char 5+ times in a row)
    if (/(.)\1{4,}/.test(text)) return true

    return false
  }

  // Bot protection: Rate limiting
  const checkRateLimit = () => {
    const storageKey = 'register_form_submissions'
    const now = Date.now()
    const oneHour = 60 * 60 * 1000 // 1 hour in milliseconds
    const maxSubmissions = 3

    try {
      const stored = localStorage.getItem(storageKey)
      const submissions = stored ? JSON.parse(stored) : []

      // Filter out submissions older than 1 hour
      const recentSubmissions = submissions.filter((time) => now - time < oneHour)

      if (recentSubmissions.length >= maxSubmissions) {
        return false // Rate limit exceeded
      }

      // Add current submission and save
      recentSubmissions.push(now)
      localStorage.setItem(storageKey, JSON.stringify(recentSubmissions))
      return true
    } catch (error) {
      console.error('Rate limit check error:', error)
      return true // If localStorage fails, allow submission
    }
  }

  // Bot protection: Log bot attempts
  const logBotAttempt = async (detectionType, detectionDetails, timeSpent) => {
    try {
      await fetch('/api/bot-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password: '[REDACTED]',
          honeypot,
          detectionType,
          detectionDetails,
          locale: 'sk',
          origin: 'PRUDSK2NEXT_REGISTER',
          timeSpent,
        }),
      })
    } catch (error) {
      console.error('Error logging bot attempt:', error)
    }
  }

  // Bot protection: Increase bots counter
  const increaseBots = async () => {
    const apiUrl = 'https://hono-api.pictusweb.com/api/bots/prudsk2next/increase'
    try {
      await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Error increasing bots:', error)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    const timeSpent = Date.now() - formStartTime

    // Bot Check 1: Honeypot field
    if (honeypot !== '') {
      await logBotAttempt(
        'honeypot',
        `Honeypot field filled with value: "${honeypot}"`,
        timeSpent
      )
      setMessage('Registrácia sa nepodarila. Skúste to prosím neskôr.')
      increaseBots()
      return
    }

    // Bot Check 2: Time-based validation (minimum 3 seconds)
    if (timeSpent < 3000) {
      await logBotAttempt(
        'time-based',
        `Form submitted too quickly: ${timeSpent}ms (minimum: 3000ms)`,
        timeSpent
      )
      setMessage('Registrácia sa nepodarila. Skúste to prosím neskôr.')
      increaseBots()
      return
    }

    // Bot Check 3: Content validation (name field)
    if (isSpamContent(name)) {
      await logBotAttempt('content-validation', 'Spam content detected in name field', timeSpent)
      setMessage('Neplatné meno. Použite prosím bežné znaky.')
      increaseBots()
      return
    }

    // Bot Check 4: Rate limiting
    if (!checkRateLimit()) {
      await logBotAttempt(
        'rate-limit',
        'Rate limit exceeded: More than 3 submissions in 1 hour',
        timeSpent
      )
      setMessage('Príliš veľa pokusov. Skúste to prosím neskôr.')
      return
    }

    // Validate form
    if (password !== confirmPassword) {
      setMessage('Heslá sa nezhodujú')
      return
    }

    if (password.length < 6) {
      setMessage('Heslo musí obsahovať najmenej 6 znakov')
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Registrácia</h1>
          <p className="text-gray-600">Vytvorte si nový účet Prúd</p>
        </div>

        {/* Success message */}
        {registerSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center">
            <CheckCircleFill className="mr-2 flex-shrink-0" />
            <p className="text-sm">
              Registrácia bola úspešná! O chvíľu budete presmerovaný na prihlásenie.
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
              Meno
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
                placeholder="Meno"
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
              Potvrdiť heslo
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
                placeholder="Potvrdiť heslo"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Honeypot field - hidden from users, only bots fill this */}
          <div
            style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
            aria-hidden="true"
          >
            <label htmlFor="website_url">Website</label>
            <input
              type="text"
              id="website_url"
              name="website_url"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={registerLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2bb2e6] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              registerLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {registerLoading ? 'Registrácia...' : 'Registrovať sa'}
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
              Prihláste sa
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function RegisterPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RegisterForm />
    </Suspense>
  )
}
