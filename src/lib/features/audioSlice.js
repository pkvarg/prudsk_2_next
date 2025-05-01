import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunks
export const listAudio = createAsyncThunk(
  'audio/list',
  async ({ keyword = '', pageNumber = '' }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/audio?keyword=${keyword}&pageNumber=${pageNumber}`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch audio list')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const listAudioDetails = createAsyncThunk(
  'audio/details',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/audio/${id}`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch audio details')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const deleteAudio = createAsyncThunk(
  'audio/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/audio/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to delete audio')
      }

      return id // Return the id of the deleted audio
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const createAudio = createAsyncThunk(
  'audio/create',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch('/api/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to create audio')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const updateAudio = createAsyncThunk(
  'audio/update',
  async (audio, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/audio/${audio._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(audio),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to update audio')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Initial state
const initialState = {
  audioList: {
    audios: [],
    page: 1,
    pages: 1,
    loading: false,
    error: null,
  },
  audioDetails: {
    audio: {},
    loading: false,
    error: null,
  },
  audioDelete: {
    loading: false,
    success: false,
    error: null,
  },
  audioCreate: {
    audio: {},
    loading: false,
    success: false,
    error: null,
  },
  audioUpdate: {
    audio: {},
    loading: false,
    success: false,
    error: null,
  },
}

// Create slice
const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    resetAudioCreate: (state) => {
      state.audioCreate = {
        audio: {},
        loading: false,
        success: false,
        error: null,
      }
    },
    resetAudioUpdate: (state) => {
      state.audioUpdate = {
        audio: {},
        loading: false,
        success: false,
        error: null,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // List audio reducers
      .addCase(listAudio.pending, (state) => {
        state.audioList.loading = true
        state.audioList.error = null
      })
      .addCase(listAudio.fulfilled, (state, action) => {
        state.audioList.loading = false
        state.audioList.audios = action.payload.audios
        state.audioList.page = action.payload.page
        state.audioList.pages = action.payload.pages
        state.audioList.error = null
      })
      .addCase(listAudio.rejected, (state, action) => {
        state.audioList.loading = false
        state.audioList.error = action.payload
      })

      // Audio details reducers
      .addCase(listAudioDetails.pending, (state) => {
        state.audioDetails.loading = true
        state.audioDetails.error = null
      })
      .addCase(listAudioDetails.fulfilled, (state, action) => {
        state.audioDetails.loading = false
        state.audioDetails.audio = action.payload
        state.audioDetails.error = null
      })
      .addCase(listAudioDetails.rejected, (state, action) => {
        state.audioDetails.loading = false
        state.audioDetails.error = action.payload
      })

      // Delete audio reducers
      .addCase(deleteAudio.pending, (state) => {
        state.audioDelete.loading = true
        state.audioDelete.error = null
      })
      .addCase(deleteAudio.fulfilled, (state) => {
        state.audioDelete.loading = false
        state.audioDelete.success = true
        state.audioDelete.error = null
      })
      .addCase(deleteAudio.rejected, (state, action) => {
        state.audioDelete.loading = false
        state.audioDelete.error = action.payload
      })

      // Create audio reducers
      .addCase(createAudio.pending, (state) => {
        state.audioCreate.loading = true
        state.audioCreate.error = null
      })
      .addCase(createAudio.fulfilled, (state, action) => {
        state.audioCreate.loading = false
        state.audioCreate.success = true
        state.audioCreate.audio = action.payload
        state.audioCreate.error = null
      })
      .addCase(createAudio.rejected, (state, action) => {
        state.audioCreate.loading = false
        state.audioCreate.error = action.payload
      })

      // Update audio reducers
      .addCase(updateAudio.pending, (state) => {
        state.audioUpdate.loading = true
        state.audioUpdate.error = null
      })
      .addCase(updateAudio.fulfilled, (state, action) => {
        state.audioUpdate.loading = false
        state.audioUpdate.success = true
        state.audioUpdate.audio = action.payload
        state.audioUpdate.error = null
      })
      .addCase(updateAudio.rejected, (state, action) => {
        state.audioUpdate.loading = false
        state.audioUpdate.error = action.payload
      })
  },
})

// Export actions and reducer
export const { resetAudioCreate, resetAudioUpdate } = audioSlice.actions
export default audioSlice.reducer
