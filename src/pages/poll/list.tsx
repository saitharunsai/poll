import React from 'react';
import { useDispatch } from 'react-redux';
import { PollCard } from '@/shared/dashboard/Card';
import { endPoll, startPoll } from '@/redux/slices/pollSlice';
import { AppDispatch } from '@/redux/store';

interface PollListProps {
  polls: any[];
  isLoading: boolean;
  error: string | null;
  userRole: string | undefined;
}

export const PollList: React.FC<PollListProps> = ({ polls, isLoading, error, userRole }) => {
  const dispatch = useDispatch<AppDispatch>();

  if (isLoading) return <p>Loading polls...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  if (!polls || polls.length === 0) {
    return userRole === 'STUDENT' 
      ? <p>Waiting for a poll to be started.</p>
      : <p>No polls available.</p>;
  }

  if (userRole === 'STUDENT') return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => (
        <PollCard
          key={poll.id}
          {...poll}
          isTeacher={userRole === 'TEACHER'}
          onEnd={() => dispatch(endPoll(poll.id))}
          onStart={() => dispatch(startPoll(poll.id))}
        />
      ))}
    </div>
  );
};