'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FormContainer from '@/components/FormContainer'
import Loader from '@/components/Loader'
import Message from '@/components/Message'

const ResetPasswordPage = ({ params }) => {
  const router = useRouter()
  const { token } = params

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const validatePassword = () => {
    if (password.length < 6) {
      setError('Heslo musí obsahovat alespoň 6 znaků')
      return false
    }

    if (password !== confirmPassword) {
      setError('Hesla se neshodují')
      return false
    }

    return true
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    // Clear previous messages
    setError('')
    setSuccessMessage('')

    // Validate passwords
    if (!validatePassword()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Došlo k chybě při obnově hesla')
      }

      setSuccessMessage('Heslo bylo úspěšně změněno. Za chvíli budete přesměrováni na přihlášení.')

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormContainer>
      <h1 className="text-2xl font-bold mb-6">Obnovení hesla</h1>

      {error && <Message variant="danger">{error}</Message>}
      {successMessage && <Message variant="success">{successMessage}</Message>}
      {loading && <Loader />}

      <form onSubmit={submitHandler} className="w-full">
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Nové heslo
          </label>
          <input
            type="password"
            id="password"
            placeholder="Zadejte nové heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
            Potvrzení hesla
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Zadejte heslo znovu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full my-5 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-200"
          disabled={loading}
        >
          Změnit heslo
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-blue-600 hover:text-blue-800 hover:underline text-sm">
          Zpět na přihlášení
        </Link>
      </div>
    </FormContainer>
  )
}

export default ResetPasswordPage
