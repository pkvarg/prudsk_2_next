import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Get user info from localStorage for initial state
const userInfoFromStorage =
  typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo')) || null : null

// Async Thunks
export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Login failed')
      }

      const data = await response.json()

      // Save to localStorage
      localStorage.setItem('userInfo', JSON.stringify(data))

      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const getGoogleUserInfo = createAsyncThunk(
  'user/googleLogin',
  async (dataInfo, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/currentuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataInfo }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Google login failed')
      }

      const data = await response.json()

      // Save to localStorage
      localStorage.setItem('userInfo', JSON.stringify(data))

      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

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

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ user, token }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.message === 'Not authorized, token failed') {
          dispatch(logoutAndRedirect())
        }
        return rejectWithValue(errorData.message || 'Password reset failed')
      }

      const data = await response.json()

      // Save to localStorage
      localStorage.setItem('userInfo', JSON.stringify(data))

      return data
    } catch (error) {
      if (error.message === 'Not authorized, token failed') {
        dispatch(logoutAndRedirect())
      }
      return rejectWithValue(error.message)
    }
  },
)

export const register = createAsyncThunk(
  'user/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Registration failed')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const getUserDetails = createAsyncThunk(
  'user/details',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.message === 'Not authorized, token failed') {
          dispatch(logoutAndRedirect())
        }
        return rejectWithValue(errorData.message || 'Failed to fetch user details')
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error.message === 'Not authorized, token failed') {
        dispatch(logoutAndRedirect())
      }
      return rejectWithValue(error.message)
    }
  },
)

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (user, { getState, rejectWithValue, dispatch }) => {
    try {
      const {
        user: { userInfo },
      } = getState()

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.message === 'Not authorized, token failed') {
          dispatch(logoutAndRedirect())
        }
        return rejectWithValue(errorData.message || 'Profile update failed')
      }

      const data = await response.json()

      // Save updated info to localStorage
      localStorage.setItem('userInfo', JSON.stringify(data))

      return data
    } catch (error) {
      if (error.message === 'Not authorized, token failed') {
        dispatch(logoutAndRedirect())
      }
      return rejectWithValue(error.message)
    }
  },
)

export const listUsers = createAsyncThunk(
  'user/listUsers',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const {
        user: { userInfo },
      } = getState()

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.message === 'Not authorized, token failed') {
          dispatch(logoutAndRedirect())
        }
        return rejectWithValue(errorData.message || 'Failed to fetch users')
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error.message === 'Not authorized, token failed') {
        dispatch(logoutAndRedirect())
      }
      return rejectWithValue(error.message)
    }
  },
)

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const {
        user: { userInfo },
      } = getState()

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.message === 'Not authorized, token failed') {
          dispatch(logoutAndRedirect())
        }
        return rejectWithValue(errorData.message || 'Failed to delete user')
      }

      return id // Return the id of the deleted user
    } catch (error) {
      if (error.message === 'Not authorized, token failed') {
        dispatch(logoutAndRedirect())
      }
      return rejectWithValue(error.message)
    }
  },
)

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user, { getState, rejectWithValue, dispatch }) => {
    try {
      const {
        user: { userInfo },
      } = getState()

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.message === 'Not authorized, token failed') {
          dispatch(logoutAndRedirect())
        }
        return rejectWithValue(errorData.message || 'Failed to update user')
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error.message === 'Not authorized, token failed') {
        dispatch(logoutAndRedirect())
      }
      return rejectWithValue(error.message)
    }
  },
)

export const addToUserFavorites = createAsyncThunk(
  'user/addToFavorites',
  async (productId, { getState, rejectWithValue, dispatch }) => {
    try {
      const {
        user: { userInfo },
      } = getState()

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const userId = userInfo._id

      const response = await fetch(`/api/users/${userId}/favorites`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.message === 'Not authorized, token failed') {
          dispatch(logoutAndRedirect())
        }
        return rejectWithValue(errorData.message || 'Failed to add to favorites')
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error.message === 'Not authorized, token failed') {
        dispatch(logoutAndRedirect())
      }
      return rejectWithValue(error.message)
    }
  },
)

