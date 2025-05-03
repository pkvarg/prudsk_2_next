'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Message from '../../../components/Message'
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

  console.log('em tok', email, token)

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await axios.get(`/api/users/register/${email}/${token}`)

        console.log('res', res)

        if (res.data === 'ok') {
          setMessage('Registrace byla úspěšně dokončena! Můžete se přihlásit.')
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
