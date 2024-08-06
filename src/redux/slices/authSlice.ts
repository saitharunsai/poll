import { postRequest, getRequest } from "@/axios/apiRequests";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
export const signup = createAsyncThunk(
  "auth/signup",
  async (
    userData: {
      name: string;
      email: string;
      password: string;
      role: "TEACHER" | "STUDENT";
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>("/auth/signup", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "An error occurred",
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>("/auth/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "An error occurred",
      );
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await postRequest("/auth/logout", {});
      return null;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "An error occurred",
      );
    }
  },
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState() as { auth: AuthState };
    if (!auth.refreshToken) {
      return rejectWithValue("No refresh token available");
    }
    try {
      const response = await postRequest<{
        accessToken: string;
        refreshToken: string;
      }>("/auth/refresh-token", { refreshToken: auth.refreshToken });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "An error occurred",
      );
    }
  },
);

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest<{ data: User }>("/users/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "An error occurred",
      );
    }
  },
);

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

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

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
  }>,
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
      .addCase(signup.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload.message as string;
      })
      .addCase(login.pending, setLoading)
      .addCase(login.fulfilled, setAuthData)
      .addCase(
        fetchUser.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: User;
          }>,
        ) => {
          state.isLoading = false;
          state.user = action.payload.data;
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, clearAuthData)
      .addCase(
        refreshToken.fulfilled,
        (
          state,
          action: PayloadAction<{ accessToken: string; refreshToken: string }>,
        ) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.accessToken);
          localStorage.setItem(REFRESH_TOKEN_KEY, action.payload.refreshToken);
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
        },
      );
  },
});

export default authSlice.reducer;
