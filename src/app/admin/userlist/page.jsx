'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, X, Pencil, Trash, BarChart, Search } from 'react-bootstrap-icons'
import Message from '@/app/components/Message'
import Loader from '@/app/components/Loader'
import useUserStore from '@/store/userStore'

// Diacritics-insensitive so "novak" finds "Novák" and "jan" finds "Ján"
const normalize = (value) =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const UserListPage = () => {
  const router = useRouter()
  const [countVisitors, setCountVisitors] = useState(0)
  const [countBots, setCountBots] = useState(0)
  const [countEmails, setCountEmails] = useState(0)
  const [lastVisit, setLastVisit] = useState('')

  // Search + filters (combined with AND)
  const [searchTerm, setSearchTerm] = useState('')
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

  // Every token has to hit the name or the e-mail, so "jan novak" narrows down
  // instead of returning everyone called Jan.
  const searchTokens = useMemo(
    () => normalize(searchTerm).split(/\s+/).filter(Boolean),
    [searchTerm],
  )

  const filteredUsers = useMemo(() => {
    if (!users) return []
    return users.filter((user) => {
      if (filterHwmr && !user.hwmr) return false
      if (filterRegistered && !user.isRegistered) return false
      if (filterAdmin && !user.isAdmin) return false
      if (searchTokens.length) {
        const haystack = `${normalize(user.name)} ${normalize(user.email)}`
        if (!searchTokens.every((token) => haystack.includes(token))) return false
      }
      return true
    })
  }, [users, filterHwmr, filterRegistered, filterAdmin, searchTokens])

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
    <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
        <h1 className="text-2xl font-bold">Používatelia</h1>

        <div className="text-sm sm:text-[15px] bg-white rounded-lg border border-gray-200 p-4 lg:border-0 lg:bg-transparent lg:p-0">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 lg:block">
            <p className="font-bold lg:mt-2">Počet návštev: {countVisitors}</p>
            <p className="font-bold lg:mt-2">Roboti: {countBots}</p>
            <p className="font-bold lg:mt-2">Emaily : {countEmails}</p>
            <p className="font-bold lg:mt-2">Posledná návšteva: {lastVisit}</p>
          </div>
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

      {/* Search — meno, priezvisko alebo e-mail */}
      <div className="relative w-full sm:max-w-md mb-4">
        <input
          type="search"
          id="user-search"
          name="user-search"
          aria-label="Hľadať používateľa podľa mena, priezviska alebo e-mailu"
          placeholder="Hľadať (meno, priezvisko, e-mail)…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={16}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            title="Zrušiť hľadanie"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-sm text-gray-500 mr-1">Filter:</span>
        {filterButton(filterHwmr, () => setFilterHwmr((v) => !v), 'Len HWMR')}
        {filterButton(filterRegistered, () => setFilterRegistered((v) => !v), 'Len registrovaní')}
        {filterButton(filterAdmin, () => setFilterAdmin((v) => !v), 'Len admini')}
        {(filterHwmr || filterRegistered || filterAdmin || searchTerm) && (
          <button
            type="button"
            onClick={() => {
              setFilterHwmr(false)
              setFilterRegistered(false)
              setFilterAdmin(false)
              setSearchTerm('')
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
        <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
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
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {searchTerm
              ? `Pre „${searchTerm}“ sa nenašiel žiadny používateľ`
              : 'Žiadni používatelia'}
          </h3>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
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

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 px-1">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4 cursor-pointer"
              />
              Vybrať všetkých zobrazených
            </label>

            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                    className="h-4 w-4 mt-1 cursor-pointer shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 break-words">{user.name || '—'}</p>
                    <a
                      href={`mailto:${user.email}`}
                      className="text-sm text-blue-600 hover:text-blue-800 break-all"
                    >
                      {user.email}
                    </a>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link
                      href={`/admin/user/${user.id}/edit`}
                      className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      className="inline-block bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                      onClick={() => deleteHandler(user.id)}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.isRegistered ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    Registrácia {user.isRegistered ? '✓' : '✗'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.isAdmin ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    Admin {user.isAdmin ? '✓' : '✗'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.hwmr ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    HWMR {user.hwmr ? '✓' : '✗'}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Posl. stiahnutie:{' '}
                  {user.lastEbookDownloadAt
                    ? new Date(user.lastEbookDownloadAt).toLocaleDateString('sk-SK')
                    : '—'}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}

export default UserListPage
