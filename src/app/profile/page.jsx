// app/profile/page.jsx
'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import useUserStore from '@/store/userStore'
import Message from '@/app/components/Message'
import Loader from '@/app/components/Loader'
import Link from 'next/link'

const ProfilePage = () => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [messageSuccess, setMessageSuccess] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isGoogleUser, setIsGoogleUser] = useState(false)

  // Zustand store
  const {
    userInfo,
    userDetails,
    getUserDetails,
    updateUserProfile,
    listMyOrders,
    resetUserProfile,
    orderListMy,
  } = useUserStore()

  const { loading, error, user } = userDetails || {}
  const { success } = userDetails || {}
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy || {}

  useLayoutEffect(() => {
    window.scrollTo(0, 200)
  }, [])

  useEffect(() => {
    if (!userInfo) {
      router.push('/login')
    } else {
      if (!user || !user.name || success) {
        resetUserProfile()
        getUserDetails('profile')
        listMyOrders()
      } else if (user._id !== userInfo._id) {
        getUserDetails(userInfo._id)
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsSubscribed(user.isSubscribed)
        listMyOrders()

        if (user.googleId) {
          setIsGoogleUser(true)
        }
      }
    }
  }, [userInfo, user, success, router, getUserDetails, listMyOrders, resetUserProfile])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Hesla nesouhlasí')
    } else {
      updateUserProfile({
        id: user._id,
        name,
        email,
        password,
        isSubscribed,
      })
      setMessageSuccess('Data úspěšně změněna')
    }
  }

  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="flex flex-wrap -mx-4">
        {/* Profile Form Section */}
        <div className="w-full md:w-1/4 px-4">
          <h2 className="text-lg font-medium mb-4">Můj profil</h2>

          {message && <Message variant="danger">{message}</Message>}
          {messageSuccess && <Message variant="success">{messageSuccess}</Message>}
          {error && <Message variant="danger">{error}</Message>}
          {success && <Message variant="success">Profil upravený</Message>}
          {loading && <Loader />}

          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm mb-2">
                Jméno a příjmení
              </label>
              <input
                type="text"
                id="name"
                placeholder="Jméno a příjmení"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="E-mail"
                value={email}
                //onChange={(e) => setEmail(e.target.value)}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <h3 className="text-left">Zmenit moje heslo</h3>

            {!isGoogleUser && (
              <>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700 text-sm mb-2">
                    Heslo
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Heslo"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-gray-700 text-sm mb-2">
                    Potvrďte heslo
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Potvrďte heslo"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div className="flex gap-5 mb-4">
              <input
                type="checkbox"
                id="newsletter"
                checked={isSubscribed}
                onChange={(e) => setIsSubscribed(!isSubscribed)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <label htmlFor="newsletter" className="text-gray-700 text-sm">
                Přejete si odebírat informace o novinkách a akcích (cca 2x ročně)?
              </label>
            </div>

            <button
              type="submit"
              className="mt-5 bg-[#2cb3e6] hover:bg-white hover:text-[#2cb3e6] hover:border hover:border-[#2cb3e6] text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Upravit profil
            </button>
          </form>
        </div>

        {/* Orders Section */}
        <div className="w-full md:w-3/4 px-4">
          <h2 className="text-lg font-medium mb-4">Moje objednávky</h2>

          {loadingOrders ? (
            <Loader />
          ) : errorOrders ? (
            <Message variant="danger">{errorOrders}</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">ČÍSLO</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">DATUM</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">CELKEM Kč</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">ZAPLACENO</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">ODESLÁNO</th>
                    <th className="border border-gray-200 px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">{order.orderNumber}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">{order.totalPrice}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        {order.isPaid ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <i className="fas fa-times text-red-500"></i>
                        )}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <i className="fas fa-times text-red-500"></i>
                        )}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <Link
                          href={`/order/${order.id}`}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1 rounded text-sm"
                        >
                          Detaily
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
