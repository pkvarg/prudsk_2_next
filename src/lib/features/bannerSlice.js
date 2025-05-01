import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunks
export const listBanner = createAsyncThunk(
  'banner/list',
  async ({ keyword = '', pageNumber = '' }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/banner?keyword=${keyword}&pageNumber=${pageNumber}`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch banner list')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const listBannerDetails = createAsyncThunk(
  'banner/details',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/banner/${id}`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch banner details')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const deleteBanner = createAsyncThunk(
  'banner/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/banner/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to delete banner')
      }

      return id // Return the id of the deleted banner
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const createBanner = createAsyncThunk(
  'banner/create',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch('/api/banner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to create banner')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const updateBanner = createAsyncThunk(
  'banner/update',
  async (banner, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/banner/${banner._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(banner),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to update banner')
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
  bannerList: {
    banners: [],
    page: 1,
    pages: 1,
    loading: false,
    error: null,
  },
  bannerDetails: {
    banner: {},
    loading: false,
    error: null,
  },
  bannerDelete: {
    loading: false,
    success: false,
    error: null,
  },
  bannerCreate: {
    banner: {},
    loading: false,
    success: false,
    error: null,
  },
  bannerUpdate: {
    banner: {},
    loading: false,
    success: false,
    error: null,
  },
}

// Create slice
const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    resetBannerCreate: (state) => {
      state.bannerCreate = {
        banner: {},
        loading: false,
        success: false,
        error: null,
      }
    },
    resetBannerUpdate: (state) => {
      state.bannerUpdate = {
        banner: {},
        loading: false,
        success: false,
        error: null,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // List banner reducers
      .addCase(listBanner.pending, (state) => {
        state.bannerList.loading = true
        state.bannerList.error = null
      })
      .addCase(listBanner.fulfilled, (state, action) => {
        state.bannerList.loading = false
        state.bannerList.banners = action.payload.banners
        state.bannerList.page = action.payload.page
        state.bannerList.pages = action.payload.pages
        state.bannerList.error = null
      })
      .addCase(listBanner.rejected, (state, action) => {
        state.bannerList.loading = false
        state.bannerList.error = action.payload
      })

      // Banner details reducers
      .addCase(listBannerDetails.pending, (state) => {
        state.bannerDetails.loading = true
        state.bannerDetails.error = null
      })
      .addCase(listBannerDetails.fulfilled, (state, action) => {
        state.bannerDetails.loading = false
        state.bannerDetails.banner = action.payload
        state.bannerDetails.error = null
      })
      .addCase(listBannerDetails.rejected, (state, action) => {
        state.bannerDetails.loading = false
        state.bannerDetails.error = action.payload
      })

      // Delete banner reducers
      .addCase(deleteBanner.pending, (state) => {
        state.bannerDelete.loading = true
        state.bannerDelete.error = null
      })
      .addCase(deleteBanner.fulfilled, (state) => {
        state.bannerDelete.loading = false
        state.bannerDelete.success = true
        state.bannerDelete.error = null
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.bannerDelete.loading = false
        state.bannerDelete.error = action.payload
      })

      // Create banner reducers
      .addCase(createBanner.pending, (state) => {
        state.bannerCreate.loading = true
        state.bannerCreate.error = null
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.bannerCreate.loading = false
        state.bannerCreate.success = true
        state.bannerCreate.banner = action.payload
        state.bannerCreate.error = null
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.bannerCreate.loading = false
        state.bannerCreate.error = action.payload
      })

      // Update banner reducers
      .addCase(updateBanner.pending, (state) => {
        state.bannerUpdate.loading = true
        state.bannerUpdate.error = null
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.bannerUpdate.loading = false
        state.bannerUpdate.success = true
        state.bannerUpdate.banner = action.payload
        state.bannerUpdate.error = null
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.bannerUpdate.loading = false
        state.bannerUpdate.error = action.payload
      })
  },
})

// Export actions and reducer
export const { resetBannerCreate, resetBannerUpdate } = bannerSlice.actions
export default bannerSlice.reducer
