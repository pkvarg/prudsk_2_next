// src/store/userStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Create user store with persistence
const useUserStore = create(
  persist(
    (set) => ({
      // Initial state (similar to your Redux userSlice)
      userInfo: null,
      favorites: [],
      loading: false,
      error: null,
      successMessage: null,
      forgotPasswordSuccess: false,
      forgotPasswordLoading: false,
      forgotPasswordError: null,

      // Actions
      setUserInfo: (userInfo) => set({ userInfo }),

      setFavorites: (favorites) => set({ favorites }),

      addToFavorites: async (productId) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(`/api/user/favorites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to add to favorites')
          }

          const data = await response.json()
          set({
            loading: false,
            favorites: data.favorites || [],
            successMessage: 'Produkt byl přidán do oblíbených',
          })
        } catch (error) {
          set({ loading: false, error: error.message })
        }
      },

      removeFromFavorites: async (productId) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(`/api/user/favorites/${productId}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to remove from favorites')
          }

          set((state) => ({
            loading: false,
            favorites: state.favorites.filter((id) => id !== productId),
            successMessage: 'Produkt byl odebrán z oblíbených',
          }))
        } catch (error) {
          set({ loading: false, error: error.message })
        }
      },

      forgotPassword: async (email, origURL) => {
        set({ forgotPasswordLoading: true, forgotPasswordError: null })
        try {
          const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, origURL }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Password reset request failed')
          }

          set({
            forgotPasswordLoading: false,
            forgotPasswordSuccess: true,
            forgotPasswordError: null,
          })
        } catch (error) {
          set({
            forgotPasswordLoading: false,
            forgotPasswordError: error.message,
          })
        }
      },

      resetForgotPassword: () =>
        set({
          forgotPasswordLoading: false,
          forgotPasswordSuccess: false,
          forgotPasswordError: null,
        }),

      resetFavorites: () =>
        set({
          loading: false,
          error: null,
          successMessage: null,
        }),

      clearUserState: () =>
        set({
          userInfo: null,
          favorites: [],
          loading: false,
          error: null,
          successMessage: null,
          forgotPasswordSuccess: false,
          forgotPasswordLoading: false,
          forgotPasswordError: null,
        }),
    }),
    {
      name: 'user-storage', // unique name for localStorage
      // You can customize which parts of the state to persist
      partialize: (state) => ({
        userInfo: state.userInfo,
        favorites: state.favorites,
      }),
    },
  ),
)

export default useUserStore
