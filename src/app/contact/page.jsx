'use client'
import React, { useEffect, useState, useLayoutEffect } from 'react'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'

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

  useLayoutEffect(() => {
    window.scrollTo(0, 200)
  })

  const increaseBots = async () => {
    const apiUrl = 'https://hono-api.pictusweb.com/api/bots/proud2next/increase'
    //const apiUrl = 'http://localhost:3013/api/bots/proud2next/increase'
    try {
      await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      //console.log('data bots', data)
    } catch (error) {
      console.error('Error increasing bots:', error)
    }
  }

  const increaseEmails = async () => {
    const apiUrl = 'https://hono-api.pictusweb.com/api/emails/proud2next/increase'
    //const apiUrl = 'http://localhost:3013/api/emails/proud2next//increase'
    try {
      await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      //console.log('data email', data)
    } catch (error) {
      console.error('Error increasing emails:', error)
    }
  }

  async function sendMail() {
    const origin = 'PROUD2NEXT'
    const subject = 'Kontakt Eshop'
    const locale = 'cz'

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

      console.log('sendData', sendData)

      const apiUrl = 'http://localhost:3013/api/proud2next/contact'
      //const apiUrl = 'https://hono-api.pictusweb.com/api/proud2next/contact'

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
          message: errorData.message || 'Failed to submit form',
        }
      }

      // Return success response
      const data = await response.json()

      //console.log('returned data', data)
      return {
        success: true,
        message: data.message || 'Message sent successfully',
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
        message: 'An unexpected error occurred',
      }
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    if (passwordGroupOne !== x || passwordGroupTwo !== y) {
      setMessage('Neodesláno! Kontaktujte nás telefonicky nebo emailem, prosím')
      setName('')
      setEmail('')
      setMailMessage('')
      increaseBots()
      return
    } else {
      await sendMail()
      increaseEmails()
      setMessageSuccess('Zpráva úspěšně odeslána')
      setName('')
      setEmail('')
      setMailMessage('')
    }
  }

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="py-3">
          <h1 className="text-[18px] font-medium py-4 text-[#313131]">Napište nám zprávu</h1>
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
                Jméno a příjmení<sup className="text-red-500 ml-0.5">*</sup>
              </label>
              <input
                required
                type="text"
                id="name"
                placeholder="Jméno a příjmení"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 text-[17px] border border-gray-300 rounded-[35px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                className="w-full mt-1 text-[17px] border border-gray-300 rounded-[35px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                className="w-full mt-1 text-[17px] border border-gray-300 rounded-[35px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block mt-4 text-[15px]">
                Zpráva<sup className="text-red-500 ml-0.5">*</sup>
              </label>
              <textarea
                required
                id="message"
                rows={10}
                placeholder="Vaše zpráva"
                value={mailMessage}
                onChange={(e) => setMailMessage(e.target.value)}
                className="w-full mt-1 text-[17px] border border-gray-300 rounded-[35px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                className="transform translate-y-[30%]"
              />
              <p className="text-[20px]">Souhlasím se zpracovaním osobních údajů</p>
            </div>

            <button
              type="submit"
              className="my-3 bg-[#2cb3e6] text-white py-2 px-4 rounded-[10px] hover:bg-white hover:text-[#2cb3e6] hover:border hover:border-[#2cb3e6] transition-colors duration-200"
            >
              Odeslat
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Contact
