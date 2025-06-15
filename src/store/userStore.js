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
      userDetails: {
        loading: false,
        error: null,
        user: null,
        success: false,
        visitorsCount: 0,
      },
      orderListMy: {
        loading: false,
        error: null,
        orders: [],
      },
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
      // Set visitors count
      setVisitorsCount: (count) => set({ visitorsCount: count }),

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

      getUserDetails: async (id) => {
        console.log('in getuserDetails')
        set((state) => ({
          userDetails: { ...state.userDetails, loading: true },
        }))

        try {
          // fetches from api/users/profile
          const response = await fetch(`/api/users/${id}`)
          const data = await response.json()

          set({
            user: data,
          })

          set({
            userDetails: {
              loading: false,
              error: null,
              user: data,
              success: false,
            },
          })
        } catch (error) {
          set((state) => ({
            userDetails: {
              ...state.userDetails,
              loading: false,
              error: error.message,
            },
          }))
        }
      },

      updateUserProfile: async (userData) => {
        console.log('in update userDetails')
        try {
          const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          })
          const data = await response.json()

          set({
            userDetails: {
              loading: false,
              error: null,
              user: data,
              success: true,
            },
          })
        } catch (error) {
          set((state) => ({
            userDetails: {
              ...state.userDetails,
              error: error.message,
            },
          }))
        }
      },

      listMyOrders: async () => {
        set((state) => ({
          orderListMy: { ...state.orderListMy, loading: true },
        }))

        try {
          const response = await fetch('/api/orders/myorders')
          const data = await response.json()

          set({
            orderListMy: {
              loading: false,
              error: null,
              orders: data,
            },
          })
        } catch (error) {
          set((state) => ({
            orderListMy: {
              ...state.orderListMy,
              loading: false,
              error: error.message,
            },
          }))
        }
      },

      resetUserProfile: () => {
        set((state) => ({
          userDetails: {
            ...state.userDetails,
            success: false,
          },
        }))
      },

      listUsers: async () => {
        try {
          set({ loading: true })

          const { data } = await axios.get('/api/users')

          set({
            loading: false,
            users: data,
          })
        } catch (error) {
          set({
            loading: false,
            error:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
          })
        }
      },

      // Delete user (admin only)
      deleteUser: async (id) => {
        try {
          const { userInfo } = get()

          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }

          await axios.delete(`/api/users/${id}`, config)

          set({ successDelete: true })

          // Reset success flag after a short delay
          setTimeout(() => {
            set({ successDelete: false })
          }, 2000)

          // Refresh the user list
          get().listUsers()
        } catch (error) {
          set({
            error:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
          })
        }
      },

      updateUser: async (userData) => {
        try {
          set({
            loadingUpdate: true,
            errorUpdate: null,
          })

          const { userInfo } = get()

          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          }

          const { data } = await axios.put(`/api/users/${userData.id}`, userData, config)

          set({
            loadingUpdate: false,
            successUpdate: true,
            user: data,
          })
        } catch (error) {
          set({
            loadingUpdate: false,
            errorUpdate:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
          })
        }
      },

      // Reset update state
      resetUserUpdate: () => {
        set({
          loadingUpdate: false,
          errorUpdate: null,
          successUpdate: false,
        })
      },
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
