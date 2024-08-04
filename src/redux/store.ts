import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import  pollsSlice  from "./slices/pollSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    polls: pollsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
