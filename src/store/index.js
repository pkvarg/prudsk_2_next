import { configureStore } from '@reduxjs/toolkit'
import audioReducer from './slices/audioSlice'
import bannerReducer from './slices/bannerSlice'
import cartReducer from './slices/cartSlice'
import contactReducer from './slices/contactSlice'
import orderReducer from './slices/orderSlice'
import productReducer from './slices/productSlice'
import userReducer from './slices/userSlice'
import videoReducer from './slices/videoSlice'

export const store = configureStore({
  reducer: {
    audio: audioReducer,
    banner: bannerReducer,
    cart: cartReducer,
    contact: contactReducer,
    order: orderReducer,
    product: productReducer,
    user: userReducer,
    video: videoReducer,
  },
})
