import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePollForm, CreatePollFormValues } from "../poll/createPoll";
import { createPoll } from "@/redux/slices/pollSlice";
import { AppDispatch } from "@/redux/store";

export const CreatePollButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleCreatePoll = async (data: CreatePollFormValues) => {
    try {
      await dispatch(
        createPoll({
          ...data,
          duration: Number(data.duration),
        }),
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create poll:", error);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <PlusIcon className="w-5 h-5" />
        Create Poll
      </Button>
      <CreatePollForm
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreatePoll}
      />
    </>
  );
};
