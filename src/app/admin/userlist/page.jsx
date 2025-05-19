'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Check, X, Pencil, Trash } from 'react-bootstrap-icons'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import useUserStore from '../../../store/userStore'

const UserListPage = () => {
  const router = useRouter()
  const [countVisitors, setCountVisitors] = useState(0)
  const [countBots, setCountBots] = useState(0)
  const [countEmails, setCountEmails] = useState(0)
  const [lastVisit, setLastVisit] = useState('')

  const {
    users,
    loading,
    error,
    userInfo,
    successDelete,
    listUsers,
    deleteUser,
    getUserDetails,
    visitorsCount,
    setVisitorsCount,
  } = useUserStore()

  const apiUrl = 'https://hono-api.pictusweb.com/api/stats/proud2next'
  //const apiUrl = 'http://localhost:3013/api/stats/proud2next'

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        const date = data.lastVisitor_at.split('T')[0]

        setCountBots(data.bots)
        setCountVisitors(data.visitors)
        setCountEmails(data.emails)
        setLastVisit(date)
      } catch (err) {
        console.error('Error fetching bots:', err)
      }
    }

    getStats()
  }, [])

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      listUsers()

      getUserDetails(userInfo.id)
    } else {
      router.push('/login')
    }
  }, [userInfo, router, successDelete, listUsers, getUserDetails, userInfo?.id])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      deleteUser(id)
    }
  }

  return (
    <main className="mx-8">
      <div className="flex items-center justify-between mb-4 mx-8 mt-12">
        <h1 className="text-2xl font-bold">Uživatelé</h1>

        <div className="mb-4 text-[15px]">
          <p className="font-bold mt-2">Počet návštev: {countVisitors}</p>
          <p className="font-bold mt-2">Roboti: {countBots}</p>
          <p className="font-bold mt-2">Emaily : {countEmails}</p>
          <p className="font-bold mt-2">Posledná návšteva: {lastVisit}</p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  JMÉNO
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  E-MAIL
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  REGISTRACE
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ADMIN
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  AKCE
                </th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b border-gray-200">{user.name}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <a
                        href={`mailto:${user.email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-2xl">
                      {user.isRegistered ? (
                        <Check className="text-green-500" />
                      ) : (
                        <X className="text-red-500" />
                      )}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-2xl">
                      {user.isAdmin ? (
                        <Check className="text-green-500" />
                      ) : (
                        <X className="text-red-500" />
                      )}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 space-x-2">
                      <Link
                        href={`/admin/user/${user.id}/edit`}
                        className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        className="inline-block bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                        onClick={() => deleteHandler(user.id)}
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default UserListPage
