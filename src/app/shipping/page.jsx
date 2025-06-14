'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useCartStore from '@/store/cartStore'
import FormContainer from '@/app/components/FormContainer'
import CheckoutSteps from '@/app/components/CheckoutSteps'

const ShippingScreen = () => {
  const router = useRouter()
  const { shippingAddress, saveShippingAddress, _hasHydrated } = useCartStore()

  console.log('shipping address', shippingAddress)

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('Česká republika')
  const [billingName, setBillingName] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const [billingCity, setBillingCity] = useState('')
  const [billingPostalCode, setBillingPostalCode] = useState('')
  const [billingCountry, setBillingCountry] = useState('')
  const [billingICO, setBillingICO] = useState('')
  const [note, setNote] = useState('')
  const [phone, setPhone] = useState('')
  const [checked, setChecked] = useState(false)
  const [checkedICO, setCheckedICO] = useState(false)

  useEffect(() => {
    if (shippingAddress) {
      setName(shippingAddress.name || '')
      setAddress(shippingAddress.address || '')
      setCity(shippingAddress.city || '')
      setPostalCode(shippingAddress.postalCode || '')
      setCountry(shippingAddress.country || 'Česká republika')
      setBillingName(shippingAddress.billingName || '')
      setBillingAddress(shippingAddress.billingAddress || '')
      setBillingCity(shippingAddress.billingCity || '')
      setBillingPostalCode(shippingAddress.billingPostalCode || '')
      setBillingCountry(shippingAddress.billingCountry || '')
      setBillingICO(shippingAddress.billingICO || '')
      setNote(shippingAddress.note || '')
      setPhone(shippingAddress.phone || '')
    }
  }, [shippingAddress])

  const autofilledAlternatives = [
    'czech republic',
    'Czech Republic',
    'čr',
    'cr',
    'Cr',
    'ČR',
    'cz',
    'CZ',
    'česká republika',
    'ceská republika',
    'Česká republika',
    'Ceská Republika',
    'Ceska Republika',
    'ceska republika',
    'Czechia',
    'czechia',
    'česko',
    'Česko',
    'Cesko',
    'cesko',
    'Čechy',
    'Cechy',
    'čechy',
    'cechy',
    'Morava',
    'Slezsko',
    'Czech Rep.',
    'czech rep',
    'Czech rep',
  ]

  useEffect(() => {
    if (autofilledAlternatives.includes(country)) {
      setCountry('Česká republika')
    }
  }, [country])

  const submitHandler = (e) => {
    e.preventDefault()
    if (country === '' || country === 'Uvedte stát' || country.includes('Uvedte stát')) {
      alert('Uvedte prosím stát.')
      return
    }

    saveShippingAddress({
      name,
      address,
      city,
      postalCode,
      country,
      billingName,
      billingAddress,
      billingCity,
      billingPostalCode,
      billingCountry,
      billingICO,
      note,
      phone,
    })

    router.push('/payment')
  }

  const handleChange = () => {
    setChecked(!checked)
  }

  const handleChangeICO = () => {
    setCheckedICO(!checkedICO)
  }

  const handleRadioChange = (e) => {
    const value = e.target.value
    setCountry(value)
  }

  // Don't render until hydrated
  // if (!_hasHydrated) {
  //   return (
  //     <div className="container mx-auto px-4">
  //       <div className="flex items-center justify-center h-64">
  //         <div className="text-lg text-[#9b7d57]">Načítám...</div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="mx-auto lg:mx-[15%] px-4">
      <Link
        href="/cart"
        className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
      >
        ← Zpět
      </Link>
      <CheckoutSteps step1 step2 />

      <div className="py-8">
        <h1 className="text-3xl font-bold text-[#071e46] mb-6">Doručení</h1>
        <h2 className="text-xl font-semibold text-[#071e46] mb-6">Doručovací adresa:</h2>

        <form onSubmit={submitHandler} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#191817] mb-2">
              Jméno a příjmení<sup className="text-red-500">*</sup>
            </label>
            <input
              type="text"
              id="name"
              placeholder="Jméno a příjmení"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb2e6] focus:border-transparent"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-[#191817] mb-2">
              Adresa<sup className="text-red-500">*</sup>
            </label>
            <input
              type="text"
              id="address"
              placeholder="Ulice a číslo"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb2e6] focus:border-transparent"
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-[#191817] mb-2">
              Město<sup className="text-red-500">*</sup>
            </label>
            <input
              type="text"
              id="city"
              placeholder="Město"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb2e6] focus:border-transparent"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-[#191817] mb-2">
              PSČ<sup className="text-red-500">*</sup>
            </label>
            <input
              type="text"
              id="postalCode"
              placeholder="PSČ"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb2e6] focus:border-transparent"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-[#191817] mb-2">
              Stát<sup className="text-red-500">*</sup>
            </label>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="countryOption"
                  value="Česká republika"
                  checked={country === 'Česká republika'}
                  onChange={handleRadioChange}
                  className="mr-2 text-[#2bb2e6] focus:ring-[#2bb2e6]"
                />
                <span className="text-[#191817]">Česká republika</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="countryOption"
                  value="Uvedte stát"
                  checked={country !== 'Česká republika' && country !== ''}
                  onChange={handleRadioChange}
                  className="mr-2 text-[#2bb2e6] focus:ring-[#2bb2e6]"
                />
                <span className="text-[#191817]">Jiné</span>
              </label>
            </div>

            {country !== 'Česká republika' && (
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb2e6] focus:border-transparent"
                placeholder="Zadejte stát"
              />
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[#191817] mb-2">
              Telefon
            </label>
            <input
              type="text"
              id="phone"
              placeholder="Telefon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb2e6] focus:border-transparent"
            />
          </div>

          {/* Note */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-[#191817] mb-2">
              Poznámka
            </label>
            <input
              type="text"
              id="note"
              placeholder="Poznámka"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb2e6] focus:border-transparent"
            />
          </div>

          {/* Billing Address Toggle */}
          <div className="my-8">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                onChange={handleChange}
                className="mt-1 text-[#2bb2e6] focus:ring-[#2bb2e6] rounded"
              />
              <h2 className="!text-[15px] font-semibold text-[#071e46]">
                Fakturační adresa se liší od doručovací
              </h2>
            </label>
          </div>

          {/* Billing Address Fields */}
          {checked && (
            <div className="space-y-6 bg-gray-50 py-6 rounded-lg">
              <h3 className="font-semibold text-[#071e46] mb-4">Fakturační adresa</h3>

              <div>
                <label
                  htmlFor="billingName"
                  className="block text-sm font-medium text-[#191817] mb-2"
                >
                  Jméno a příjmení / Firma
                </label>
                <input
                  type="text"
                  id="billingName"
                  placeholder="Jméno a příjmení / Firma"
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb2e6] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="billingAddress"
                  className="block text-sm font-medium text-[#191817] mb-2"
                >
                  Fakturační adresa
                </label>
                <input
                  type="text"
                  id="billingAddress"
                  placeholder="Ulice a číslo"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb2e6] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="billingCity"
                  className="block text-sm font-medium text-[#191817] mb-2"
                >
                  Město
                </label>
                <input
                  type="text"
                  id="billingCity"
                  placeholder="Město"
                  value={billingCity}
                  onChange={(e) => setBillingCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb2e6] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="billingPostalCode"
                  className="block text-sm font-medium text-[#191817] mb-2"
                >
                  PSČ
                </label>
                <input
                  type="text"
                  id="billingPostalCode"
                  placeholder="PSČ"
                  value={billingPostalCode}
                  onChange={(e) => setBillingPostalCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb2e6] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="billingCountry"
                  className="block text-sm font-medium text-[#191817] mb-2"
                >
                  Stát
                </label>
                <input
                  type="text"
                  id="billingCountry"
                  placeholder="Stát"
                  value={billingCountry}
                  onChange={(e) => setBillingCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb2e6] focus:border-transparent"
                />
              </div>

              {/* ICO Toggle */}
              <div>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    onChange={handleChangeICO}
                    className="mt-1 text-[#2bb2e6] focus:ring-[#2bb2e6] rounded"
                  />
                  <h3 className="!text-[15px] font-semibold text-[#071e46]">IČO</h3>
                </label>
              </div>

              {checkedICO && (
                <div>
                  <label
                    htmlFor="billingICO"
                    className="block text-sm font-medium text-[#191817] mb-2"
                  >
                    IČO
                  </label>
                  <input
                    type="text"
                    id="billingICO"
                    placeholder="IČO"
                    value={billingICO}
                    onChange={(e) => setBillingICO(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb2e6] focus:border-transparent"
                  />
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#2bb2e6] text-white rounded-lg hover:bg-[#218334] transition-colors duration-200 font-medium text-lg mt-8"
          >
            Pokračovat
          </button>
        </form>
      </div>
    </div>
  )
}

export default ShippingScreen
