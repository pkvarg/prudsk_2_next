// useBannerStore.js
import { create } from 'zustand'
import axios from 'axios'

const useBannerStore = create((set, get) => ({
  // Banner list state
  bannerList: {
    loading: false,
    banners: [],
    pages: 0,
    page: 0,
    error: null,
  },

  // Banner details state
  bannerDetails: {
    loading: false,
    banner: null,
    error: null,
  },

  // Banner delete state
  bannerDelete: {
    loading: false,
    success: false,
    error: null,
  },

  // Banner create state
  bannerCreate: {
    loading: false,
    banner: null,
    success: false,
    error: null,
  },

  // Banner update state
  bannerUpdate: {
    loading: false,
    banner: null,
    success: false,
    error: null,
  },

  // Actions
  listBanner: async (keyword = '', pageNumber = '') => {
    try {
      set((state) => ({
        bannerList: {
          ...state.bannerList,
          loading: true,
          error: null,
        },
      }))

      const { data } = await axios.get(`/api/banner?keyword=${keyword}&pageNumber=${pageNumber}`)

      set((state) => ({
        bannerList: {
          ...state.bannerList,
          loading: false,
          banners: data.banners || data,
          pages: data.pages || 1,
          page: data.page || 1,
          error: null,
        },
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message

      set((state) => ({
        bannerList: {
          ...state.bannerList,
          loading: false,
          error: errorMessage,
        },
      }))
    }
  },

  listBannerDetails: async (id) => {
    try {
      set((state) => ({
        bannerDetails: {
          ...state.bannerDetails,
          loading: true,
          error: null,
        },
      }))

      const { data } = await axios.get(`/api/banner/${id}`)

      set((state) => ({
        bannerDetails: {
          ...state.bannerDetails,
          loading: false,
          banner: data,
          error: null,
        },
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message

      set((state) => ({
        bannerDetails: {
          ...state.bannerDetails,
          loading: false,
          error: errorMessage,
        },
      }))
    }
  },

  deleteBanner: async (id) => {
    try {
      set((state) => ({
        bannerDelete: {
          ...state.bannerDelete,
          loading: true,
          error: null,
          success: false,
        },
      }))

      await axios.delete(`/api/banner/${id}`)

      set((state) => ({
        bannerDelete: {
          ...state.bannerDelete,
          loading: false,
          success: true,
          error: null,
        },
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message

      set((state) => ({
        bannerDelete: {
          ...state.bannerDelete,
          loading: false,
          success: false,
          error: errorMessage,
        },
      }))
    }
  },

  createBanner: async () => {
    try {
      set((state) => ({
        bannerCreate: {
          ...state.bannerCreate,
          loading: true,
          error: null,
          success: false,
        },
      }))

      const { data } = await axios.post(`/api/banner`, {})

      set((state) => ({
        bannerCreate: {
          ...state.bannerCreate,
          loading: false,
          banner: data,
          success: true,
          error: null,
        },
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message

      set((state) => ({
        bannerCreate: {
          ...state.bannerCreate,
          loading: false,
          success: false,
          error: errorMessage,
        },
      }))
    }
  },

  updateBanner: async (banner) => {
    try {
      set((state) => ({
        bannerUpdate: {
          ...state.bannerUpdate,
          loading: true,
          error: null,
          success: false,
        },
      }))

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.put(`/api/banner/${banner.id || banner.id}`, banner, config)

      set((state) => ({
        bannerUpdate: {
          ...state.bannerUpdate,
          loading: false,
          banner: data,
          success: true,
          error: null,
        },
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message

      set((state) => ({
        bannerUpdate: {
          ...state.bannerUpdate,
          loading: false,
          success: false,
          error: errorMessage,
        },
      }))
    }
  },

  // Reset functions
  resetBannerDelete: () => {
    set((state) => ({
      bannerDelete: {
        loading: false,
        success: false,
        error: null,
      },
    }))
  },

  resetBannerCreate: () => {
    set((state) => ({
      bannerCreate: {
        loading: false,
        banner: null,
        success: false,
        error: null,
      },
    }))
  },

  resetBannerUpdate: () => {
    set((state) => ({
      bannerUpdate: {
        loading: false,
        banner: null,
        success: false,
        error: null,
      },
    }))
  },

  resetBannerDetails: () => {
    set((state) => ({
      bannerDetails: {
        loading: false,
        banner: null,
        error: null,
      },
    }))
  },
}))

export default useBannerStore
