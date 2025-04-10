import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api.js";

// Create a new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/orders", orderData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Unknown error" }
      );
    }
  }
);

// Get orders of the logged-in user
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/orders/myorders");
      console.log("Data:", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    createdOrder: null,
  },
  reducers: {
    resetCreatedOrder(state) {
      state.createdOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })

      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createdOrder = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.createdOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create order";
      });
  },
});

export const { resetCreatedOrder } = orderSlice.actions;
export default orderSlice.reducer;
