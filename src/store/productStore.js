// store/productStore.js
import { create } from 'zustand'
import axios from 'axios'
import useUserStore from './userStore'

const useProductStore = create((set, get) => ({
  // Product list state
  products: [],
  allProducts: [],
  reviews: [],
  singleProdReviews: [],
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
  successDiscount: false,
  errorDiscount: '',
  loadingDiscount: false,

  // Product detail state
  //product: { reviews: [] },
  product: {},
  loadingDetail: false,
  errorDetail: null,

  // Product update state (ADD THESE)
  loadingUpdate: false,
  errorUpdate: null,
  successUpdate: false,

  loadingRemoveFromFavorites: false,
  errorRemoveFromFavorites: null,

  searchKeyword: '',
  isSearchActive: false,

  // Current page state
  currentPage: 1,
  pageSize: 8,

  setSearchKeyword: (keyword) =>
    set((state) => ({
      searchKeyword: keyword,
      isSearchActive: !!keyword.trim(),
    })),

  clearSearch: () =>
    set((state) => ({
      searchKeyword: '',
      isSearchActive: false,
    })),

  setCurrentPage: (pageNum) => {
    set({ currentPage: pageNum })
    // Automatically fetch products for the new page
    const { searchKeyword, pageSize } = get()
    get().listLibraryProducts(searchKeyword, pageNum, pageSize)
  },

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

  getAllProducts: async () => {
    try {
      set({ loading: true })

      const { data } = await axios.get(`/api/products/all`)

      set({
        loading: false,
        allProducts: data.products,
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

  getAllReviews: async () => {
    try {
      set({ loading: true })

      const { data } = await axios.get(`/api/reviews`)

      set({
        loading: false,
        reviews: data,
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

  acknowledgeProductReview: async (id, comment) => {
    try {
      set({ loading: true })

      const { data } = await axios.put(`/api/products/${id}/reviews/acknowledge`, { comment })

      console.log('pstore, ack rew by prod', data)

      set({
        loading: false,
        //reviews: data,
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

  deleteProductReview: async (id, comment) => {
    try {
      set({ loading: true })

      const { data } = await axios.delete(`/api/products/${id}/reviews`, {
        data: { comment },
      })

      set({
        loading: false,
        //reviews: data,
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

  getSingleProdutReviews: async (id) => {
    try {
      set({ loading: true })

      const { data } = await axios.get(`/api/products/${id}/reviews`)

      set({
        loading: false,
        singleProdReviews: data,
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

      await axios.delete(`/api/products/${id}`)

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

      const { data } = await axios.post('/api/products')

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
        //product: { reviews: [] },
        product: {},
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
    const userInfo = useUserStore.getState().userInfo

    // Check if user is admin
    if (!userInfo || !userInfo.isAdmin) {
      throw new Error('Unauthorized: Admin access required')
    }

    try {
      set({
        loadingUpdate: true,
        errorUpdate: null,
      })

      const { data } = await axios.put(`/api/products/${product.id}`, product)

      console.log('data put', data)

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

  createDiscount: async (discountData) => {
    try {
      set({
        loadingDiscount: true,
        //errorCreate: null,
      })

      // Extract discount from the parameter
      const { discount } = discountData

      const { data } = await axios.post(`/api/products/discount`, { discount })

      console.log('pstore create discount', data)

      set({
        loadingDiscount: false,
        successDiscount: true,
      })
    } catch (error) {
      set({
        loadingCreate: false,
        errorDiscount:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  },

  // Reset update state (ADD THIS)
  resetUpdate: () => {
    set({
      loadingUpdate: false,
      errorUpdate: null,
      successUpdate: false,
    })
  },

  // Clear errors (ADD THIS - OPTIONAL)
  clearErrors: () => {
    set({
      error: null,
      errorDelete: null,
      errorCreate: null,
      errorDetail: null,
      errorUpdate: null,
    })
  },

  removeFromFavorites: async (productId, userId) => {
    try {
      set({ loadingRemoveFromFavorites: true })

      await axios.put(`/api/products/${productId}/favorites/remove`, { userId })

      set({
        loadingRemoveFromFavorites: false,
      })
    } catch (error) {
      set({
        loadingRemoveFromFavorites: false,
        errorRemoveFromFavorites:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  },

  // List library products with pagination
  listLibraryProducts: async (keyword = '', pageNumber = 1, pageSize = 2) => {
    try {
      set({ loading: true, error: null })

      // Use the correct API endpoint
      const { data } = await axios.get(
        `/api/products/library?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
          error.response && error.response.data.error ? error.response.data.error : error.message,
      })
    }
  },
}))

export default useProductStore
