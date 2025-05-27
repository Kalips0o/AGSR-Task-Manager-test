import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { LoginFormData } from "@/shared/schemas/auth";

import {
  saveAuthToStorage,
  loadAuthFromStorage,
  clearAuthStorage,
  isBrowser,
} from "../../lib/authStorage";
import { authService } from "../../services/auth";
import type { AuthState } from "../../types/auth";
import type { RootState } from "../index";

const initialState: AuthState = {
  isAuthenticated: false,
  email: null,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk<string, LoginFormData, { rejectValue: string }>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      if (!response.success) {
        return rejectWithValue(response.error);
      }

      return response.email;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "An error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.email = null;
      state.error = null;
      if (isBrowser) {
        clearAuthStorage();
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    loadPersistedState: (state) => {
      if (!isBrowser) return;

      const saved = loadAuthFromStorage();
      if (saved) {
        state.isAuthenticated = saved.isAuthenticated;
        state.email = saved.email;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.email = action.payload;
        state.isLoading = false;
        state.error = null;

        if (isBrowser) {
          saveAuthToStorage({
            isAuthenticated: true,
            email: action.payload,
          });
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => selectAuth(state).isAuthenticated;
export const selectAuthEmail = (state: RootState) => selectAuth(state).email;
export const selectAuthLoading = (state: RootState) => selectAuth(state).isLoading;
export const selectAuthError = (state: RootState) => selectAuth(state).error;

export const { logout, clearError, loadPersistedState } = authSlice.actions;
export default authSlice.reducer;
