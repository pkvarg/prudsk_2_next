'use client'
import React, { useEffect, useState, useLayoutEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import DatePicker, { registerLocale } from 'react-datepicker'
import { sk } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'

registerLocale('sk', sk)

const inputClass =
  'w-full mt-1 text-[17px] border border-gray-300 rounded-[35px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 pl-3'

const WithdrawalForm = () => {
  const searchParams = useSearchParams()
  const x = process.env.NEXT_PUBLIC_PASSWORD_GROUP_ONE
  const y = process.env.NEXT_PUBLIC_PASSWORD_GROUP_TWO

  const [orderNumber, setOrderNumber] = useState('')
  const [orderDate, setOrderDate] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [items, setItems] = useState('')
  const [iban, setIban] = useState('')
  const [reason, setReason] = useState('')
  const [passwordGroupOne, setPasswordGroupOne] = useState(x)
  const [passwordGroupTwo, setPasswordGroupTwo] = useState(y)

  const [message, setMessage] = useState(null)
  const [submitted, setSubmitted] = useState(null)
  const [sending, setSending] = useState(false)

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

  // Prefill order number from /odstupenie?order=...
  useEffect(() => {
    const order = searchParams.get('order')
    if (order) {
      setOrderNumber(order)
    }
  }, [searchParams])

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
    const storageKey = 'withdrawal_form_submissions'
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
          message: `orderNumber: ${orderNumber}, items: ${items}, reason: ${reason}`,
          honeypot,
          detectionType,
          detectionDetails,
          locale: 'sk',
          origin: 'PRUDSK2NEXT_WITHDRAWAL',
          timeSpent,
        }),
      })
    } catch (error) {
      console.error('Error logging bot attempt:', error)
    }
  }

  const increaseBots = async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_HONO_API_URL || 'https://hono-api.pictusweb.com'}/api/bots/prudsk2next/increase`
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
    const apiUrl = `${process.env.NEXT_PUBLIC_HONO_API_URL || 'https://hono-api.pictusweb.com'}/api/emails/prudsk2next/increase`
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

  const submitHandler = async (e) => {
    e.preventDefault()
    setMessage(null)

    const timeSpent = Date.now() - formStartTime

    // Bot Check 1: Honeypot field
    if (honeypot !== '') {
      await logBotAttempt('honeypot', `Honeypot field filled with value: "${honeypot}"`, timeSpent)
      setMessage('Neodoslané! Kontaktujte nás emailom na eshop@prud.sk, prosím.')
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
      setMessage('Neodoslané! Kontaktujte nás emailom na eshop@prud.sk, prosím.')
      increaseBots()
      return
    }

    // Bot Check 3: Content validation (name only - other fields are numbers/optional
    // and must not block a legitimate withdrawal)
    if (isSpamContent(name)) {
      await logBotAttempt('content-validation', 'Spam content detected in name field', timeSpent)
      setMessage('Neodoslané! Kontaktujte nás emailom na eshop@prud.sk, prosím.')
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
      setMessage('Neodoslané! Kontaktujte nás emailom na eshop@prud.sk, prosím.')
      increaseBots()
      return
    }

    // All checks passed - submit the form
    setSending(true)
    try {
      const response = await fetch('/api/withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber,
          orderDate: orderDate ? orderDate.toLocaleDateString('sk-SK') : '',
          name,
          email,
          phone,
          address,
          items,
          iban,
          reason,
          honeypot,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setMessage(data.message || 'Nepodarilo sa odoslať odstúpenie od zmluvy.')
        return
      }

      increaseEmails()
      setSubmitted({
        submittedAt: data.submittedAt,
        emailSent: data.emailSent,
      })
    } catch (error) {
      console.error('Withdrawal form submission error:', error)
      setMessage('Nastala neočakávaná chyba. Skúste to prosím znova.')
    } finally {
      setSending(false)
    }
  }

  if (submitted) {
    const submittedDate = new Date(submitted.submittedAt)
    return (
      <div className="mx-auto lg:mx-[20%] px-4">
        <div className="py-3">
          <h1 className="text-[18px] font-medium py-4 text-[#313131]">Odstúpenie od zmluvy</h1>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-[15px]">
            <p className="font-semibold mb-2">Vaše odstúpenie od zmluvy bolo prijaté.</p>
            <p className="mb-2">
              Dátum a čas odoslania:{' '}
              {submittedDate.toLocaleString('sk-SK', { timeZone: 'Europe/Bratislava' })}
            </p>
            {submitted.emailSent ? (
              <p>Potvrdenie o prijatí sme Vám zaslali e-mailom.</p>
            ) : (
              <p>
                Potvrdenie o prijatí Vám zašleme e-mailom. Ak Vám potvrdenie nepríde do 24 hodín,
                kontaktujte nás na eshop@prud.sk.
              </p>
            )}
          </div>
          <p className="text-[15px] mt-4">
            Tovar nám prosím zašlite späť najneskôr do 14 dní od odstúpenia od zmluvy. Peniaze Vám
            vrátime najneskôr do 14 dní od doručenia odstúpenia od zmluvy.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto lg:mx-[20%] px-4">
      <div className="py-3">
        <h1 className="text-[18px] font-medium py-4 text-[#313131]">Odstúpenie od zmluvy</h1>

        <p className="text-[15px] mb-2">
          Ako spotrebiteľ máte právo odstúpiť od zmluvy uzavretej na diaľku bez uvedenia dôvodu do
          14 dní od prevzatia tovaru. Vyplňte a odošlite tento formulár - obratom Vám e-mailom
          potvrdíme prijatie odstúpenia vrátane dátumu a času odoslania.
        </p>
        <p className="text-[15px] mb-4">
          Viac informácií nájdete v{' '}
          <Link href="/trade-rules" className="text-[#2cb3e6] underline">
            obchodných podmienkach
          </Link>
          .
        </p>

        {message && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-[15px]">
            {message}
          </div>
        )}

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="orderNumber" className="block mt-4 text-[15px]">
              Číslo objednávky<sup className="text-red-500 ml-0.5">*</sup>
            </label>
            <input
              required
              type="text"
              id="orderNumber"
              placeholder="Číslo objednávky"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="orderDate" className="block mt-4 text-[15px]">
              Dátum objednania alebo prevzatia tovaru
            </label>
            <DatePicker
              id="orderDate"
              selected={orderDate}
              onChange={(date) => setOrderDate(date)}
              locale="sk"
              dateFormat="dd.MM.yyyy"
              placeholderText="DD.MM.RRRR"
              maxDate={new Date()}
              showPopperArrow={false}
              className={inputClass}
              wrapperClassName="w-full"
            />
          </div>

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
              className={inputClass}
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
              placeholder="E-mail použitý pri objednávke"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block mt-4 text-[15px]">
              Telefón
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Telefón"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block mt-4 text-[15px]">
              Adresa
            </label>
            <input
              type="text"
              id="address"
              placeholder="Ulica, číslo, PSČ, mesto"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="items" className="block mt-4 text-[15px]">
              Tovar, ktorý vraciate (ak nevraciate celú objednávku)
            </label>
            <textarea
              id="items"
              rows={4}
              placeholder="Ak pole nevyplníte, odstúpenie sa vzťahuje na celú objednávku"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="iban" className="block mt-4 text-[15px]">
              IBAN pre vrátenie peňazí
            </label>
            <input
              type="text"
              id="iban"
              placeholder="SK.."
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="reason" className="block mt-4 text-[15px]">
              Dôvod odstúpenia (nepovinné)
            </label>
            <textarea
              id="reason"
              rows={4}
              placeholder="Dôvod nemusíte uvádzať"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={inputClass}
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
            disabled={sending}
            className="my-3 bg-[#8a1b1f] text-white py-2 px-4 rounded-[10px] hover:bg-white hover:text-[#8a1b1f] hover:border hover:border-[#8a1b1f] transition-colors duration-200 disabled:opacity-50"
          >
            {sending ? 'Odosielam...' : 'Potvrdiť odstúpenie od zmluvy'}
          </button>
        </form>
      </div>
    </div>
  )
}

const Withdrawal = () => (
  <Suspense fallback={null}>
    <WithdrawalForm />
  </Suspense>
)

export default Withdrawal
