'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Message from '@/app/components/Message'
import axios from 'axios'

const CompleteRegistration = () => {
  const { email, token } = useParams()
  //const decodedEmail = decodeURIComponent(email)
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const goToLogin = () => {
    router.push('/login')
  }

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await axios.get(`/api/users/register/${email}/${token}`)

        if (res.data === 'ok') {
          setMessage('Registrácia bola úspešne dokončená! Môžete sa prihlásiť.')
          setTimeout(goToLogin, 3000)
        } else {
          setError(res.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    checkToken()
  }, [email, token])
  return (
    <div className="mx-[20%] mt-[10%]">
      {message && <Message variant="success">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
    </div>
  )
}

export default CompleteRegistration
