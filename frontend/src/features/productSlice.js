import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api.js";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/products");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Fetch top-selling products
export const fetchTopSellingProducts = createAsyncThunk(
  "products/fetchTopSelling",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/products/top-selling");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch new products
export const fetchNewProducts = createAsyncThunk(
  "products/fetchNew",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/products/new");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    topSelling: [],
    newProducts: [],
    selectedProduct: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTopSellingProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopSellingProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topSelling = action.payload;
      })
      .addCase(fetchTopSellingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchNewProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNewProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.newProducts = action.payload;
      })
      .addCase(fetchNewProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export default productSlice.reducer;
