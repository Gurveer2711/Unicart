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
      dispatch(cartSlice.actions.setItemLoading({ productId, loading: true }));
      const response = await api.post("/api/cart/add", { productId, quantity });
      if (!response.data) {
        throw new Error("Received undefined data from API");
      }
      return {
        data: response.data.updatedCart,
        message: response.data.message,
      };
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

      const response = await api.post("/api/cart/remove", { productId });

      if (!response.data) {
        // If no data returned, revert to fetching the whole cart
        dispatch(fetchCart());
        throw new Error("Received undefined data from API");
      }

      return { ...response.data, removedProductId: productId };
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
      return {
        data: response.data,
        message: response.data.message || "Cart cleared successfully",
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
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
    itemsLoading: {},
    error: null,
    initialized: false,
    successMessage: null,
  },
  reducers: {
    setItemLoading: (state, action) => {
      const { productId, loading } = action.payload;
      state.itemsLoading = {
        ...state.itemsLoading,
        [productId]: loading,
      };
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        if (action.payload && Array.isArray(action.payload.items)) {
          state.items = [...action.payload.items];
          state.totalAmount = action.payload.totalAmount || 0;
          state.totalItems = state.items.length;
          state.successMessage = action.payload.message || null;
        } else {
          // Do NOT clear items if response is invalid!
          state.error = "Invalid response format from server";
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
        state.successMessage = null;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.data || !action.payload.data.items) {
          state.error = "Invalid cart response";
          return;
        }
        state.items = [...action.payload.data.items];
        state.totalAmount = action.payload.data.totalAmount || 0;
        state.totalItems = state.items.length;
        state.successMessage = action.payload.message || null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "object"
            ? action.payload.message ||
              action.payload.error ||
              "Failed to add item to cart"
            : action.payload || "Failed to add item to cart";
        state.successMessage = null;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.error = null;
        state.successMessage = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.removedProductId) {
          const productIdToRemove = action.payload.removedProductId;
          state.items = state.items.filter(
            (item) => item.productId._id !== productIdToRemove
          );
          state.totalItems = state.items.length;
          state.totalAmount = state.items.reduce(
            (total, item) => total + item.productId.price * item.quantity,
            0
          );
        } else if (
          action.payload.data &&
          Array.isArray(action.payload.data.items)
        ) {
          state.items = [...action.payload.data.items];
          state.totalAmount = action.payload.data.totalAmount || 0;
          state.totalItems = state.items.length;
        }
        state.successMessage =
          action.payload.message || "Item removed from cart";
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "object"
            ? action.payload.message ||
              action.payload.error ||
              "Failed to remove item from cart"
            : action.payload || "Failed to remove item from cart";
        state.successMessage = null;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [];
        state.totalAmount = 0;
        state.totalItems = 0;
        state.successMessage =
          action.payload.message || "Cart cleared successfully";
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "object"
            ? action.payload.message ||
              action.payload.error ||
              "Failed to clear cart"
            : action.payload || "Failed to clear cart";
        state.successMessage = null;
      });
  },
});

export const {
  setItemLoading,
  optimisticRemoveItem,
  clearSuccessMessage,
  clearError,
} = cartSlice.actions;
export default cartSlice.reducer;
