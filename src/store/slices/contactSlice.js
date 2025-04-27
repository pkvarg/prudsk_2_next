import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk for sending contact form
export const sendContactForm = createAsyncThunk(
  'contact/sendForm',
  async (contactForm, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contactForm }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to send contact form')
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
  loading: false,
  success: false,
  error: null,
}

// Create slice
const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    // Reset contact form state (useful after navigation or component unmount)
    resetContactForm: (state) => {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendContactForm.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(sendContactForm.fulfilled, (state) => {
        state.loading = false
        state.success = true
        state.error = null
      })
      .addCase(sendContactForm.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload
      })
  },
})

// Export actions and reducer
export const { resetContactForm } = contactSlice.actions
export default contactSlice.reducer
