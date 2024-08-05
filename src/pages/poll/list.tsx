import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { PollCard } from "@/shared/dashboard/Card";
import { endPoll, startPoll } from "@/redux/slices/pollSlice";
import { AppDispatch } from "@/redux/store";
import PollResultsGraph from "./graph";

interface PollListProps {
  polls: any[];
  isLoading: boolean;
  error: string | null;
  userRole: string | undefined;
}

export const PollList: React.FC<PollListProps> = ({
  polls,
  isLoading,
  error,
  userRole,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);

  if (isLoading) return <p>Loading polls...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!polls || polls.length === 0) {
    return userRole === "STUDENT" ? (
      <p>Waiting for a poll to be started.</p>
    ) : (
      <p>No polls available.</p>
    );
  }


  const handleOpenPollResults = (pollId: string) => {
    console.log(pollId)
    setSelectedPollId(pollId);
    setIsOpen(true);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {selectedPollId && (
        <PollResultsGraph
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          pollId={selectedPollId}
        />
      )}
      {polls.map((poll) => (
        <PollCard
          key={poll.id}
          {...poll}
          isTeacher={userRole === "TEACHER"}
          onEnd={() => dispatch(endPoll(poll.id))}
          onPoll={() => handleOpenPollResults(poll.id)}
          onStart={() => dispatch(startPoll(poll.id))}
        />
      ))}
    </div>
  );
};