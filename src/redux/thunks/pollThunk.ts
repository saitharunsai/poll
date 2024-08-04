import { getRequest, postRequest } from "@/axios/apiRequests";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { Poll } from "../slices/pollSlice";

export const fetchPolls = createAsyncThunk(
  "polls/fetchPolls",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest<{ data: Poll[] }>("/polls");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "An error occurred"
      );
    }
  }
);

interface CreatePollPayload {
  title: string;
  question: string;
  options: string[];
  duration: number;
}

export const createPoll = createAsyncThunk(
  "polls/createPoll",
  async (pollData: CreatePollPayload, { rejectWithValue }) => {
    try {
      const response = await postRequest<{
        data: Poll;
      }>("/polls/create", pollData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "An error occurred"
      );
    }
  }
);
