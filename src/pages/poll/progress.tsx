import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { socketService } from "@/services/socketService";

const PollTimer = ({ pollId }: { pollId: string }) => {
  const [progress, setProgress] = useState(100);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    let timerInterval: string | number | NodeJS.Timeout | undefined;

    const startTimer = (
      startTimeStr: string | number | Date,
      endTimeStr: string | number | Date
    ) => {
      clearInterval(timerInterval);
      const startTime = new Date(startTimeStr).getTime();
      const endTime = new Date(endTimeStr).getTime();
      const totalDuration = endTime - startTime;

      timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = endTime - now;

        if (timeLeft < 0) {
          clearInterval(timerInterval);
          setProgress(0);
          setStatus("Poll Ended");
        } else {
          const progressPercentage = (timeLeft / totalDuration) * 100;
          setProgress(progressPercentage);
          setStatus("Poll Active");
        }
      }, 1000);
    };

    const handlePollStatus = (data: {
      pollId: any;
      status: string;
      startTime: any;
      endTime: any;
    }) => {
      if (data.pollId === pollId) {
        if (data.status === "active") {
          startTimer(data.startTime, data.endTime);
        } else if (data.status === "ended") {
          setProgress(0);
          setStatus("Poll Ended");
        }
      }
    };

    socketService.getSocket()?.on("pollStarted", handlePollStatus);
    socketService.getSocket()?.on("pollStatus", handlePollStatus);

    // Request poll status on component mount or browser refresh
    socketService.getSocket()?.emit("getPollStatus", pollId);

    return () => {
      socketService.getSocket()?.off("pollStarted", handlePollStatus);
      socketService.getSocket()?.off("pollStatus", handlePollStatus);
      clearInterval(timerInterval);
    };
  }, [pollId]);

  return (
    <div className="w-full max-w-md">
      <div className="mb-2 flex justify-between text-sm text-gray-600">
        <span>{status}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
};

export default PollTimer;
