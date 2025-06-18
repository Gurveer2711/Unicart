import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api.js";

// Async thunks
export const fetchAllProducts = createAsyncThunk(
  "adminProducts/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/products");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "adminProducts/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/admin/products/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Add text fields
      formData.append("title", productData.title);
      formData.append("description", productData.description);
      formData.append("originalPrice", productData.originalPrice);
      formData.append("discountedPrice", productData.discountedPrice);
      formData.append("category", productData.category);
      formData.append("stocksLeft", productData.stocksLeft);
      formData.append("rate", productData.rate || 1);
      formData.append("count", productData.count || 0);

      // Add image file
      if (productData.image) {
        formData.append("image", productData.image);
      }

      const response = await api.post("/api/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Add text fields
      if (productData.title) formData.append("title", productData.title);
      if (productData.description)
        formData.append("description", productData.description);
      if (productData.originalPrice)
        formData.append("originalPrice", productData.originalPrice);
      if (productData.discountedPrice)
        formData.append("discountedPrice", productData.discountedPrice);
      if (productData.category)
        formData.append("category", productData.category);
      if (productData.stocksLeft !== undefined)
        formData.append("stocksLeft", productData.stocksLeft);
      if (productData.rate !== undefined)
        formData.append("rate", productData.rate);
      if (productData.count !== undefined)
        formData.append("count", productData.count);

      // Add image file if provided
      if (productData.image) {
        formData.append("image", productData.image);
      }

      const response = await api.put(
        `/api/admin/products/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/admin/products/${productId}`);
      return { productId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

export const fetchProductStats = createAsyncThunk(
  "adminProducts/fetchProductStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/products/stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product statistics"
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  "adminProducts/searchProducts",
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/products/search", {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search products"
      );
    }
  }
);

const initialState = {
  products: [],
  selectedProduct: null,
  productStats: null,
  loading: false,
  error: null,
  successMessage: null,
  searchResults: [],
  filters: {
    query: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        query: "",
        category: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload.product);
        state.successMessage = action.payload.message;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p._id === action.payload.product._id
        );
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
        if (
          state.selectedProduct &&
          state.selectedProduct._id === action.payload.product._id
        ) {
          state.selectedProduct = action.payload.product;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (p) => p._id !== action.payload.productId
        );
        if (
          state.selectedProduct &&
          state.selectedProduct._id === action.payload.productId
        ) {
          state.selectedProduct = null;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch product stats
      .addCase(fetchProductStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductStats.fulfilled, (state, action) => {
        state.loading = false;
        state.productStats = action.payload;
      })
      .addCase(fetchProductStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setSelectedProduct,
  clearSelectedProduct,
  updateFilters,
  clearFilters,
} = adminProductSlice.actions;

export default adminProductSlice.reducer;
