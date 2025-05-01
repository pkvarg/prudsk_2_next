import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Get cart items from localStorage for initial state
const cartItemsFromStorage =
  typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cartItems')) || [] : []

const shippingAddressFromStorage =
  typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('shippingAddress')) || {} : {}

const paymentMethodFromStorage =
  typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('paymentMethod')) || null : null

// Async thunk to fetch product info when adding to cart
export const addToCart = createAsyncThunk('cart/addItem', async ({ id, qty }, { dispatch }) => {
  const response = await fetch(`/api/products/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }

  const data = await response.json()

  // Determine if price is discounted
  const isPriceDiscounted = data.discount ? data.discountedPrice : data.price

  // Dispatch to the reducer directly
  dispatch(
    cartSlice.actions.addItem({
      product: data._id,
      name: data.name,
      image: data.image,
      price: isPriceDiscounted,
      countInStock: data.countInStock,
      discount: data.discount,
      qty,
    }),
  )
})

// Create slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentMethodFromStorage,
  },
  reducers: {
    // Add item to cart
    addItem: (state, action) => {
      const item = action.payload
      const existItem = state.cartItems.find((x) => x.product === item.product)

      if (existItem) {
        state.cartItems = state.cartItems.map((x) => (x.product === existItem.product ? item : x))
      } else {
        state.cartItems.push(item)
      }

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
      }
    },

    // Remove item from cart
    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload)

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
      }
    },

    // Remove all items
    removeAll: (state) => {
      state.cartItems = []

      // Remove from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cartItems')
      }
    },

    // Save shipping address
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('shippingAddress', JSON.stringify(action.payload))
      }
    },

    // Save payment method
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('paymentMethod', JSON.stringify(action.payload))
      }
    },
  },
})

// Export actions and reducer
export const { removeItem, removeAll, saveShippingAddress, savePaymentMethod } = cartSlice.actions

export default cartSlice.reducer
