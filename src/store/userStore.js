// src/store/userStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

// Create user store with persistence
const useUserStore = create(
  persist(
    (set, get) => ({
      // Initial state
      userInfo: null,
      loading: false,
      error: null,
      successMessage: null,
      registerSuccess: false,
      registerLoading: false,
      registerError: null,

      // Basic setters
      setUserInfo: (userInfo) => set({ userInfo }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSuccessMessage: (message) => set({ successMessage: message }),

      // Register function
      register: async (name, email, password) => {
        set({ registerLoading: true, registerError: null, registerSuccess: false })
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          }

          const { data } = await axios.post('/api/users', { name, email, password }, config)

          set({
            registerLoading: false,
            registerSuccess: true,
            registerError: null,
          })

          return data
        } catch (error) {
          const errorMessage =
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message

          set({
            registerLoading: false,
            registerError: errorMessage,
            registerSuccess: false,
          })

          throw new Error(errorMessage)
        }
      },

      // Reset register state
      resetRegister: () =>
        set({
          registerLoading: false,
          registerSuccess: false,
          registerError: null,
        }),

      // Password reset functionality
      forgotPassword: async (email, origURL) => {
        set({ loading: true, error: null })
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
            loading: false,
            successMessage: 'Password reset instructions sent to your email',
          })

          return { success: true }
        } catch (error) {
          set({
            loading: false,
            error: error.message,
          })
          throw error
        }
      },

      // State reset functions
      resetState: () =>
        set({
          loading: false,
          error: null,
          successMessage: null,
        }),

      clearUserState: () =>
        set({
          userInfo: null,
          loading: false,
          error: null,
          successMessage: null,
          registerSuccess: false,
          registerLoading: false,
          registerError: null,
        }),
    }),
    {
      name: 'user-storage',
      // Only persist userInfo
      partialize: (state) => ({
        userInfo: state.userInfo,
      }),
    },
  ),
)

export default useUserStore
