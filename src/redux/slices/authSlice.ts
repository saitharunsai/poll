import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, logout, refreshToken, signup } from "../thunks/authThunk";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "TEACHER" | "STUDENT";
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  isLoading: false,
  error: null,
};

const setLoading = (state: AuthState) => {
  state.isLoading = true;
  state.error = null;
};

const setAuthData = (
  state: AuthState,
  action: PayloadAction<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }>
) => {
  state.isLoading = false;
  state.user = action.payload.user;
  localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, action.payload.refreshToken);
  state.accessToken = action.payload.accessToken;
  state.refreshToken = action.payload.refreshToken;
};

const clearAuthData = (state: AuthState) => {
  state.user = null;
  state.accessToken = null;
  state.refreshToken = null;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, setLoading)
      .addCase(signup.fulfilled, setAuthData)
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, setLoading)
      .addCase(login.fulfilled, setAuthData)
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, clearAuthData)
      .addCase(
        refreshToken.fulfilled,
        (
          state,
          action: PayloadAction<{ accessToken: string; refreshToken: string }>
        ) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.accessToken);
          localStorage.setItem(REFRESH_TOKEN_KEY, action.payload.refreshToken);
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
        }
      );
  },
});

export default authSlice.reducer;
