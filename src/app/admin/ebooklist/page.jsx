'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as Icon from 'react-bootstrap-icons'
import useEbookStore from '@/store/ebookStore'
import useUserStore from '@/store/userStore'

const formatDate = (value) => {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleDateString('sk-SK', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return '—'
  }
}

const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
  </div>
)

const Message = ({ variant = 'info', children }) => {
  const variantClasses = {
    danger: 'bg-red-100 border border-red-400 text-red-700',
    success: 'bg-green-100 border border-green-400 text-green-700',
    info: 'bg-blue-100 border border-blue-400 text-blue-700',
  }
  return (
    <div className={`px-4 py-3 rounded mb-4 ${variantClasses[variant] || variantClasses.info}`}>
      {children}
    </div>
  )
}

const EbookListPage = () => {
  const router = useRouter()
  const { userInfo } = useUserStore()
  const { ebookList, ebookDelete, listEbooks, softDeleteEbook, restoreEbook, resetEbookDelete } =
    useEbookStore()

  const [showTrash, setShowTrash] = useState(false)

  const { loading, error, ebooks } = ebookList
  const { success: successDelete } = ebookDelete

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      router.push('/login')
      return
    }
    listEbooks({ includeDeleted: true })
  }, [userInfo, router, listEbooks])

  useEffect(() => {
    if (successDelete) {
      resetEbookDelete()
    }
  }, [successDelete, resetEbookDelete])

  const filtered = (ebooks || []).filter((e) => (showTrash ? e.deletedAt : !e.deletedAt))

  const deleteHandler = (id) => {
    if (window.confirm('Naozaj presunúť ebook do koša?')) {
      softDeleteEbook(id)
    }
  }

  const restoreHandler = (id) => {
    restoreEbook(id)
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ebooky</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowTrash((v) => !v)}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium border transition-colors ${
              showTrash
                ? 'bg-gray-700 text-white border-gray-700'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {showTrash ? 'Aktívne' : 'Kôš'}
          </button>
          <Link
            href="/admin/ebook/new"
            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Icon.Plus size={20} /> Pridať ebook
          </Link>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Icon.Book className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {showTrash ? 'Žiadne ebooky v koši' : 'Žiadne ebooky'}
          </h3>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Názov
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Typ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Jazyk
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cena
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Aktívny
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stiahnutí
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Vytvorený
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Akcie
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((ebook) => (
                    <tr key={ebook.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{ebook.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 uppercase">{ebook.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 uppercase">
                        {ebook.language}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {Number(ebook.price || 0).toFixed(2)} €
                      </td>
                      <td className="px-4 py-3 text-xl">
                        {ebook.available ? (
                          <Icon.CheckCircleFill className="text-green-500" />
                        ) : (
                          <Icon.XCircleFill className="text-red-500" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {ebook._count?.downloads ?? ebook.downloads?.length ?? 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(ebook.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          {showTrash ? (
                            <button
                              className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg"
                              onClick={() => restoreHandler(ebook.id)}
                              title="Obnoviť"
                            >
                              <Icon.ArrowCounterclockwise size={16} />
                            </button>
                          ) : (
                            <>
                              <Link
                                href={`/admin/ebook/${ebook.id}/edit`}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg"
                              >
                                <Icon.PencilFill size={16} />
                              </Link>
                              <button
                                className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg"
                                onClick={() => deleteHandler(ebook.id)}
                                title="Presunúť do koša"
                              >
                                <Icon.Trash size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {filtered.map((ebook) => (
              <div
                key={ebook.id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h3 className="text-base font-semibold text-gray-900 break-words">
                    {ebook.name}
                  </h3>
                  <div className="flex gap-2 shrink-0">
                    {showTrash ? (
                      <button
                        className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg"
                        onClick={() => restoreHandler(ebook.id)}
                        title="Obnoviť"
                      >
                        <Icon.ArrowCounterclockwise size={16} />
                      </button>
                    ) : (
                      <>
                        <Link
                          href={`/admin/ebook/${ebook.id}/edit`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg"
                        >
                          <Icon.PencilFill size={16} />
                        </Link>
                        <button
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg"
                          onClick={() => deleteHandler(ebook.id)}
                          title="Presunúť do koša"
                        >
                          <Icon.Trash size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs uppercase">
                    {ebook.type}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs uppercase">
                    {ebook.language}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      ebook.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {ebook.available ? 'Aktívny' : 'Neaktívny'}
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-y-1.5 text-sm">
                  <dt className="text-gray-500">Cena</dt>
                  <dd className="text-gray-800 text-right">
                    {Number(ebook.price || 0).toFixed(2)} €
                  </dd>
                  <dt className="text-gray-500">Stiahnutí</dt>
                  <dd className="text-gray-800 text-right">
                    {ebook._count?.downloads ?? ebook.downloads?.length ?? 0}
                  </dd>
                  <dt className="text-gray-500">Vytvorený</dt>
                  <dd className="text-gray-800 text-right">{formatDate(ebook.createdAt)}</dd>
                </dl>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default EbookListPage
