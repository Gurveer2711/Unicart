import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api.js";

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/login", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/logout");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Logout failed. Please try again."
      );
    }
  }
);

// Check Auth
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/auth/check", {
        withCredentials: true,
      });
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/auth/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to reset password"
      );
    }
  }
);

// Update Profile
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put("/api/user/profile", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    userInfo: null,
    loading: false,
    error: null,
    message: null,
    authChecked: false,
  },
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.message = "Logged out successfully";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.userInfo = null;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.authChecked = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.userInfo = null;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to send link";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to reset password";
      })

      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.message = "Profile updated successfully";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update profile";
      });
  },
});

export const { clearMessage, clearError } = authSlice.actions;
export default authSlice.reducer;
