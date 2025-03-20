import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
// import productReducer from "./features/productSlice";
// import cartReducer from "./features/cartSlice";
// import adminReducer from "./features/adminSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
