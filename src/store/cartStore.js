// src/store/cartStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      // Initial state
      cartItems: [],

      // Actions
      addToCart: (item) => {
        const existItem = get().cartItems.find((x) => x.product === item.product)

        if (existItem) {
          set((state) => ({
            cartItems: state.cartItems.map((x) => (x.product === existItem.product ? item : x)),
          }))
        } else {
          set((state) => ({
            cartItems: [...state.cartItems, item],
          }))
        }
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter((x) => x.product !== productId),
        }))
      },

      clearCart: () => set({ cartItems: [] }),

      // Computed value with method
      getCartTotal: () => {
        return get().cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      },
    }),
    {
      name: 'cart-storage', // unique name for localStorage
    },
  ),
)

export default useCartStore
