import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api.js";

// Fetch user cart
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/cart");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);

      // Return error message from API if available
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

// Add item to cart
export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      console.log("📡 Step 1: Sending request with:", { productId, quantity });

      const response = await api.post("/api/cart/add", { productId, quantity });

      console.log("✅ Step 2: API Response received:", response.data);

      if (!response.data) {
        throw new Error("Received undefined data from API");
      }

      return response.data;
    } catch (error) {
      console.error("❌ Step 3: Error in addToCart:", error);
      return rejectWithValue(error.response?.data || "Error adding to cart");
    }
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/cart/remove", { productId });
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to remove item from cart"
      );
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/cart/clear");
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to clear cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalAmount: 0,

    totalItems: 0, // Track total number of items
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [...action.payload.items];
        state.totalAmount = action.payload.totalAmount;
        state.totalItems = state.items.length; // ✅ Update totalItems
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(addToCart.fulfilled, (state, action) => {
  state.loading = false;

  console.log("✅ Cart Response:", action.payload); // Debugging API response

  if (!action.payload || !action.payload.items) {
    console.error("❌ Invalid cart response:", action.payload);
    state.error = "Invalid cart response";
    return;
  }

  state.items = [...action.payload.items]; // ✅ Updating state correctly

  // Debugging - log the new state in the next event loop
  setTimeout(() => {
    console.log("🛒 Updated Cart Items (inside Redux):", state.items);
  }, 0);

  state.totalAmount = action.payload.totalAmount;
  state.totalItems = state.items.length;
})
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [...action.payload.items]; // ✅ Fix: Replace with updated items
        state.totalAmount = action.payload.totalAmount;
        state.totalItems = state.items.length; // ✅ Update totalItems
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalAmount = 0;
        state.totalItems = 0; // ✅ Reset totalItems
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
