'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useUserStore from '@/store/userStore'
import Message from '@/app/components/Message'
import Loader from '@/app/components/Loader'
import FormContainer from '@/app/components/FormContainer'

const UserEditPage = () => {
  const params = useParams()
  const userId = params.id
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAssistant, setIsAssistant] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const {
    loading,
    error,
    user,
    loadingUpdate,
    errorUpdate,
    successUpdate,
    getUserDetails,
    updateUser,
    resetUserUpdate,
  } = useUserStore()

  useEffect(() => {
    if (successUpdate) {
      resetUserUpdate()
      router.push('/admin/userlist')
    } else {
      if (!user?.name || user?.id !== userId) {
        getUserDetails(userId)
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
        setIsAssistant(user.isAssistant)
        setIsRegistered(user.isRegistered)
        setIsSubscribed(user.isSubscribed)
      }
    }
  }, [router, userId, user, successUpdate, getUserDetails, resetUserUpdate])

  const submitHandler = (e) => {
    e.preventDefault()
    updateUser({
      id: userId,
      name,
      email,
      isAdmin,
      isAssistant,
      isRegistered,
      isSubscribed,
    })
  }

  return (
    <main className="mx-8 mt-8">
      <Link
        href="/admin/userlist"
        className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
      >
        Zpět
      </Link>
      <FormContainer>
        <h1 className="text-2xl font-bold mb-4">Upravit uživatele</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Meno
              </label>
              <input
                type="text"
                id="name"
                placeholder="Meno"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center my-3">
              <input
                id="isadmin"
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isadmin" className="ml-2 block text-sm text-gray-700">
                Admin?
              </label>
            </div>

            <div className="flex items-center my-2">
              <input
                id="isassistant"
                type="checkbox"
                checked={isAssistant}
                onChange={(e) => setIsAssistant(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isassistant" className="ml-2 block text-sm text-gray-700">
                Asistent? (zaškrtnutím sa přístup omezí na Audio, Video a Bannery)
              </label>
            </div>

            <div className="flex items-center my-2">
              <input
                id="isregistered"
                type="checkbox"
                checked={isRegistered}
                onChange={(e) => setIsRegistered(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isregistered" className="ml-2 block text-sm text-gray-700">
                Dokončená registrace?
              </label>
            </div>

            <div className="flex items-center my-2">
              <input
                id="isSubscribed"
                type="checkbox"
                checked={isSubscribed}
                onChange={(e) => setIsSubscribed(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isSubscribed" className="ml-2 block text-sm text-gray-700">
                Odběratel novinek?
              </label>
            </div>

            <button
              type="submit"
              className="mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Upravit
            </button>
          </form>
        )}
      </FormContainer>
    </main>
  )
}

export default UserEditPage
