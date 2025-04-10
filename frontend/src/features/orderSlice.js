import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api.js";
// Create a new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      console.log("Orderdata-> ", orderData);
      const { data } = await api.post("/api/orders", orderData); // ⬅️ use correct route

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
    console.log("📦 [fetchUserOrders] Fetching user orders...");
    try {
      const { data } = await api.get("/api/orders/myorders");
      console.log("✅ [fetchUserOrders] Orders fetched:", data);
      return data;
    } catch (error) {
      console.error(
        "❌ [fetchUserOrders] Error:",
        error.response?.data || error.message
      );
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
      console.log("🔄 [resetCreatedOrder] Resetting createdOrder");
      state.createdOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        console.log("🕒 [fetchUserOrders.pending]");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        console.log("✅ [fetchUserOrders.fulfilled]:", action.payload);
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        console.error("❗ [fetchUserOrders.rejected]:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })

      // Create order
      .addCase(createOrder.pending, (state) => {
        console.log("🕒 [createOrder.pending]");
        state.loading = true;
        state.error = null;
        state.createdOrder = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        console.log("🎉 [createOrder.fulfilled]:", action.payload);
        state.loading = false;
        state.createdOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        console.error("❗ [createOrder.rejected]:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Failed to create order";
      });
  },
});

export const { resetCreatedOrder } = orderSlice.actions;
export default orderSlice.reducer;
