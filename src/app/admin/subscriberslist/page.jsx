'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState(null)
  const [unsubscribers, setUnsubscribers] = useState(null)
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  useEffect(() => {
    const getSubscribers = async () => {
      const { data } = await axios.get(`/api/subscribers/subscribed`, config)
      setSubscribers(data)
    }
    const getUnsubscribers = async () => {
      const { data } = await axios.get(`/api/subscribers/unsubscribed`, config)
      setUnsubscribers(data)
    }

    getSubscribers()
    getUnsubscribers()
  }, [])

  const extractEmails = (element) => {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g
    const text = element.innerText
    return text.match(emailRegex) || []
  }

  const copyEmails = () => {
    const emails = subscribers.map((user) => user.email).join(', ')
    navigator.clipboard.writeText(emails)
    alert('E-mailové adresy byly zkopírovány do schránky')
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[#071e46] text-2xl md:text-3xl font-bold">Odběratelé novinek</h1>
        </div>

        {/* Subscribers Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            {subscribers?.map((user) => (
              <div key={user.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                <p className="text-[#9b7d57] text-lg">
                  <span className="font-medium">{user.name}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-600">{user.email}</span>
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={copyEmails}
            className="mt-6 bg-[#071e46] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0a2554] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#071e46] focus:ring-offset-2 cursor-pointer"
          >
            Kopírovat mailové adresy odběratelů
          </button>
        </div>

        {/* Unsubscribers Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-[#071e46] text-xl md:text-2xl font-bold mb-6">Odběr zrušili</h2>

          <div className="space-y-4">
            {unsubscribers?.map((user) => (
              <div key={user.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                <p className="text-[#9b7d57] text-lg opacity-75">
                  <span className="font-medium">{user.name}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-600">{user.email}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Subscribers
