'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Check, X, Pencil, Trash } from 'react-bootstrap-icons'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import useUserStore from '../../../store/userStore'

const UserListPage = () => {
  const router = useRouter()
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

  const getVisitors = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      const { data } = await axios.get('/api/counter/count', config)
      setVisitorsCount(data)
    } catch (error) {
      console.error('Failed to fetch visitors count:', error)
    }
  }

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      listUsers()
      getVisitors()
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
        <h2 className="text-xl">Počet návštěv: {visitorsCount}</h2>
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
