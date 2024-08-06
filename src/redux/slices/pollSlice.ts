import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest, postRequest } from "@/axios/apiRequests";
import { AxiosError } from "axios";
import { socketService } from "@/services/socketService";
import { toast } from "@/components/ui/use-toast";
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
  status: "PENDING" | "STARTED" | "COMPLETED";
  createdBy: string;
  answers: { userId: string; answer: string; option: string }[];
}

export interface PollsState {
  polls: Poll[];
  currentPoll: Poll | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PollsState = {
  polls: [],
  currentPoll: null,
  isLoading: false,
  error: null,
};

export const fetchPolls = createAsyncThunk(
  "polls/fetchPolls",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest<{ data: Poll[] }>("/polls");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "An error occurred",
      );
    }
  },
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
        (error as AxiosError).response?.data || "An error occurred",
      );
    }
  },
);

interface ErrorResponseData {
  message?: string;
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as ErrorResponseData | undefined;
    return responseData?.message || "An error occurred";
  } else if (error instanceof Error) {
    return error.message || "An error occurred";
  } else {
    return "An unknown error occurred";
  }
};

export const startPoll = createAsyncThunk(
  "polls/startPoll",
  async (pollId: string, { rejectWithValue }) => {
    try {
      const response = await postRequest<Poll>(`/polls/start`, {
        pollId: pollId,
      });
      socketService.startPoll(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        variant: "destructive",
        title: errorMessage,
      });
      return rejectWithValue(errorMessage);
    }
  },
);

export const answerPoll = createAsyncThunk(
  "polls/answerPoll",
  async (
    { pollId, answer }: { pollId: string; answer: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await postRequest<Poll>(`/polls/answer`, {
        option: answer,
        pollId: pollId,
      });
      toast({
        title: "Answer Submitted Successfully",
      });
      socketService.answerPoll(pollId, answer);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "An error occurred",
      );
    }
  },
);

export const kickUserFromPoll = createAsyncThunk(
  "polls/kickUser",
  async (
    { pollId, userId }: { pollId: string; userId: string },
    { rejectWithValue },
  ) => {
    try {
      await postRequest(`/polls/${pollId}/kick`, { userId });
      socketService.kickUser(pollId, userId);
      return { pollId, userId };
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "An error occurred",
      );
    }
  },
);

export const endPoll = createAsyncThunk(
  "polls/endPoll",
  async (pollId: string, { dispatch, rejectWithValue }) => {
    try {
      await postRequest<Poll>(`/polls/end`, {
        pollId: pollId,
      });
      socketService.endPoll(pollId);
      dispatch(clearCurrentPoll());
      dispatch(fetchPolls());
      return pollId;
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).response?.data || "An error occurred",
      );
    }
  },
);

const pollSlice = createSlice({
  name: "polls",
  initialState,
  reducers: {
    setCurrentPoll: (state, action: PayloadAction<Poll>) => {
      state.currentPoll = action.payload;
    },
    updatePoll: (state, action: PayloadAction<Poll>) => {
      const index = state.polls.findIndex(
        (poll) => poll.id === action.payload.id,
      );
      if (index !== -1) {
        state.polls[index] = action.payload;
      }
      if (state.currentPoll && state.currentPoll.id === action.payload.id) {
        state.currentPoll = action.payload;
      }
    },
    removePoll: (state, action: PayloadAction<string>) => {
      state.polls = state.polls.filter((poll) => poll.id !== action.payload);
      if (state.currentPoll && state.currentPoll.id === action.payload) {
        state.currentPoll = null;
      }
    },
    clearCurrentPoll: (state) => {
      state.currentPoll = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolls.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPolls.fulfilled, (state, action: PayloadAction<Poll[]>) => {
        state.isLoading = false;
        state.polls = action.payload;
        const activePoll = action.payload.filter(
          (poll) => poll.isActive && poll.status == "STARTED",
        );
        if (activePoll) {
          state.currentPoll = activePoll[0];
        }
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(
        createPoll.fulfilled,
        (state, action: PayloadAction<{ data: Poll }>) => {
          state.polls.push(action.payload.data);
        },
      )
      .addCase(startPoll.fulfilled, (state, action: PayloadAction<Poll>) => {
        const index = state.polls.findIndex(
          (poll) => poll.id === action.payload.id,
        );
        if (index !== -1) {
          state.polls[index] = action.payload;
        }
        state.currentPoll = action.payload;
      })
      .addCase(answerPoll.fulfilled, (state, action: PayloadAction<Poll>) => {
        const index = state.polls.findIndex(
          (poll) => poll.id === action.payload.id,
        );
        if (index !== -1) {
          state.polls[index] = action.payload;
        }
        if (state.currentPoll && state.currentPoll.id === action.payload.id) {
          state.currentPoll = action.payload;
        }
      })
      .addCase(
        kickUserFromPoll.fulfilled,
        (state, action: PayloadAction<{ pollId: string; userId: string }>) => {
          const pollIndex = state.polls.findIndex(
            (poll) => poll.id === action.payload.pollId,
          );
          if (pollIndex !== -1) {
            state.polls[pollIndex].answers = state.polls[
              pollIndex
            ].answers.filter(
              (answer) => answer.userId !== action.payload.userId,
            );
          }
          if (
            state.currentPoll &&
            state.currentPoll.id === action.payload.pollId
          ) {
            state.currentPoll.answers = state.currentPoll.answers.filter(
              (answer) => answer.userId !== action.payload.userId,
            );
          }
        },
      )
      .addCase(endPoll.fulfilled, (state, action: PayloadAction<string>) => {
        const index = state.polls.findIndex(
          (poll) => poll.id === action.payload,
        );
        if (index !== -1) {
          state.polls[index].isActive = false;
          state.polls[index].endTime = new Date().toISOString();
        }
        state.currentPoll = null;
      });
  },
});

export const { setCurrentPoll, updatePoll, removePoll, clearCurrentPoll } =
  pollSlice.actions;
export default pollSlice.reducer;