// Initial state
const initialState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
  users: [],
  user: {},
  success: false,
  updateSuccess: false,
  forgotPasswordSuccess: false,
  forgotPasswordLoading: false,
  forgotPasswordError: null,
  resetPasswordSuccess: false,
  resetPasswordLoading: false,
  resetPasswordError: null,
  registerSuccess: false,
  registerLoading: false,
  registerError: null,
  detailsLoading: false,
  detailsError: null,
  updateProfileLoading: false,
  updateProfileSuccess: false,
  updateProfileError: null,
  listLoading: false,
  listError: null,
  deleteLoading: false,
  deleteSuccess: false,
  deleteError: null,
  updateLoading: false,
  updateError: null,
  favoritesLoading: false,
  favoritesSuccess: false,
  favoritesError: null,
}

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userInfo')
        localStorage.removeItem('cartItems')
        localStorage.removeItem('shippingAddress')
        localStorage.removeItem('paymentMethod')
      }
      return {
        ...initialState,
        userInfo: null,
      }
    },
    resetUserDetails: (state) => {
      state.user = {}
      state.detailsLoading = false
      state.detailsError = null
    },
    resetUserList: (state) => {
      state.users = []
      state.listLoading = false
      state.listError = null
    },
    resetFavorites: (state) => {
      state.favoritesLoading = false
      state.favoritesSuccess = false
      state.favoritesError = null
    },
    resetUpdateProfile: (state) => {
      state.updateProfileLoading = false
      state.updateProfileSuccess = false
      state.updateProfileError = null
    },
    resetUpdate: (state) => {
      state.updateLoading = false
      state.updateSuccess = false
      state.updateError = null
      state.user = {}
    },
    resetRegister: (state) => {
      state.registerLoading = false
      state.registerSuccess = false
      state.registerError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login reducers
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Google login reducers
      .addCase(getGoogleUserInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getGoogleUserInfo.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload
        state.error = null
      })
      .addCase(getGoogleUserInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Forgot password reducers
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordLoading = true
        state.forgotPasswordError = null
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPasswordLoading = false
        state.forgotPasswordSuccess = true
        state.forgotPasswordError = null
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordLoading = false
        state.forgotPasswordError = action.payload
      })

      // Reset password reducers
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true
        state.resetPasswordError = null
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordLoading = false
        state.userInfo = action.payload
        state.resetPasswordSuccess = true
        state.resetPasswordError = null
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false
        state.resetPasswordError = action.payload
      })

      // Register reducers
      .addCase(register.pending, (state) => {
        state.registerLoading = true
        state.registerError = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registerLoading = false
        state.registerSuccess = true
        state.registerError = null
      })
      .addCase(register.rejected, (state, action) => {
        state.registerLoading = false
        state.registerError = action.payload
      })

      // User details reducers
      .addCase(getUserDetails.pending, (state) => {
        state.detailsLoading = true
        state.detailsError = null
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.detailsLoading = false
        state.user = action.payload
        state.detailsError = null
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.detailsLoading = false
        state.detailsError = action.payload
      })

      // Update profile reducers
      .addCase(updateUserProfile.pending, (state) => {
        state.updateProfileLoading = true
        state.updateProfileError = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateProfileLoading = false
        state.userInfo = action.payload
        state.updateProfileSuccess = true
        state.updateProfileError = null
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateProfileLoading = false
        state.updateProfileError = action.payload
      })

      // List users reducers
      .addCase(listUsers.pending, (state) => {
        state.listLoading = true
        state.listError = null
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.listLoading = false
        state.users = action.payload
        state.listError = null
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.listLoading = false
        state.listError = action.payload
      })

      // Delete user reducers
      .addCase(deleteUser.pending, (state) => {
        state.deleteLoading = true
        state.deleteError = null
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.deleteLoading = false
        state.deleteSuccess = true
        state.deleteError = null
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false
        state.deleteError = action.payload
      })

      // Update user reducers
      .addCase(updateUser.pending, (state) => {
        state.updateLoading = true
        state.updateError = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateLoading = false
        state.updateSuccess = true
        state.user = action.payload
        state.updateError = null
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false
        state.updateError = action.payload
      })

      // Add to favorites reducers
      .addCase(addToUserFavorites.pending, (state) => {
        state.favoritesLoading = true
        state.favoritesError = null
      })
      .addCase(addToUserFavorites.fulfilled, (state, action) => {
        state.favoritesLoading = false
        state.favoritesSuccess = true
        state.favoritesError = null
      })
      .addCase(addToUserFavorites.rejected, (state, action) => {
        state.favoritesLoading = false
        state.favoritesError = action.payload
      })
  },
})

// Export actions and reducer
export const {
  logout,
  resetUserDetails,
  resetUserList,
  resetFavorites,
  resetUpdateProfile,
  resetUpdate,
  resetRegister,
} = userSlice.actions

// Custom logout thunk that performs navigation
export const logoutAndRedirect = () => (dispatch) => {
  dispatch(logout())
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

export default userSlice.reducer
