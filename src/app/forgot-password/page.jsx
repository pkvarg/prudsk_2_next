'use client'

import { useState, useLayoutEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import FormContainer from '@/app/components/FormContainer'
import Loader from '@/app/components/Loader'
import Message from '@/app/components/Message'
import useUserStore from '@/store/userStore'

// Extract the component that uses useSearchParams
function ForgotPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Access Zustand store state and actions
  const { forgotPassword } = useUserStore()
  const forgotPasswordState = useUserStore((state) => state.forgotPassword || {})
  const { loading, error } = forgotPasswordState

  const submitHandler = async (e) => {
    e.preventDefault()

    // Email validation like in original
    if (!email) {
      setMessage('Musíte zadat stávající email')
      return
    }

    setMessage(null) // Clear any previous error messages

    // Get origin URL for email link
    const origURL = typeof window !== 'undefined' ? window.location.origin : ''

    try {
      await forgotPassword({ email, origURL })
      setSuccessMessage('Linka byla odeslána na Váš email')
    } catch (err) {
      // Error is handled by Zustand store
    }
  }

  // Scroll to page top on mount like in original
  useLayoutEffect(() => {
    window.scrollTo(0, 200)
  }, [])

  return (
    <section className="mt-8">
      <FormContainer>
        <h1 className="text-2xl font-bold mb-6">Zapomenuté heslo</h1>

        {message && <Message variant="danger">{message}</Message>}
        {successMessage && <Message variant="success">{successMessage}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}

        <p className="mb-4 text-gray-600">
          Zadejte svůj email a my vám pošleme odkaz pro obnovení hesla.
        </p>

        <form onSubmit={submitHandler} className="w-full">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Váš e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full my-5 bg-[#2bb2e6] hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-200"
            disabled={loading}
          >
            Poslat link pro obnovu hesla
          </button>
        </form>

        <div className="mt-4 flex justify-between items-center">
          <Link
            href={redirect ? `/login?redirect=${redirect}` : '/login'}
            className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
          >
            Zpět na přihlášení
          </Link>

          <Link
            href={redirect ? `/register?redirect=${redirect}` : '/register'}
            className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
          >
            Registrovat se
          </Link>
        </div>
      </FormContainer>
    </section>
  )
}

// Main component with Suspense boundary
const ForgotPasswordPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ForgotPasswordForm />
    </Suspense>
  )
}

export default ForgotPasswordPage
