import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunks
export const listVideo = createAsyncThunk(
  'video/list',
  async ({ keyword = '', pageNumber = '' }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/video?keyword=${keyword}&pageNumber=${pageNumber}`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch videos')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const listVideoDetails = createAsyncThunk(
  'video/details',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/video/${id}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'cache-control': 'no-cache',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch video details')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const deleteVideo = createAsyncThunk(
  'video/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/video/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to delete video')
      }

      return id // Return the id of the deleted video
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const createVideo = createAsyncThunk(
  'video/create',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch('/api/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to create video')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const updateVideo = createAsyncThunk(
  'video/update',
  async (video, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/video/${video._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(video),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to update video')
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
  videoList: {
    videos: [],
    page: 1,
    pages: 1,
    loading: false,
    error: null,
  },
  videoDetails: {
    video: {},
    loading: false,
    error: null,
  },
  videoDelete: {
    loading: false,
    success: false,
    error: null,
  },
  videoCreate: {
    video: {},
    loading: false,
    success: false,
    error: null,
  },
  videoUpdate: {
    video: {},
    loading: false,
    success: false,
    error: null,
  },
}

// Create slice
const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    resetVideoCreate: (state) => {
      state.videoCreate = {
        video: {},
        loading: false,
        success: false,
        error: null,
      }
    },
    resetVideoUpdate: (state) => {
      state.videoUpdate = {
        video: {},
        loading: false,
        success: false,
        error: null,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // List videos
      .addCase(listVideo.pending, (state) => {
        state.videoList.loading = true
        state.videoList.error = null
      })
      .addCase(listVideo.fulfilled, (state, action) => {
        state.videoList.loading = false
        state.videoList.videos = action.payload.videos
        state.videoList.page = action.payload.page
        state.videoList.pages = action.payload.pages
        state.videoList.error = null
      })
      .addCase(listVideo.rejected, (state, action) => {
        state.videoList.loading = false
        state.videoList.error = action.payload
      })

      // Video details
      .addCase(listVideoDetails.pending, (state) => {
        state.videoDetails.loading = true
        state.videoDetails.error = null
      })
      .addCase(listVideoDetails.fulfilled, (state, action) => {
        state.videoDetails.loading = false
        state.videoDetails.video = action.payload
        state.videoDetails.error = null
      })
      .addCase(listVideoDetails.rejected, (state, action) => {
        state.videoDetails.loading = false
        state.videoDetails.error = action.payload
      })

      // Delete video
      .addCase(deleteVideo.pending, (state) => {
        state.videoDelete.loading = true
        state.videoDelete.error = null
      })
      .addCase(deleteVideo.fulfilled, (state) => {
        state.videoDelete.loading = false
        state.videoDelete.success = true
        state.videoDelete.error = null
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.videoDelete.loading = false
        state.videoDelete.error = action.payload
      })

      // Create video
      .addCase(createVideo.pending, (state) => {
        state.videoCreate.loading = true
        state.videoCreate.error = null
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.videoCreate.loading = false
        state.videoCreate.success = true
        state.videoCreate.video = action.payload
        state.videoCreate.error = null
      })
      .addCase(createVideo.rejected, (state, action) => {
        state.videoCreate.loading = false
        state.videoCreate.error = action.payload
      })

      // Update video
      .addCase(updateVideo.pending, (state) => {
        state.videoUpdate.loading = true
        state.videoUpdate.error = null
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.videoUpdate.loading = false
        state.videoUpdate.success = true
        state.videoUpdate.video = action.payload
        state.videoUpdate.error = null
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.videoUpdate.loading = false
        state.videoUpdate.error = action.payload
      })
  },
})

// Export actions and reducer
export const { resetVideoCreate, resetVideoUpdate } = videoSlice.actions
export default videoSlice.reducer
