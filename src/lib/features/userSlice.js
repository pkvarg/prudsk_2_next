// store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Initially empty slice since we're using NextAuth for authentication
const initialState = {
  // These will be populated from session data
  favorites: [],
  loading: false,
  error: null,
  successMessage: null,
  forgotPasswordSuccess: false,
  forgotPasswordLoading: false,
  forgotPasswordError: null,
}

// Handle operations not covered by NextAuth
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async ({ email, origURL }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, origURL }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Password reset request failed')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const addToUserFavorites = createAsyncThunk(
  'user/addToFavorites',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/user/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to add to favorites')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const removeFromUserFavorites = createAsyncThunk(
  'user/removeFromFavorites',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/user/favorites/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to remove from favorites')
      }

      return productId // Return the id of the removed product
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Reset actions for various operations
    resetForgotPassword: (state) => {
      state.forgotPasswordLoading = false
      state.forgotPasswordSuccess = false
      state.forgotPasswordError = null
    },
    resetFavorites: (state) => {
      state.loading = false
      state.error = null
      state.successMessage = null
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload
    },
    clearUserState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Forgot password reducers
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordLoading = true
        state.forgotPasswordError = null
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordLoading = false
        state.forgotPasswordSuccess = true
        state.forgotPasswordError = null
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordLoading = false
        state.forgotPasswordError = action.payload
      })

      // Add to favorites reducers
      .addCase(addToUserFavorites.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addToUserFavorites.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = 'Produkt byl přidán do oblíbených'
        // Update favorites if returned from API
        if (action.payload.favorites) {
          state.favorites = action.payload.favorites
        }
      })
      .addCase(addToUserFavorites.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Remove from favorites reducers
      .addCase(removeFromUserFavorites.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeFromUserFavorites.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = 'Produkt byl odebrán z oblíbených'
        // Remove the product from favorites
        state.favorites = state.favorites.filter((id) => id !== action.payload)
      })
      .addCase(removeFromUserFavorites.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

// Export actions and reducer
export const { resetForgotPassword, resetFavorites, setFavorites, clearUserState } =
  userSlice.actions

export default userSlice.reducer
