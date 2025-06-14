// src/store/cartStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      // Initial state
      cartItems: [],
      shippingAddress: {},
      paymentMethod: '',

      // Actions
      addToCart: async (id, qty) => {
        try {
          // Fetch product data from API (like Redux action)
          const response = await fetch(`/api/products/${id}`)
          const data = await response.json()

          // Calculate discounted price (like Redux logic)
          let isPriceDiscounted
          if (data.discount) {
            isPriceDiscounted = data.discountedPrice
          } else {
            isPriceDiscounted = data.price
          }

          // Create cart item object (matching Redux payload)
          const cartItem = {
            product: data.id, // Changed from data._id to data.id for Next.js
            name: data.name,
            image: data.image,
            price: isPriceDiscounted,
            countInStock: data.countInStock,
            discount: data.discount,
            qty: Number(qty), // Ensure qty is a number
          }

          const existItem = get().cartItems.find((x) => x.product === cartItem.product)

          if (existItem) {
            // Update existing item quantity
            set((state) => ({
              cartItems: state.cartItems.map((x) =>
                x.product === existItem.product ? cartItem : x,
              ),
            }))
          } else {
            // Add new item to cart
            set((state) => ({
              cartItems: [...state.cartItems, cartItem],
            }))
          }
        } catch (error) {
          console.error('Error adding to cart:', error)
        }
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter((x) => x.product !== productId),
        }))
      },

      // Renamed to match Redux action name
      removeFromAll: () => {
        set({ cartItems: [] })
        // Note: localStorage is handled automatically by persist middleware
      },

      // Keep clearCart for backward compatibility
      clearCart: () => {
        set({ cartItems: [] })
      },

      // Save shipping address (matching Redux action)
      saveShippingAddress: (data) => {
        set({ shippingAddress: data })
      },

      // Save payment method (matching Redux action)
      savePaymentMethod: (data) => {
        set({ paymentMethod: data })
      },

      // Computed value with method
      getCartTotal: () => {
        return get().cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      },

      // Additional computed values for convenience
      getTotalItems: () => {
        return get().cartItems.reduce((acc, item) => acc + Number(item.qty), 0)
      },

      getShippingPrice: () => {
        // Add your shipping logic here
        return 75 // Fixed shipping price as shown in your cart component
      },

      getFinalTotal: () => {
        const cartTotal = get().getCartTotal()
        const shippingPrice = get().getShippingPrice()
        return cartTotal + shippingPrice
      },
    }),
    {
      name: 'cart-storage', // unique name for localStorage
      // Specify which parts to persist
      partialize: (state) => ({
        cartItems: state.cartItems,
        shippingAddress: state.shippingAddress,
        paymentMethod: state.paymentMethod,
      }),
    },
  ),
)

export default useCartStore
