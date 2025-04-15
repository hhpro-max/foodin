import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ingredientReducer from './slices/ingredientSlice';
import orderReducer from './slices/orderSlice';
import cartReducer from './slices/cartSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ingredients: ingredientReducer,
    orders: orderReducer,
    cart: cartReducer
  }
});

export default store; 