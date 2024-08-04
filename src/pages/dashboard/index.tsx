import React, { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "./Header";
import { PollCard } from "@/shared/dashboard/Card";
import { Button } from "@/components/ui/button";
import { createPoll, fetchPolls } from "@/redux/thunks/pollThunk";
import { RootState, AppDispatch } from "@/redux/store";
import { CreatePollForm, CreatePollFormValues } from "../poll/createPoll";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { polls, isLoading, error } = useSelector((state: RootState) => state.polls);

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  const handleCreatePoll = async (data: CreatePollFormValues) => {
    try {
      await dispatch(createPoll({
        ...data,
        duration: Number(data.duration)
      }));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create poll:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <CreatePollForm
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreatePoll}
      />

      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">All Polls</h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <PlusIcon className="w-5 h-5" />
            Create Poll
          </Button>
        </div>
        
        {isLoading && <p>Loading polls...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        
        {!isLoading && !error && polls && polls.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => (
              <PollCard
                key={poll.id}
                title={poll.title}
                description={poll.question}
                options={poll.options}
                createdAt={poll.createdAt}
                startTime={poll.startTime}
                endTime={poll.endTime}
                onStart={() => console.log(`Starting poll: ${poll.id}`)}
              />
            ))}
          </div>
        ) : (
          <p>No polls available.</p>
        )}
      </main>
    </div>
  );
}