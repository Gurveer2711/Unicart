import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api.js";

// Fetch Admin Dashboard Data
export const fetchAdminDashboard = createAsyncThunk(
  "admin/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/dashboard");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch all users (Admin Only)
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/users");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add a new product (Admin Only)
export const addProduct = createAsyncThunk(
  "admin/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/admin/addProduct", productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch all orders (Admin Only)
export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/orders");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch orders by status (Admin Only)
export const fetchOrdersByStatus = createAsyncThunk(
  "admin/fetchOrdersByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/admin/orders/status/${status}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update order status (Admin Only)
export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/admin/orders/${orderId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch order statistics (Admin Only)
export const fetchOrderStats = createAsyncThunk(
  "admin/fetchOrderStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/orders/stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete order (Admin Only)
export const deleteOrder = createAsyncThunk(
  "admin/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/admin/orders/${orderId}`);
      return { orderId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    dashboardData: {},
    users: [],
    orders: [],
    orderStats: {},
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.dashboardData = action.payload;
        state.loading = false;
        state.successMessage =
          action.payload.message || "Dashboard data loaded";
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
        state.successMessage =
          action.payload.message || "Users loaded successfully";
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "Product added successfully";
        console.log("Product added:", action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      // Order management cases
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders || [];
        state.loading = false;
        state.successMessage = "Orders loaded successfully";
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      .addCase(fetchOrdersByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        state.orders = action.payload.orders || [];
        state.loading = false;
        state.successMessage = `Orders with status '${action.payload.status}' loaded successfully`;
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "Order status updated successfully";
        // Update the order in the orders array
        const index = state.orders.findIndex(
          (order) => order._id === action.payload.order._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      .addCase(fetchOrderStats.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.orderStats = action.payload.stats || {};
        state.loading = false;
        state.successMessage = "Order statistics loaded successfully";
      })
      .addCase(fetchOrderStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "Order deleted successfully";
        // Remove the order from the orders array
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload.orderId
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null;
      });
  },
});

export const { clearSuccessMessage, clearError } = adminSlice.actions;
export default adminSlice.reducer;
