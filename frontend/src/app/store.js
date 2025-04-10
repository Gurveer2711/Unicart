import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import productReducer from "../features/productSlice";
import cartReducer from "../features/cartSlice";
import adminReducer from "../features/adminSlice";
import orderReducer from "../features/orderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    admin: adminReducer,
    orders: orderReducer,
  },
});

export default store;
