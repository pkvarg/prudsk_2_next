'use client'
import React, { useEffect, useState, useLayoutEffect } from 'react'
import Message from '@/app/components/Message'
import Loader from '@/app/components/Loader'
import FormContainer from '@/app/components/FormContainer'

const Contact = () => {
  const x = process.env.NEXT_PUBLIC_PASSWORD_GROUP_ONE
  const y = process.env.NEXT_PUBLIC_PASSWORD_GROUP_TWO

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [mailMessage, setMailMessage] = useState('')
  const [passwordGroupOne, setPasswordGroupOne] = useState(x)
  const [passwordGroupTwo, setPasswordGroupTwo] = useState(y)

  const [message, setMessage] = useState(null)
  const [messageSuccess, setMessageSuccess] = useState(null)

  // Bot protection states
  const [honeypot, setHoneypot] = useState('')
  const [formStartTime, setFormStartTime] = useState(0)

  useLayoutEffect(() => {
    window.scrollTo(0, 200)
  }, [])

  // Initialize form start time for time-based validation
  useEffect(() => {
    setFormStartTime(Date.now())
  }, [])

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
    const storageKey = 'contact_form_submissions'
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
          phone,
          message: mailMessage,
          honeypot,
          detectionType,
          detectionDetails,
          locale: 'sk',
          origin: 'PRUDSK2NEXT_CONTACT',
          timeSpent,
        }),
      })
    } catch (error) {
      console.error('Error logging bot attempt:', error)
    }
  }

  const increaseBots = async () => {
    const apiUrl = 'https://hono-api.pictusweb.com/api/bots/prudsk2next/increase'
    //const apiUrl = 'http://localhost:3013/api/bots/prudsk2next/increase'
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

  const increaseEmails = async () => {
    const apiUrl = 'https://hono-api.pictusweb.com/api/emails/prudsk2next/increase'
    //const apiUrl = 'http://localhost:3013/api/emails/prudsk2next//increase'
    try {
      await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Error increasing emails:', error)
    }
  }

  async function sendMail() {
    const origin = 'prudsk2next'
    const subject = 'Kontakt Eshop'
    const locale = 'sk'

    try {
      const sendData = {
        //...options,
        name,
        email,
        phone,
        mailMessage,
        locale,
        origin,
        subject,
      }

      //const apiUrl = 'http://localhost:3013/api/prudsk2next/contact'
      const apiUrl = 'https://hono-api.pictusweb.com/api/prudsk2next/contact'

      // Make the API request
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendData),
      })

      // Check if request was successful
      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          message: errorData.message || 'Nepodarilo sa odoslať formulár',
        }
      }

      // Return success response
      const data = await response.json()

      return {
        success: true,
        message: data.message || 'Správa bola úspešne odoslaná',
      }
    } catch (error) {
      // Handle validation errors
      if (error) {
        return {
          success: false,
          message: error,
        }
      }

      // Handle other errors
      console.error('Contact form submission error:', error)
      return {
        success: false,
        message: 'Nastala neočakávaná chyba',
      }
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    const timeSpent = Date.now() - formStartTime

    // Bot Check 1: Honeypot field
    if (honeypot !== '') {
      await logBotAttempt('honeypot', `Honeypot field filled with value: "${honeypot}"`, timeSpent)
      setMessage('Neodoslané! Kontaktujte nás telefonicky alebo emailom, prosím')
      increaseBots()
      return
    }

    // Bot Check 2: Time-based validation (minimum 3 seconds)
    if (timeSpent < 3000) {
      await logBotAttempt(
        'time-based',
        `Form submitted too quickly: ${timeSpent}ms (minimum: 3000ms)`,
        timeSpent,
      )
      setMessage('Neodoslané! Kontaktujte nás telefonicky alebo emailom, prosím')
      increaseBots()
      return
    }

    // Bot Check 3: Content validation
    if (isSpamContent(name) || isSpamContent(mailMessage)) {
      const spamReason = isSpamContent(name) ? 'name field' : 'message field'
      await logBotAttempt('content-validation', `Spam content detected in ${spamReason}`, timeSpent)
      setMessage('Neodoslané! Kontaktujte nás telefonicky alebo emailom, prosím')
      increaseBots()
      return
    }

    // Bot Check 4: Rate limiting
    if (!checkRateLimit()) {
      await logBotAttempt(
        'rate-limit',
        'Rate limit exceeded: More than 3 submissions in 1 hour',
        timeSpent,
      )
      setMessage('Príliš veľa pokusov. Skúste to prosím neskôr.')
      return
    }

    // Bot Check 5: Legacy honeypot (password fields)
    if (passwordGroupOne !== x || passwordGroupTwo !== y) {
      await logBotAttempt(
        'honeypot-legacy',
        'Legacy honeypot password fields were modified',
        timeSpent,
      )
      setMessage('Neodoslané! Kontaktujte nás telefonicky alebo emailom, prosím')
      setName('')
      setEmail('')
      setMailMessage('')
      increaseBots()
      return
    }

    // All checks passed - submit the form
    await sendMail()
    increaseEmails()
    setMessageSuccess('Správa úspešne odoslaná')
    setName('')
    setEmail('')
    setMailMessage('')
  }

  return (
    <>
      <div className="mx-auto lg:mx-[20%] px-4">
        <div className="py-3">
          <h1 className="text-[18px] font-medium py-4 text-[#313131]">Napíšte nám správu</h1>
          {message && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-[15px]">
              {message}
            </div>
          )}
          {messageSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-[15px]">
              {messageSuccess}
            </div>
          )}

          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label htmlFor="name" className="block mt-4 text-[15px]">
                Meno a priezvisko<sup className="text-red-500 ml-0.5">*</sup>
              </label>
              <input
                required
                type="text"
                id="name"
                placeholder="Meno a priezvisko"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 text-[17px] border border-gray-300 rounded-[35px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 pl-3"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mt-4 text-[15px]">
                E-mail<sup className="text-red-500 ml-0.5">*</sup>
              </label>
              <input
                required
                type="email"
                id="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 text-[17px] border border-gray-300 rounded-[35px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 pl-3"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block mt-4 text-[15px]">
                Telefon
              </label>
              <input
                required
                type="phone"
                id="phone"
                placeholder="Telefon"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-1 text-[17px] border border-gray-300 rounded-[35px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 pl-3"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block mt-4 text-[15px]">
                Správa<sup className="text-red-500 ml-0.5">*</sup>
              </label>
              <textarea
                required
                id="message"
                rows={10}
                placeholder="Vaša správa"
                value={mailMessage}
                onChange={(e) => setMailMessage(e.target.value)}
                className="w-full mt-1 text-[17px] border border-gray-300 rounded-[35px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 pl-3"
              />
            </div>

            {/* Honeypot field - hidden from users, only bots fill this */}
            <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
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

            {/* hidden password fields */}
            <div className="hidden">
              <input
                type="text"
                id="password-one"
                defaultValue={passwordGroupOne}
                onChange={(e) => setPasswordGroupOne(e.target.value)}
              />
            </div>

            <div className="hidden">
              <input
                type="text"
                id="password-two"
                defaultValue={passwordGroupTwo}
                onChange={(e) => setPasswordGroupTwo(e.target.value)}
              />
            </div>

            <div className="my-3 flex flex-row items-center gap-5">
              <input
                type="checkbox"
                name="gdprCheck"
                id="gdprCheck"
                required
                className="transform lg:translate-y-[20%]"
              />
              <p className="text-[15px] lg:text-[20px]">Súhlasím so spracovaním osobných údajov</p>
            </div>

            <button
              type="submit"
              className="my-3 bg-[#2cb3e6] text-white py-2 px-4 rounded-[10px] hover:bg-white hover:text-[#2cb3e6] hover:border hover:border-[#2cb3e6] transition-colors duration-200"
            >
              Odoslať
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Contact
