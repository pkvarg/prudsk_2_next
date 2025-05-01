'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import FormContainer from '@/components/FormContainer'
import Loader from '@/components/Loader'
import Message from '@/components/Message'
import { forgotPassword, resetForgotPassword } from '@/store/slices/userSlice'

const ForgotPasswordPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const dispatch = useDispatch()
  const {
    forgotPasswordLoading: loading,
    forgotPasswordError: error,
    forgotPasswordSuccess: success,
  } = useSelector((state) => state.user)

  useEffect(() => {
    // Reset state when component mounts
    return () => {
      dispatch(resetForgotPassword())
    }
  }, [dispatch])

  useEffect(() => {
    // Show success message when API call succeeds
    if (success) {
      setSuccessMessage('Email s instrukcemi pro obnovu hesla byl odeslán, pokud účet existuje.')
      setEmail('')
    }
  }, [success])

  const submitHandler = async (e) => {
    e.preventDefault()

    // Get origin URL for email link
    const origURL = typeof window !== 'undefined' ? window.location.origin : ''

    dispatch(forgotPassword({ email, origURL }))
  }

  return (
    <FormContainer>
      <h1 className="text-2xl font-bold mb-6">Zapomenuté heslo</h1>

      {error && <Message variant="danger">{error}</Message>}
      {successMessage && <Message variant="success">{successMessage}</Message>}
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
            required
          />
        </div>

        <button
          type="submit"
          className="w-full my-5 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-200"
          disabled={loading}
        >
          Odeslat odkaz pro obnovu
        </button>
      </form>

      <div className="mt-4 flex justify-between items-center">
        <Link
          href={redirect ? `/login?redirect=${redirect}` : '/login'}
          className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
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
  )
}

export default ForgotPasswordPage
