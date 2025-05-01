import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Create Order
export const createOrder = createAsyncThunk(
  'order/create',
  async (order, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(order),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to create order')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Get Order Details
export const getOrderDetails = createAsyncThunk(
  'order/details',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch order details')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Pay Order
export const payOrder = createAsyncThunk(
  'order/pay',
  async ({ orderId, paymentResult }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(paymentResult),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Payment failed')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Pay Order with Stripe
export const payOrderStripe = createAsyncThunk(
  'order/payStripe',
  async (order, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/orders/${order._id}/pay-stripe`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(order),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Stripe payment failed')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Deliver Order
export const deliverOrder = createAsyncThunk(
  'order/deliver',
  async (order, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/orders/${order._id}/deliver`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to mark as delivered')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Paid Order (marked as paid by admin)
export const paidOrder = createAsyncThunk(
  'order/paid',
  async (order, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/orders/${order._id}/paid`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to mark as paid')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Resend Confirmation Email
export const resendConfirmationEmailWithInvoice = createAsyncThunk(
  'order/resendConfirmation',
  async (order, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/orders/${order._id}/resend-confirmation`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to resend confirmation email')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Cancel Order
export const cancelOrder = createAsyncThunk(
  'order/cancel',
  async (order, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/orders/${order._id}/cancell`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to cancel order')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// List My Orders
export const listMyOrders = createAsyncThunk(
  'order/listMy',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch('/api/orders/myorders', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch your orders')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// List All Orders (Admin)
export const listOrders = createAsyncThunk(
  'order/list',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch orders')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Delete Order
export const deleteOrder = createAsyncThunk(
  'order/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to delete order')
      }

      return id // Return the ID of the deleted order
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Initial state
const initialState = {
  orderCreate: {
    loading: false,
    success: false,
    error: null,
    order: null,
  },
  orderDetails: {
    loading: true,
    order: { orderItems: [], shippingAddress: {} },
    error: null,
  },
  orderPay: {
    loading: false,
    success: false,
    error: null,
  },
  orderDeliver: {
    loading: false,
    success: false,
    error: null,
  },
  orderPaid: {
    loading: false,
    success: false,
    error: null,
  },
  confirmationEmail: {
    loading: false,
    success: false,
    error: null,
  },
  orderCancel: {
    loading: false,
    success: false,
    error: null,
  },
  orderListMy: {
    loading: false,
    orders: [],
    error: null,
  },
  orderList: {
    loading: false,
    orders: [],
    error: null,
  },
  orderDelete: {
    loading: false,
    success: false,
    error: null,
  },
}

// Create slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderCreate: (state) => {
      state.orderCreate = {
        loading: false,
        success: false,
        error: null,
        order: null,
      }
    },
    resetOrderPay: (state) => {
      state.orderPay = {
        loading: false,
        success: false,
        error: null,
      }
    },
    resetOrderDeliver: (state) => {
      state.orderDeliver = {
        loading: false,
        success: false,
        error: null,
      }
    },
    resetOrderPaid: (state) => {
      state.orderPaid = {
        loading: false,
        success: false,
        error: null,
      }
    },
    resetConfirmationEmail: (state) => {
      state.confirmationEmail = {
        loading: false,
        success: false,
        error: null,
      }
    },
    resetOrderCancel: (state) => {
      state.orderCancel = {
        loading: false,
        success: false,
        error: null,
      }
    },
    resetOrderListMy: (state) => {
      state.orderListMy = {
        loading: false,
        orders: [],
        error: null,
      }
    },
    resetOrderDelete: (state) => {
      state.orderDelete = {
        loading: false,
        success: false,
        error: null,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.orderCreate.loading = true
        state.orderCreate.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderCreate.loading = false
        state.orderCreate.success = true
        state.orderCreate.order = action.payload
        state.orderCreate.error = null
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderCreate.loading = false
        state.orderCreate.error = action.payload
      })

      // Order details
      .addCase(getOrderDetails.pending, (state) => {
        state.orderDetails.loading = true
        state.orderDetails.error = null
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.orderDetails.loading = false
        state.orderDetails.order = action.payload
        state.orderDetails.error = null
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.orderDetails.loading = false
        state.orderDetails.error = action.payload
      })

      // Pay order - handles both payOrder and payOrderStripe
      .addCase(payOrder.pending, (state) => {
        state.orderPay.loading = true
        state.orderPay.error = null
      })
      .addCase(payOrder.fulfilled, (state) => {
        state.orderPay.loading = false
        state.orderPay.success = true
        state.orderPay.error = null
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.orderPay.loading = false
        state.orderPay.error = action.payload
      })

      // Pay order stripe
      .addCase(payOrderStripe.pending, (state) => {
        state.orderPay.loading = true
        state.orderPay.error = null
      })
      .addCase(payOrderStripe.fulfilled, (state) => {
        state.orderPay.loading = false
        state.orderPay.success = true
        state.orderPay.error = null
      })
      .addCase(payOrderStripe.rejected, (state, action) => {
        state.orderPay.loading = false
        state.orderPay.error = action.payload
      })

      // Deliver order
      .addCase(deliverOrder.pending, (state) => {
        state.orderDeliver.loading = true
        state.orderDeliver.error = null
      })
      .addCase(deliverOrder.fulfilled, (state) => {
        state.orderDeliver.loading = false
        state.orderDeliver.success = true
        state.orderDeliver.error = null
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.orderDeliver.loading = false
        state.orderDeliver.error = action.payload
      })

      // Paid order (mark as paid)
      .addCase(paidOrder.pending, (state) => {
        state.orderPaid.loading = true
        state.orderPaid.error = null
      })
      .addCase(paidOrder.fulfilled, (state) => {
        state.orderPaid.loading = false
        state.orderPaid.success = true
        state.orderPaid.error = null
      })
      .addCase(paidOrder.rejected, (state, action) => {
        state.orderPaid.loading = false
        state.orderPaid.error = action.payload
      })

      // Resend confirmation email
      .addCase(resendConfirmationEmailWithInvoice.pending, (state) => {
        state.confirmationEmail.loading = true
        state.confirmationEmail.error = null
      })
      .addCase(resendConfirmationEmailWithInvoice.fulfilled, (state) => {
        state.confirmationEmail.loading = false
        state.confirmationEmail.success = true
        state.confirmationEmail.error = null
      })
      .addCase(resendConfirmationEmailWithInvoice.rejected, (state, action) => {
        state.confirmationEmail.loading = false
        state.confirmationEmail.error = action.payload
      })

      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.orderCancel.loading = true
        state.orderCancel.error = null
      })
      .addCase(cancelOrder.fulfilled, (state) => {
        state.orderCancel.loading = false
        state.orderCancel.success = true
        state.orderCancel.error = null
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.orderCancel.loading = false
        state.orderCancel.error = action.payload
      })

      // List my orders
      .addCase(listMyOrders.pending, (state) => {
        state.orderListMy.loading = true
        state.orderListMy.error = null
      })
      .addCase(listMyOrders.fulfilled, (state, action) => {
        state.orderListMy.loading = false
        state.orderListMy.orders = action.payload
        state.orderListMy.error = null
      })
      .addCase(listMyOrders.rejected, (state, action) => {
        state.orderListMy.loading = false
        state.orderListMy.error = action.payload
      })

      // List all orders (admin)
      .addCase(listOrders.pending, (state) => {
        state.orderList.loading = true
        state.orderList.error = null
      })
      .addCase(listOrders.fulfilled, (state, action) => {
        state.orderList.loading = false
        state.orderList.orders = action.payload
        state.orderList.error = null
      })
      .addCase(listOrders.rejected, (state, action) => {
        state.orderList.loading = false
        state.orderList.error = action.payload
      })

      // Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.orderDelete.loading = true
        state.orderDelete.error = null
      })
      .addCase(deleteOrder.fulfilled, (state) => {
        state.orderDelete.loading = false
        state.orderDelete.success = true
        state.orderDelete.error = null
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.orderDelete.loading = false
        state.orderDelete.error = action.payload
      })
  },
})

// Export actions and reducer
export const {
  resetOrderCreate,
  resetOrderPay,
  resetOrderDeliver,
  resetOrderPaid,
  resetConfirmationEmail,
  resetOrderCancel,
  resetOrderListMy,
  resetOrderDelete,
} = orderSlice.actions

export default orderSlice.reducer
