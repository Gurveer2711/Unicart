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
      // We'll comment this out to prevent premature removal
      // dispatch(cartSlice.actions.optimisticRemoveItem({ productId }))

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
    itemsLoading: {},
    error: null,
    initialized: false,
  },
  reducers: {
    setItemLoading: (state, action) => {
      const { productId, loading } = action.payload;
      state.itemsLoading = {
        ...state.itemsLoading,
        [productId]: loading,
      };
    },
    optimisticRemoveItem: (state, action) => {
      const { productId } = action.payload;
      const removedItem = state.items.find(
        (item) => item.productId._id === productId
      );
      if (removedItem) {
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
        if (action.payload && Array.isArray(action.payload.items)) {
          state.items = [...action.payload.items];
          state.totalAmount = action.payload.totalAmount || 0;
          state.totalItems = state.items.length;
        } else {
          // Do NOT clear items if response is invalid!
          state.error = "Invalid response format from server";
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
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
  state.loading = false
  
  // If we have the removedProductId, remove that specific item
  if (action.payload.removedProductId) {
    const productIdToRemove = action.payload.removedProductId;
    state.items = state.items.filter(item => item.productId._id !== productIdToRemove);
    
    // Recalculate totals
    state.totalItems = state.items.length;
    state.totalAmount = state.items.reduce(
      (total, item) => total + (item.productId.price * item.quantity), 
      0
    );
  } 
  // If we have a valid items array from the server, use that
  else if (action.payload && Array.isArray(action.payload.items)) {
    state.items = [...action.payload.items];
    state.totalAmount = action.payload.totalAmount || 0;
    state.totalItems = state.items.length;
  }
})
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove item from cart";
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
