import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface PollCardProps {
  title: string;
  description: string;
  createdAt: string;
  startTime?: string | null;
  active: boolean;
  status: "PENDING" | "STARTED" | "COMPLETED";
  endTime?: string | null;
  onStart: () => void;
  onEnd?: () => void;
  id: string;
  onPoll?: () => void;
  onKick?: (userId: string) => void;
  isTeacher: boolean;
  participants?: { id: string; name: string }[];
}

export function PollCard({
  title,
  description,
  createdAt,
  startTime,
  endTime,
  onStart,
  onEnd,
  // @ts-ignore: TS6133
  onKick,
  // @ts-ignore: TS6133
  active,
  status,
  onPoll,
  isTeacher,
  // @ts-ignore: TS6133
  participants = [],
}: PollCardProps) {
  const formattedDate = format(new Date(createdAt), "PPP");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Created on: {formattedDate}
        </div>
        {startTime === null && endTime === null ? (
          isTeacher && (
            <Button onClick={onStart} className="mt-4">
              Start Poll
            </Button>
          )
        ) : (
          <div className="mt-4">
            <div>
              Start Time:{" "}
              {startTime ? format(new Date(startTime), "PPP p") : "Not started"}
            </div>
            <div>
              End Time:{" "}
              {endTime ? format(new Date(endTime), "PPP p") : "Not ended"}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center space-x-2">
        {!["COMPLETED", "PENDING"].includes(status) && isTeacher && status && (
          <Button onClick={onEnd} variant="destructive">
            End Poll
          </Button>
        )}
        {["COMPLETED", "STARTED"].includes(status) && (
          <Button onClick={onPoll} variant="default">
            View Polls
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
