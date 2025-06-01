// src/store/orderStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const useOrderStore = create((set, get) => ({
  // State for all orders (admin)
  orders: [],
  loading: false,
  error: null,

  // State for order creation
  createdOrder: null,
  loadingCreate: false,
  errorCreate: null,
  successCreate: false,

  // State for order details
  orderDetails: null,
  loadingDetails: false,
  errorDetails: null,

  // State for order payment
  loadingPay: false,
  errorPay: null,
  successPay: false,

  // State for order delivery
  loadingDeliver: false,
  errorDeliver: null,
  successDeliver: false,

  // State for marking order as paid
  loadingPaid: false,
  errorPaid: null,
  successPaid: false,

  // State for confirmation email
  loadingConfirmationEmail: false,
  errorConfirmationEmail: null,
  successConfirmationEmail: false,

  // State for order cancellation
  loadingCancell: false,
  errorCancell: null,
  successCancell: false,

  // State for user's orders
  myOrders: [],
  loadingMyOrders: false,
  errorMyOrders: null,

  // State for order deletion
  loadingDelete: false,
  errorDelete: null,
  successDelete: false,

  // Helper function to get auth header
  getAuthConfig: () => {
    // You'll need to get userInfo from your auth store
    // This assumes you have access to userInfo somehow
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
  },

  // Reset functions
  resetCreate: () =>
    set({
      createdOrder: null,
      loadingCreate: false,
      errorCreate: null,
      successCreate: false,
    }),

  resetPay: () =>
    set({
      loadingPay: false,
      errorPay: null,
      successPay: false,
    }),

  resetDeliver: () =>
    set({
      loadingDeliver: false,
      errorDeliver: null,
      successDeliver: false,
    }),

  resetPaid: () =>
    set({
      loadingPaid: false,
      errorPaid: null,
      successPaid: false,
    }),

  resetConfirmationEmail: () =>
    set({
      loadingConfirmationEmail: false,
      errorConfirmationEmail: null,
      successConfirmationEmail: false,
    }),

  resetCancell: () =>
    set({
      loadingCancell: false,
      errorCancell: null,
      successCancell: false,
    }),

  resetDelete: () =>
    set({
      loadingDelete: false,
      errorDelete: null,
      successDelete: false,
    }),

  // Create Order
  createOrder: async (order) => {
    try {
      set({ loadingCreate: true, errorCreate: null })

      const config = get().getAuthConfig()
      const { data } = await axios.post(`/api/orders/`, order, config)

      set({
        loadingCreate: false,
        successCreate: true,
        createdOrder: data,
      })

      return data
    } catch (error) {
      set({
        loadingCreate: false,
        errorCreate: error.response?.data?.message || error.message,
      })
      throw error
    }
  },

  // Get Order Details OK
  getOrderDetails: async (id) => {
    try {
      set({ loadingDetails: true, errorDetails: null })

      const { data } = await axios.get(`/api/orders/${id}`)

      set({
        loadingDetails: false,
        orderDetails: data,
      })
    } catch (error) {
      set({
        loadingDetails: false,
        errorDetails: error.response?.data?.message || error.message,
      })
      throw error
    }
  },

  // Pay Order
  payOrder: async (orderId, paymentResult) => {
    try {
      set({ loadingPay: true, errorPay: null })

      const config = get().getAuthConfig()
      const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config)

      set({
        loadingPay: false,
        successPay: true,
      })

      return data
    } catch (error) {
      set({
        loadingPay: false,
        errorPay: error.response?.data?.message || error.message,
      })
      throw error
    }
  },

  // Pay Order with Stripe
  payOrderStripe: async (order) => {
    try {
      set({ loadingPay: true, errorPay: null })

      const config = get().getAuthConfig()
      const { data } = await axios.put(`/api/orders/${order._id}/pay-stripe`, order, config)

      set({
        loadingPay: false,
        successPay: true,
      })

      return data
    } catch (error) {
      set({
        loadingPay: false,
        errorPay: error.response?.data?.message || error.message,
      })
      throw error
    }
  },

  // Deliver Order OK
  deliverOrder: async (id) => {
    try {
      set({ loadingDeliver: true, errorDeliver: null })

      const { data } = await axios.put(`/api/orders/${id}/deliver`)

      set({
        loadingDeliver: false,
        successDeliver: true,
      })

      return data
    } catch (error) {
      set({
        loadingDeliver: false,
        errorDeliver: error.response?.data?.message || error.message,
      })
      throw error
    }
  },

  // Mark Order as Paid OK
  paidOrder: async (id) => {
    try {
      set({ loadingPaid: true, errorPaid: null })

      await axios.put(`/api/orders/${id}/paid`)

      set({
        loadingPaid: false,
        successPaid: true,
      })
    } catch (error) {
      set({
        loadingPaid: false,
        errorPaid: error.response?.data?.message || error.message,
      })
      throw error
    }
  },

  // Resend Confirmation Email
  resendConfirmationEmailWithInvoice: async (id) => {
    try {
      set({ loadingConfirmationEmail: true, errorConfirmationEmail: null })

      await axios.put(`/api/orders/${id}/resend-confirmation`)

      set({
        loadingConfirmationEmail: false,
        successConfirmationEmail: true,
      })
    } catch (error) {
      set({
        loadingConfirmationEmail: false,
        errorConfirmationEmail: error.response?.data?.message || error.message,
      })
      throw error
    }
  },

  // Cancel Order
  cancellOrder: async (order) => {
    try {
      set({ loadingCancell: true, errorCancell: null })

      const config = get().getAuthConfig()
      const { data } = await axios.put(`/api/orders/${order._id}/cancell`, {}, config)

      set({
        loadingCancell: false,
        successCancell: true,
      })

      return data
    } catch (error) {
      set({
        loadingCancell: false,
        errorCancell: error.response?.data?.message || error.message,
      })
      throw error
    }
  },

  // List My Orders
  listMyOrders: async () => {
    try {
      set({ loadingMyOrders: true, errorMyOrders: null })

      const config = get().getAuthConfig()
      const { data } = await axios.get(`/api/orders/myorders`, config)

      set({
        loadingMyOrders: false,
        myOrders: data,
      })

      return data
    } catch (error) {
      set({
        loadingMyOrders: false,
        errorMyOrders: error.response?.data?.message || error.message,
      })
      throw error
    }
  },

  // List All Orders (Admin)
  listOrders: async () => {
    try {
      set({ loading: true, error: null })

      const config = get().getAuthConfig()
      const { data } = await axios.get(`/api/orders`, config)

      set({
        loading: false,
        orders: data,
      })

      return data
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || error.message,
      })
      throw error
    }
  },

  // Delete Order
  deleteOrder: async (id) => {
    try {
      set({ loadingDelete: true, errorDelete: null })

      const config = get().getAuthConfig()
      await axios.delete(`/api/orders/${id}`, config)

      set({
        loadingDelete: false,
        successDelete: true,
        // Remove the deleted order from the orders array
        orders: get().orders.filter((order) => order._id !== id),
      })

      return true
    } catch (error) {
      set({
        loadingDelete: false,
        errorDelete: error.response?.data?.message || error.message,
      })
      throw error
    }
  },
}))

export default useOrderStore
