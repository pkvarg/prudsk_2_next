'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, X, Pencil, Trash, BarChart } from 'react-bootstrap-icons'
import Message from '@/app/components/Message'
import Loader from '@/app/components/Loader'
import useUserStore from '@/store/userStore'

const UserListPage = () => {
  const router = useRouter()
  const [countVisitors, setCountVisitors] = useState(0)
  const [countBots, setCountBots] = useState(0)
  const [countEmails, setCountEmails] = useState(0)
  const [lastVisit, setLastVisit] = useState('')

  // Filters (combined with AND)
  const [filterHwmr, setFilterHwmr] = useState(false)
  const [filterRegistered, setFilterRegistered] = useState(false)
  const [filterAdmin, setFilterAdmin] = useState(false)

  // Batch selection
  const [selectedIds, setSelectedIds] = useState([])

  const {
    users,
    loading,
    error,
    userInfo,
    successDelete,
    loadingBatch,
    errorBatch,
    listUsers,
    deleteUser,
    getUserDetails,
    batchSetHwmr,
  } = useUserStore()

  const apiUrl = `${process.env.NEXT_PUBLIC_HONO_API_URL || 'https://hono-api.pictusweb.com'}/api/stats/prudsk2next`

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
    if (window.confirm('Ste si istí?')) {
      deleteUser(id)
    }
  }

  const filteredUsers = useMemo(() => {
    if (!users) return []
    return users.filter((user) => {
      if (filterHwmr && !user.hwmr) return false
      if (filterRegistered && !user.isRegistered) return false
      if (filterAdmin && !user.isAdmin) return false
      return true
    })
  }, [users, filterHwmr, filterRegistered, filterAdmin])

  // Keep selection in sync with what is currently visible
  const filteredIds = useMemo(() => filteredUsers.map((u) => u.id), [filteredUsers])
  const visibleSelectedIds = useMemo(
    () => selectedIds.filter((id) => filteredIds.includes(id)),
    [selectedIds, filteredIds],
  )
  const allVisibleSelected = filteredIds.length > 0 && visibleSelectedIds.length === filteredIds.length

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)))
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])))
    }
  }

  const batchHandler = async (value) => {
    if (visibleSelectedIds.length === 0) return
    const label = value ? 'áno' : 'nie'
    if (
      !window.confirm(
        `Nastaviť HWMR na "${label}" pre ${visibleSelectedIds.length} používateľov?`,
      )
    ) {
      return
    }
    const ok = await batchSetHwmr(visibleSelectedIds, value)
    if (ok) {
      setSelectedIds([])
    }
  }

  const filterButton = (active, onClick, label) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
        active
          ? 'bg-red-700 text-white border-red-700'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  )

  return (
    <main className="mx-8">
      <div className="flex items-center justify-between mb-4 mx-8 mt-12">
        <h1 className="text-2xl font-bold">Používatelia</h1>

        <div className="mb-4 text-[15px]">
          <p className="font-bold mt-2">Počet návštev: {countVisitors}</p>
          <p className="font-bold mt-2">Roboti: {countBots}</p>
          <p className="font-bold mt-2">Emaily : {countEmails}</p>
          <p className="font-bold mt-2">Posledná návšteva: {lastVisit}</p>
          <Link
            href="https://analytics.pictusweb.com/share/4qow26JwJaZkn1IN/test-prudsk.betterhost.sk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-red-700 hover:bg-red-800 !text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <BarChart size={16} />
            Zobraziť analytiku
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4 mx-8">
        <span className="text-sm text-gray-500 mr-1">Filter:</span>
        {filterButton(filterHwmr, () => setFilterHwmr((v) => !v), 'Len HWMR')}
        {filterButton(filterRegistered, () => setFilterRegistered((v) => !v), 'Len registrovaní')}
        {filterButton(filterAdmin, () => setFilterAdmin((v) => !v), 'Len admini')}
        {(filterHwmr || filterRegistered || filterAdmin) && (
          <button
            type="button"
            onClick={() => {
              setFilterHwmr(false)
              setFilterRegistered(false)
              setFilterAdmin(false)
            }}
            className="text-sm text-blue-600 hover:underline ml-1"
          >
            Zrušiť filtre
          </button>
        )}
        <span className="text-sm text-gray-400 ml-auto">
          Zobrazených: {filteredUsers.length}
          {users ? ` / ${users.length}` : ''}
        </span>
      </div>

      {/* Batch action bar */}
      {visibleSelectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-4 mx-8 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-gray-800">
            Vybraných: {visibleSelectedIds.length}
          </span>
          <span className="text-sm text-gray-600">Nastaviť HWMR:</span>
          <button
            type="button"
            disabled={loadingBatch}
            onClick={() => batchHandler(true)}
            className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white text-sm"
          >
            Áno
          </button>
          <button
            type="button"
            disabled={loadingBatch}
            onClick={() => batchHandler(false)}
            className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-sm"
          >
            Nie
          </button>
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="text-sm text-gray-600 hover:underline ml-1"
          >
            Zrušiť výber
          </button>
          {loadingBatch && <span className="text-sm text-gray-500">Ukladám…</span>}
          {errorBatch && <span className="text-sm text-red-600">{errorBatch}</span>}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 cursor-pointer"
                    title="Vybrať všetkých zobrazených"
                  />
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  MENO
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  E-MAIL
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  REGISTRÁCIA
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ADMIN
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  HWMR
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  POSL. STIAHNUTIE
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  AKCIE
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-200">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="h-4 w-4 cursor-pointer"
                    />
                  </td>
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
                  <td className="py-2 px-4 border-b border-gray-200 text-2xl">
                    {user.hwmr ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-600">
                    {user.lastEbookDownloadAt
                      ? new Date(user.lastEbookDownloadAt).toLocaleDateString('sk-SK')
                      : '—'}
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
