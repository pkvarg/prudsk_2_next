// useAudioStore.js
import { create } from 'zustand'
import axios from 'axios'

const useAudioStore = create((set, get) => ({
  // Audio list state
  audioList: {
    loading: false,
    audios: [],
    pages: 0,
    page: 0,
    error: null,
  },

  // Audio details state
  audioDetails: {
    loading: false,
    audio: null,
    error: null,
  },

  // Audio delete state
  audioDelete: {
    loading: false,
    success: false,
    error: null,
  },

  // Audio create state
  audioCreate: {
    loading: false,
    audio: null,
    success: false,
    error: null,
  },

  // Audio update state
  audioUpdate: {
    loading: false,
    audio: null,
    success: false,
    error: null,
  },

  // Actions
  listAudio: async (keyword = '', pageNumber = '') => {
    try {
      set((state) => ({
        audioList: {
          ...state.audioList,
          loading: true,
          error: null,
        },
      }))

      const { data } = await axios.get(`/api/audio?keyword=${keyword}&pageNumber=${pageNumber}`)

      set((state) => ({
        audioList: {
          ...state.audioList,
          loading: false,
          audios: data.audios || data,
          pages: data.pages || 1,
          page: data.page || 1,
          error: null,
        },
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message

      set((state) => ({
        audioList: {
          ...state.audioList,
          loading: false,
          error: errorMessage,
        },
      }))
    }
  },

  listAudioDetails: async (id) => {
    try {
      set((state) => ({
        audioDetails: {
          ...state.audioDetails,
          loading: true,
          error: null,
        },
      }))

      console.log('list audio det id', id)

      const { data } = await axios.get(`/api/audio/${id}`)

      set((state) => ({
        audioDetails: {
          ...state.audioDetails,
          loading: false,
          audio: data,
          error: null,
        },
      }))
    } catch (error) {
      console.log('err', error)
      const errorMessage = error.response?.data?.message || error.message

      set((state) => ({
        audioDetails: {
          ...state.audioDetails,
          loading: false,
          error: errorMessage,
        },
      }))
    }
  },

  deleteAudio: async (id) => {
    try {
      set((state) => ({
        audioDelete: {
          ...state.audioDelete,
          loading: true,
          error: null,
          success: false,
        },
      }))

      await axios.delete(`/api/audio/${id}`)

      set((state) => ({
        audioDelete: {
          ...state.audioDelete,
          loading: false,
          success: true,
          error: null,
        },
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message

      set((state) => ({
        audioDelete: {
          ...state.audioDelete,
          loading: false,
          success: false,
          error: errorMessage,
        },
      }))
    }
  },

  createAudio: async () => {
    try {
      set((state) => ({
        audioCreate: {
          ...state.audioCreate,
          loading: true,
          error: null,
          success: false,
        },
      }))

      const { data } = await axios.post(`/api/audio`)

      console.log('create audio', data)

      set((state) => ({
        audioCreate: {
          ...state.audioCreate,
          loading: false,
          audio: data,
          success: true,
          error: null,
        },
      }))
    } catch (error) {
      console.log('this is err', error)
      const errorMessage = error.response?.data?.message || error.message

      set((state) => ({
        audioCreate: {
          ...state.audioCreate,
          loading: false,
          success: false,
          error: errorMessage,
        },
      }))
    }
  },

  updateAudio: async (audio) => {
    try {
      set((state) => ({
        audioUpdate: {
          ...state.audioUpdate,
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

      const { data } = await axios.put(`/api/audio/${audio.id}`, audio, config)

      set((state) => ({
        audioUpdate: {
          ...state.audioUpdate,
          loading: false,
          audio: data,
          success: true,
          error: null,
        },
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message

      set((state) => ({
        audioUpdate: {
          ...state.audioUpdate,
          loading: false,
          success: false,
          error: errorMessage,
        },
      }))
    }
  },

  // Reset functions
  resetAudioDelete: () => {
    set((state) => ({
      audioDelete: {
        loading: false,
        success: false,
        error: null,
      },
    }))
  },

  resetAudioCreate: () => {
    set((state) => ({
      audioCreate: {
        loading: false,
        audio: null,
        success: false,
        error: null,
      },
    }))
  },

  resetAudioUpdate: () => {
    set((state) => ({
      audioUpdate: {
        loading: false,
        audio: null,
        success: false,
        error: null,
      },
    }))
  },

  resetAudioDetails: () => {
    set((state) => ({
      audioDetails: {
        loading: false,
        audio: null,
        error: null,
      },
    }))
  },
}))

export default useAudioStore
