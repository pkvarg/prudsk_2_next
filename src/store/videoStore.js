// videoStore.js
import { create } from 'zustand'
import axios from 'axios'

const useVideoStore = create((set, get) => ({
  videos: [],
  loading: false,

  // Video list state
  videoList: {
    loading: false,
    videos: [],
    pages: 0,
    page: 0,
    error: null,
  },

  // Video details state
  videoDetails: {
    loading: false,
    video: null,
    error: null,
  },

  // Video delete state
  videoDelete: {
    loading: false,
    success: false,
    error: null,
  },

  // Video create state
  videoCreate: {
    loading: false,
    video: null,
    success: false,
    error: null,
  },

  // Video update state
  videoUpdate: {
    loading: false,
    video: null,
    success: false,
    error: null,
  },

  // Actions
  getAllVideos: async () => {
    try {
      set({
        loading: true,
      })

      const { data } = await axios.get(`/api/video`)

      set((state) => ({
        videos: data.videos,
        loading: false,
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message

      set({
        loading: false,
        error: errorMessage,
      })
    }
  },

  listVideo: async (keyword = '', pageNumber = '') => {
    try {
      set((state) => ({
        videoList: {
          ...state.videoList,
          loading: true,
          error: null,
        },
      }))

      const { data } = await axios.get(`/api/video?keyword=${keyword}&pageNumber=${pageNumber}`)

      set((state) => ({
        videoList: {
          ...state.videoList,
          loading: false,
          videos: data.videos || data,
          pages: data.pages || 1,
          page: data.page || 1,
          error: null,
        },
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message

      set((state) => ({
        videoList: {
          ...state.videoList,
          loading: false,
          error: errorMessage,
        },
      }))
    }
  },

  listVideoDetails: async (id) => {
    try {
      set((state) => ({
        videoDetails: {
          ...state.videoDetails,
          loading: true,
          error: null,
        },
      }))

      const { data } = await axios.get(`/api/video/${id}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'cache-control': 'no-cache',
        },
      })

      set((state) => ({
        videoDetails: {
          ...state.videoDetails,
          loading: false,
          video: data,
          error: null,
        },
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message

      set((state) => ({
        videoDetails: {
          ...state.videoDetails,
          loading: false,
          error: errorMessage,
        },
      }))
    }
  },

  deleteVideo: async (id) => {
    try {
      set((state) => ({
        videoDelete: {
          ...state.videoDelete,
          loading: true,
          error: null,
          success: false,
        },
      }))

      await axios.delete(`/api/video/${id}`)

      set((state) => ({
        videoDelete: {
          ...state.videoDelete,
          loading: false,
          success: true,
          error: null,
        },
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message

      set((state) => ({
        videoDelete: {
          ...state.videoDelete,
          loading: false,
          success: false,
          error: errorMessage,
        },
      }))
    }
  },

  createVideo: async () => {
    try {
      set((state) => ({
        videoCreate: {
          ...state.videoCreate,
          loading: true,
          error: null,
          success: false,
        },
      }))

      const { data } = await axios.post(`/api/video`, {})

      set((state) => ({
        videoCreate: {
          ...state.videoCreate,
          loading: false,
          video: data,
          success: true,
          error: null,
        },
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message

      set((state) => ({
        videoCreate: {
          ...state.videoCreate,
          loading: false,
          success: false,
          error: errorMessage,
        },
      }))
    }
  },

  updateVideo: async (video) => {
    try {
      set((state) => ({
        videoUpdate: {
          ...state.videoUpdate,
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

      const { data } = await axios.put(`/api/video/${video.id || video.id}`, video, config)

      set((state) => ({
        videoUpdate: {
          ...state.videoUpdate,
          loading: false,
          video: data,
          success: true,
          error: null,
        },
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message

      set((state) => ({
        videoUpdate: {
          ...state.videoUpdate,
          loading: false,
          success: false,
          error: errorMessage,
        },
      }))
    }
  },

  // Reset functions
  resetVideoDelete: () => {
    set((state) => ({
      videoDelete: {
        loading: false,
        success: false,
        error: null,
      },
    }))
  },

  resetVideoCreate: () => {
    set((state) => ({
      videoCreate: {
        loading: false,
        video: null,
        success: false,
        error: null,
      },
    }))
  },

  resetVideoUpdate: () => {
    set((state) => ({
      videoUpdate: {
        loading: false,
        video: null,
        success: false,
        error: null,
      },
    }))
  },

  resetVideoDetails: () => {
    set((state) => ({
      videoDetails: {
        loading: false,
        video: null,
        error: null,
      },
    }))
  },
}))

export default useVideoStore
