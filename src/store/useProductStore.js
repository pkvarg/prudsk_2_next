// store/productStore.js
import { create } from 'zustand'
import axios from 'axios'

const useProductStore = create((set, get) => ({
  // Product list state
  products: [],
  loading: false,
  error: null,
  page: 1,
  pages: 1,

  // Product delete state
  loadingDelete: false,
  errorDelete: null,
  successDelete: false,

  // Product create state
  loadingCreate: false,
  errorCreate: null,
  successCreate: false,
  createdProduct: null,

  // Product detail state
  product: { reviews: [] },
  loadingDetail: false,
  errorDetail: null,

  // List products with pagination
  listProducts: async (keyword = '', pageNumber = 1, pageSize = 10) => {
    try {
      set({ loading: true })

      const { data } = await axios.get(
        `/api/products?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      )

      set({
        loading: false,
        products: data.products,
        page: data.page,
        pages: data.pages,
      })
    } catch (error) {
      set({
        loading: false,
        error:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  },

  // Delete product (admin only)
  deleteProduct: async (id) => {
    try {
      set({ loadingDelete: true })

      const { userInfo } = get()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      await axios.delete(`/api/products/${id}`, config)

      set({
        loadingDelete: false,
        successDelete: true,
      })

      // Reset success flag after a delay
      setTimeout(() => {
        set({ successDelete: false })
      }, 2000)

      // Refresh product list
      const { listProducts } = get()
      listProducts()
    } catch (error) {
      set({
        loadingDelete: false,
        errorDelete:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  },

  // Create product (admin only)
  createProduct: async () => {
    try {
      set({
        loadingCreate: true,
        errorCreate: null,
      })

      const { userInfo } = get()

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post('/api/products', {}, config)

      set({
        loadingCreate: false,
        successCreate: true,
        createdProduct: data,
      })
    } catch (error) {
      set({
        loadingCreate: false,
        errorCreate:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  },

  // Reset product create state
  resetProductCreate: () => {
    set({
      loadingCreate: false,
      errorCreate: null,
      successCreate: false,
      createdProduct: null,
    })
  },

  // Get product details
  getProductDetails: async (id) => {
    try {
      set({
        loadingDetail: true,
        product: { reviews: [] },
      })

      const { data } = await axios.get(`/api/products/${id}`)

      set({
        loadingDetail: false,
        product: data,
      })
    } catch (error) {
      set({
        loadingDetail: false,
        errorDetail:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  },

  // Update product (admin only)
  updateProduct: async (product) => {
    try {
      set({
        loadingUpdate: true,
        errorUpdate: null,
      })

      const { userInfo } = get()

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(`/api/products/${product._id}`, product, config)

      set({
        loadingUpdate: false,
        successUpdate: true,
        product: data,
      })

      // Reset success flag after a delay
      setTimeout(() => {
        set({ successUpdate: false })
      }, 2000)
    } catch (error) {
      set({
        loadingUpdate: false,
        errorUpdate:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  },
}))

export default useProductStore
