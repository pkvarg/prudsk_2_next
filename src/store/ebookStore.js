// useEbookStore.js
import { create } from 'zustand'
import axios from 'axios'

const HONO_UPLOAD_URL = (() => {
  if (typeof window === 'undefined') return 'https://hono-api.pictusweb.com'
  if (window.location.hostname === 'localhost') return 'http://localhost:3013'
  return 'https://hono-api.pictusweb.com'
})()

const useEbookStore = create((set, get) => ({
  ebookList: {
    loading: false,
    ebooks: [],
    error: null,
  },

  ebookDetails: {
    loading: false,
    ebook: null,
    error: null,
  },

  ebookCreate: {
    loading: false,
    ebook: null,
    success: false,
    error: null,
  },

  ebookUpdate: {
    loading: false,
    ebook: null,
    success: false,
    error: null,
  },

  ebookDelete: {
    loading: false,
    success: false,
    error: null,
  },

  listEbooks: async ({ includeDeleted = false } = {}) => {
    try {
      set((state) => ({
        ebookList: { ...state.ebookList, loading: true, error: null },
      }))

      const { data } = await axios.get(
        `/api/ebooks${includeDeleted ? '?includeDeleted=true' : ''}`,
      )

      set((state) => ({
        ebookList: {
          ...state.ebookList,
          loading: false,
          ebooks: data.ebooks || [],
          error: null,
        },
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message
      set((state) => ({
        ebookList: { ...state.ebookList, loading: false, error: errorMessage },
      }))
    }
  },

  getEbookDetails: async (id) => {
    try {
      set((state) => ({
        ebookDetails: { ...state.ebookDetails, loading: true, error: null },
      }))

      const { data } = await axios.get(`/api/ebooks/${id}`)

      set((state) => ({
        ebookDetails: { loading: false, ebook: data, error: null },
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message
      set((state) => ({
        ebookDetails: { ...state.ebookDetails, loading: false, error: errorMessage },
      }))
    }
  },

  createEbook: async (payload) => {
    try {
      set((state) => ({
        ebookCreate: { ...state.ebookCreate, loading: true, error: null, success: false },
      }))

      const { data } = await axios.post(`/api/ebooks`, payload || {})

      set((state) => ({
        ebookCreate: { loading: false, ebook: data, success: true, error: null },
      }))

      return data
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message
      set((state) => ({
        ebookCreate: { ...state.ebookCreate, loading: false, success: false, error: errorMessage },
      }))
      throw error
    }
  },

  updateEbook: async (id, payload) => {
    try {
      set((state) => ({
        ebookUpdate: { ...state.ebookUpdate, loading: true, error: null, success: false },
      }))

      const { data } = await axios.patch(`/api/ebooks/${id}`, payload)

      set((state) => ({
        ebookUpdate: { loading: false, ebook: data, success: true, error: null },
      }))

      return data
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message
      set((state) => ({
        ebookUpdate: { ...state.ebookUpdate, loading: false, success: false, error: errorMessage },
      }))
      throw error
    }
  },

  softDeleteEbook: async (id) => {
    try {
      set((state) => ({
        ebookDelete: { loading: true, success: false, error: null },
      }))

      await axios.delete(`/api/ebooks/${id}`)

      set({ ebookDelete: { loading: false, success: true, error: null } })
      get().listEbooks({ includeDeleted: true })
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message
      set({ ebookDelete: { loading: false, success: false, error: errorMessage } })
    }
  },

  restoreEbook: async (id) => {
    try {
      await axios.post(`/api/ebooks/${id}/restore`)
      get().listEbooks({ includeDeleted: true })
    } catch (error) {
      console.error('Restore ebook failed:', error)
    }
  },

  uploadEbookFiles: async ({ ebookId, pdf, qrCode, bookImage }) => {
    const formData = new FormData()
    formData.append('ebookId', ebookId)
    if (pdf) formData.append('pdf', pdf)
    if (qrCode) formData.append('qrCode', qrCode)
    if (bookImage) formData.append('bookImage', bookImage)

    const response = await fetch(`${HONO_UPLOAD_URL}/api/upload/prudsk2next/ebooks`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Nepodarilo sa nahrať súbory')
    }

    return response.json()
  },

  resetEbookCreate: () => {
    set({ ebookCreate: { loading: false, ebook: null, success: false, error: null } })
  },

  resetEbookUpdate: () => {
    set({ ebookUpdate: { loading: false, ebook: null, success: false, error: null } })
  },

  resetEbookDelete: () => {
    set({ ebookDelete: { loading: false, success: false, error: null } })
  },

  resetEbookDetails: () => {
    set({ ebookDetails: { loading: false, ebook: null, error: null } })
  },
}))

export default useEbookStore
