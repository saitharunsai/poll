import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "./Header";
import { CurrentPollComponent } from "../poll/answer";
import { fetchPolls } from "@/redux/slices/pollSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { PollList } from "../poll/list";
import { CreatePollButton } from "../poll/CreatePollButton";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { polls, isLoading, error, currentPoll } = useSelector(
    (state: RootState) => state.polls
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">All Polls</h1>
          {user?.role === "TEACHER" && <CreatePollButton />}
        </div>

        {currentPoll && user?.role === "STUDENT" && currentPoll.answers && (
          <CurrentPollComponent />
        )}

        <PollList
          polls={polls}
          isLoading={isLoading}
          error={error}
          userRole={user?.role}
        />
      </main>
    </div>
  );
};

export default Dashboard;
