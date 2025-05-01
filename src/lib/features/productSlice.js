import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// List Products
export const listProducts = createAsyncThunk(
  'product/list',
  async ({ keyword = '', pageNumber = '', pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/products?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      )

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch products')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// List All Products (No Pagination)
export const listAllProducts = createAsyncThunk(
  'product/listAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/products/all')

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch all products')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Get Product Details
export const listProductDetails = createAsyncThunk(
  'product/details',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/products/${id}`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch product details')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Delete Product
export const deleteProduct = createAsyncThunk(
  'product/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to delete product')
      }

      return id // Return the id of the deleted product
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Create Discount
export const createDiscount = createAsyncThunk(
  'product/createDiscount',
  async (discount, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch('/api/products/discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(discount),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to create discount')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Create Product
export const createProduct = createAsyncThunk(
  'product/create',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to create product')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Update Product
export const updateProduct = createAsyncThunk(
  'product/update',
  async (product, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to update product')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Update Product (Anybody)
export const updateProductAnybody = createAsyncThunk(
  'product/updateAnybody',
  async (product, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/products/${product._id}/anybody`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to update product')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Remove From Favorites
export const removeFromFavorites = createAsyncThunk(
  'product/removeFromFavorites',
  async ({ product, userId }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/products/${product}/remove/favorites`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to remove from favorites')
      }

      return { productId: product }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Create Product Review
export const createProductReview = createAsyncThunk(
  'product/createReview',
  async ({ productId, review }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(review),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to create review')
      }

      return { productId }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Acknowledge Product Review
export const acknowledgeProductReview = createAsyncThunk(
  'product/acknowledgeReview',
  async ({ productId, comment }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/products/${productId}/reviews/acknowledge`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ comment }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to acknowledge review')
      }

      return { productId, comment }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Delete Product Review
export const deleteProductReview = createAsyncThunk(
  'product/deleteReview',
  async ({ product, comment }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState()
      const { userInfo } = user

      if (!userInfo || !userInfo.token) {
        return rejectWithValue('Not authenticated')
      }

      const response = await fetch(`/api/products/${product._id}/reviews`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ product, comment }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to delete review')
      }

      return { productId: product._id, comment }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// List Top Products
export const listTopProducts = createAsyncThunk(
  'product/topRated',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/products/top')

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch top products')
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
  productList: {
    products: [],
    page: 1,
    pages: 1,
    loading: false,
    error: null,
  },
  productDetails: {
    product: { reviews: [] },
    loading: false,
    error: null,
  },
  productDelete: {
    loading: false,
    success: false,
    error: null,
  },
  productCreate: {
    product: {},
    loading: false,
    success: false,
    error: null,
  },
  productUpdate: {
    product: {},
    loading: false,
    success: false,
    error: null,
  },
  discountCreate: {
    loading: false,
    success: false,
    error: null,
  },
  productReviewCreate: {
    loading: false,
    success: false,
    error: null,
  },
  productReviewAcknowledge: {
    loading: false,
    success: false,
    error: null,
  },
  productReviewDelete: {
    loading: false,
    success: false,
    error: null,
  },
  productRemoveFromFavorites: {
    loading: false,
    success: false,
    error: null,
  },
  productTopRated: {
    products: [],
    loading: false,
    error: null,
  },
}

// Create slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetProductCreate: (state) => {
      state.productCreate = {
        product: {},
        loading: false,
        success: false,
        error: null,
      }
    },
    resetProductUpdate: (state) => {
      state.productUpdate = {
        product: {},
        loading: false,
        success: false,
        error: null,
      }
    },
    resetProductReviewCreate: (state) => {
      state.productReviewCreate = {
        loading: false,
        success: false,
        error: null,
      }
    },
    resetProductReviewAcknowledge: (state) => {
      state.productReviewAcknowledge = {
        loading: false,
        success: false,
        error: null,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // List products
      .addCase(listProducts.pending, (state) => {
        state.productList.loading = true
        state.productList.error = null
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.productList.loading = false
        state.productList.products = action.payload.products
        state.productList.page = action.payload.page
        state.productList.pages = action.payload.pages
        state.productList.error = null
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.productList.loading = false
        state.productList.error = action.payload
      })

      // List all products (also uses the productList state)
      .addCase(listAllProducts.pending, (state) => {
        state.productList.loading = true
        state.productList.error = null
      })
      .addCase(listAllProducts.fulfilled, (state, action) => {
        state.productList.loading = false
        state.productList.products = action.payload.products
        state.productList.error = null
      })
      .addCase(listAllProducts.rejected, (state, action) => {
        state.productList.loading = false
        state.productList.error = action.payload
      })

      // Product details
      .addCase(listProductDetails.pending, (state) => {
        state.productDetails.loading = true
        state.productDetails.error = null
      })
      .addCase(listProductDetails.fulfilled, (state, action) => {
        state.productDetails.loading = false
        state.productDetails.product = action.payload
        state.productDetails.error = null
      })
      .addCase(listProductDetails.rejected, (state, action) => {
        state.productDetails.loading = false
        state.productDetails.error = action.payload
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.productDelete.loading = true
        state.productDelete.error = null
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.productDelete.loading = false
        state.productDelete.success = true
        state.productDelete.error = null
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.productDelete.loading = false
        state.productDelete.error = action.payload
      })

      // Create discount
      .addCase(createDiscount.pending, (state) => {
        state.discountCreate.loading = true
        state.discountCreate.error = null
      })
      .addCase(createDiscount.fulfilled, (state) => {
        state.discountCreate.loading = false
        state.discountCreate.success = true
        state.discountCreate.error = null
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.discountCreate.loading = false
        state.discountCreate.error = action.payload
      })

      // Create product
      .addCase(createProduct.pending, (state) => {
        state.productCreate.loading = true
        state.productCreate.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.productCreate.loading = false
        state.productCreate.success = true
        state.productCreate.product = action.payload
        state.productCreate.error = null
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.productCreate.loading = false
        state.productCreate.error = action.payload
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.productUpdate.loading = true
        state.productUpdate.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.productUpdate.loading = false
        state.productUpdate.success = true
        state.productUpdate.product = action.payload
        state.productUpdate.error = null
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.productUpdate.loading = false
        state.productUpdate.error = action.payload
      })

      // Update product anybody
      .addCase(updateProductAnybody.pending, (state) => {
        state.productUpdate.loading = true
        state.productUpdate.error = null
      })
      .addCase(updateProductAnybody.fulfilled, (state, action) => {
        state.productUpdate.loading = false
        state.productUpdate.success = true
        state.productUpdate.product = action.payload
        state.productUpdate.error = null
      })
      .addCase(updateProductAnybody.rejected, (state, action) => {
        state.productUpdate.loading = false
        state.productUpdate.error = action.payload
      })

      // Remove from favorites
      .addCase(removeFromFavorites.pending, (state) => {
        state.productRemoveFromFavorites.loading = true
        state.productRemoveFromFavorites.error = null
      })
      .addCase(removeFromFavorites.fulfilled, (state) => {
        state.productRemoveFromFavorites.loading = false
        state.productRemoveFromFavorites.success = true
        state.productRemoveFromFavorites.error = null
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.productRemoveFromFavorites.loading = false
        state.productRemoveFromFavorites.error = action.payload
      })

      // Create product review
      .addCase(createProductReview.pending, (state) => {
        state.productReviewCreate.loading = true
        state.productReviewCreate.error = null
      })
      .addCase(createProductReview.fulfilled, (state) => {
        state.productReviewCreate.loading = false
        state.productReviewCreate.success = true
        state.productReviewCreate.error = null
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.productReviewCreate.loading = false
        state.productReviewCreate.error = action.payload
      })

      // Acknowledge product review
      .addCase(acknowledgeProductReview.pending, (state) => {
        state.productReviewAcknowledge.loading = true
        state.productReviewAcknowledge.error = null
      })
      .addCase(acknowledgeProductReview.fulfilled, (state) => {
        state.productReviewAcknowledge.loading = false
        state.productReviewAcknowledge.success = true
        state.productReviewAcknowledge.error = null
      })
      .addCase(acknowledgeProductReview.rejected, (state, action) => {
        state.productReviewAcknowledge.loading = false
        state.productReviewAcknowledge.error = action.payload
      })

      // Delete product review
      .addCase(deleteProductReview.pending, (state) => {
        state.productReviewDelete.loading = true
        state.productReviewDelete.error = null
      })
      .addCase(deleteProductReview.fulfilled, (state) => {
        state.productReviewDelete.loading = false
        state.productReviewDelete.success = true
        state.productReviewDelete.error = null
      })
      .addCase(deleteProductReview.rejected, (state, action) => {
        state.productReviewDelete.loading = false
        state.productReviewDelete.error = action.payload
      })

      // List top products
      .addCase(listTopProducts.pending, (state) => {
        state.productTopRated.loading = true
        state.productTopRated.error = null
      })
      .addCase(listTopProducts.fulfilled, (state, action) => {
        state.productTopRated.loading = false
        state.productTopRated.products = action.payload
        state.productTopRated.error = null
      })
      .addCase(listTopProducts.rejected, (state, action) => {
        state.productTopRated.loading = false
        state.productTopRated.error = action.payload
      })
  },
})

// Export actions and reducer
export const {
  resetProductCreate,
  resetProductUpdate,
  resetProductReviewCreate,
  resetProductReviewAcknowledge,
} = productSlice.actions

export default productSlice.reducer
