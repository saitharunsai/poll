import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { RootState } from "@/redux/store";
import { answerPoll } from "@/redux/slices/pollSlice";
import PollTimer from "./progress";

export const CurrentPollComponent: React.FC<{
  onPoll: (pollId: string) => void;
}> = ({ onPoll }) => {
  const dispatch: any = useDispatch();
  const currentPoll = useSelector(
    (state: RootState) => state.polls.currentPoll,
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  useEffect(() => {
    if (currentUser && currentPoll) {
      const userAnswer = currentPoll.answers?.find(
        (answer) => answer.userId === currentUser.id,
      );
      if (userAnswer) {
        setSelectedAnswer(userAnswer.option);
      }
    }
  }, [currentUser, currentPoll]);

  if (!currentPoll) {
    return null;
  }

  const handleAnswer = () => {
    if (selectedAnswer) {
      dispatch(answerPoll({ pollId: currentPoll.id, answer: selectedAnswer }));
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">{currentPoll.title}</h2>
      <p className="text-lg mb-4">{currentPoll.question}</p>
      <div className="mb-4">
        <PollTimer pollId={currentPoll.id} />
      </div>
      {currentUser?.role === "STUDENT" && (
        <>
          <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer}>
            {currentPoll.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  disabled={Boolean(
                    currentPoll.answers?.find(
                      (answer) =>
                        answer.userId === currentUser.id && answer.option,
                    ),
                  )}
                />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <Button
            onClick={handleAnswer}
            disabled={
              !selectedAnswer ||
              Boolean(
                currentPoll.answers?.find(
                  (answer) => answer.userId === currentUser.id && answer.option,
                ),
              )
            }
          >
            Submit Answer
          </Button>
          <Button
            className="ml-2"
            onClick={() => {
              onPoll(currentPoll.id);
            }}
            disabled={
              !Boolean(
                currentPoll.answers?.find(
                  (answer) => answer.userId === currentUser.id && answer.option,
                ),
              )
            }
          >
            View Live Polls
          </Button>
        </>
      )}
    </div>
  );
};
