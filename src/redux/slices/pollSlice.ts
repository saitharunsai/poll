// slices/pollsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPolls, createPoll } from "../thunks/pollThunk";

export interface Poll {
  id: string;
  title: string;
  question: string;
  options: string[];
  createdAt: string;
  updatedAt: string;
  startTime: string | null;
  endTime: string | null;
  duration: number;
  isActive: boolean;
  createdBy: string;
  answers: any[];
}

export interface PollsState {
  polls: Poll[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PollsState = {
  polls: [],
  isLoading: false,
  error: null,
};

const pollsSlice = createSlice({
  name: "polls",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolls.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPolls.fulfilled, (state, action: PayloadAction<Poll[]>) => {
        state.isLoading = false;
        state.polls = action.payload;
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createPoll.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createPoll.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: Poll;
          }>
        ) => {
          state.isLoading = false;
          state.polls.push(action.payload.data);
        }
      )
      .addCase(createPoll.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default pollsSlice.reducer;
