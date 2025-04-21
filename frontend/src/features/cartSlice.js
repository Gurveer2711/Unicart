import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api.js";

// Fetch user cart
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/cart");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

// Add item to cart
export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      // Optimistic update
      dispatch(cartSlice.actions.setItemLoading({ productId, loading: true }));

      const response = await api.post("/api/cart/add", { productId, quantity });
      if (!response.data) {
        throw new Error("Received undefined data from API");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding to cart");
    } finally {
      dispatch(cartSlice.actions.setItemLoading({ productId, loading: false }));
    }
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId, { rejectWithValue, dispatch, getState }) => {
    try {
      // Get current state to implement optimistic UI update
      const currentState = getState().cart;
      const itemToRemove = currentState.items.find(
        (item) => item.productId._id === productId
      );

      if (!itemToRemove) {
        throw new Error("Item not found in cart");
      }

      // Optimistic update - mark item as loading
      dispatch(cartSlice.actions.setItemLoading({ productId, loading: true }));

      // Optimistic removal - remove item from UI immediately
      dispatch(cartSlice.actions.optimisticRemoveItem({ productId }));

      const response = await api.post("/api/cart/remove", { productId });

      if (!response.data) {
        // If no data returned, revert to fetching the whole cart
        dispatch(fetchCart());
        throw new Error("Received undefined data from API");
      }

      return response.data;
    } catch (error) {
      // On error, refresh the cart to ensure UI is in sync with server
      dispatch(fetchCart());
      return rejectWithValue(
        error.message || "Failed to remove item from cart"
      );
    } finally {
      dispatch(cartSlice.actions.setItemLoading({ productId, loading: false }));
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/cart/clear");
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
    totalItems: 0,
    loading: false,
    itemsLoading: {}, // Track loading state per item
    error: null,
    initialized: false, // Track if cart has been initialized
  },
  reducers: {
    // Add a reducer to track loading state for individual items
    setItemLoading: (state, action) => {
      const { productId, loading } = action.payload;
      state.itemsLoading = {
        ...state.itemsLoading,
        [productId]: loading,
      };
    },
    // Optimistic removal of item
    optimisticRemoveItem: (state, action) => {
      const { productId } = action.payload;
      // Filter out the item being removed
      const removedItem = state.items.find(
        (item) => item.productId._id === productId
      );

      if (removedItem) {
        // Update total amount and items count
        state.totalAmount -= removedItem.productId.price * removedItem.quantity;
        state.items = state.items.filter(
          (item) => item.productId._id !== productId
        );
        state.totalItems = state.items.length;
      }
    },
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
        state.initialized = true;

        // Ensure we have valid data
        if (action.payload && Array.isArray(action.payload.items)) {
          state.items = [...action.payload.items];
          state.totalAmount = action.payload.totalAmount || 0;
          state.totalItems = state.items.length;
        } else {
          // Handle case where API returns unexpected data format
          state.items = [];
          state.totalAmount = 0;
          state.totalItems = 0;
          state.error = "Invalid response format from server";
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
        // Don't clear items on error to maintain last known state
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;

        if (!action.payload || !action.payload.items) {
          state.error = "Invalid cart response";
          return;
        }

        state.items = [...action.payload.items];
        state.totalAmount = action.payload.totalAmount || 0;
        state.totalItems = state.items.length;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add item to cart";
      })

      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;

        // Only update state if we have valid data
        if (action.payload && Array.isArray(action.payload.items)) {
          state.items = [...action.payload.items];
          state.totalAmount = action.payload.totalAmount || 0;
          state.totalItems = state.items.length;
        }
        // If invalid data, we've already dispatched fetchCart in the thunk
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove item from cart";
        // We've already dispatched fetchCart in the thunk to refresh the state
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
        state.totalItems = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to clear cart";
      });
  },
});

export const { setItemLoading, optimisticRemoveItem } = cartSlice.actions;
export default cartSlice.reducer;
