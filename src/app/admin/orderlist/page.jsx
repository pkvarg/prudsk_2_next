'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useOrderStore from '@/store/orderStore'
import { X, CashCoin, CreditCard } from 'react-bootstrap-icons'

const Message = ({ variant, children }) => {
  const baseClasses = 'p-4 rounded-md mb-4'
  const variantClasses = {
    success: 'bg-green-100 border border-green-400 text-green-700',
    danger: 'bg-red-100 border border-red-400 text-red-700',
    warning: 'bg-yellow-100 border border-yellow-400 text-yellow-700',
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant] || variantClasses.danger}`}>
      {children}
    </div>
  )
}

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b7d57]"></div>
    </div>
  )
}

const OrderListScreen = () => {
  const router = useRouter()

  // Zustand stores
  const { orders, loading, error, listOrders } = useOrderStore()

  useEffect(() => {
    listOrders()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#071e46] mb-6">OBJEDNÁVKY</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full table-auto">
            <thead className="bg-[#edeae4]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#071e46] border-b">
                  Číslo
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#071e46] border-b">
                  Zrušena
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#071e46] border-b">
                  Používateľ
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#071e46] border-b">
                  Datum
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#071e46] border-b">
                  Cena
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#071e46] border-b">
                  Zaplatené
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#071e46] border-b">
                  Odoslané
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#071e46] border-b">
                  Akcie
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-sm text-red-600">
                    {order.isCancelled && 'Zrušená'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{order.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {order.createdAt?.substring(0, 10)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {order.totalPrice} €
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span>
                        {order.isPaid ? (
                          <span className="text-green-600">{order.paidAt?.substring(0, 10)}</span>
                        ) : (
                          <X className="text-red-500 w-4 h-4" />
                        )}
                      </span>
                      <span className="ml-4">
                        {order.paymentMethod === 'Hotovosť' ? (
                          <CashCoin className="text-[#9b7d57] w-4 h-4" />
                        ) : (
                          <CreditCard className="text-[#9b7d57] w-4 h-4" />
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {order.isDelivered ? (
                      <span className="text-green-600">{order.deliveredAt?.substring(0, 10)}</span>
                    ) : (
                      <X className="text-red-500 w-4 h-4" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/order/${order.id}`}
                      className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm transition-colors no-underline"
                    >
                      Detaily
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!orders || orders.length === 0) && !loading && (
            <div className="text-center py-8 text-gray-500">Žiadne objednávky neboli nájdené</div>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderListScreen
