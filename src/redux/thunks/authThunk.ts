import { postRequest } from "@/axios/apiRequests";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { User, AuthState } from "../slices/authSlice";

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    userData: {
      name: string;
      email: string;
      password: string;
      role: "TEACHER" | "STUDENT";
    },
    { rejectWithValue }
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
        (error as AxiosError).response?.data || "An error occurred"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
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
        (error as AxiosError).response?.data || "An error occurred"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await postRequest("/auth/logout", {});
      return null;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "An error occurred"
      );
    }
  }
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
        (error as AxiosError).response?.data || "An error occurred"
      );
    }
  }
);
