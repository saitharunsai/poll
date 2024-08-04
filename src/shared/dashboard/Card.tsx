import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface PollCardProps {
  title: string;
  description: string;
  options: string[];
  createdAt: string;
  startTime?: string | null;
  endTime?: string | null;
  onStart: () => void;
}

export function PollCard({
  title,
  description,
  options,
  createdAt,
  startTime,
  endTime,
  onStart,
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
          <Button onClick={onStart} className="mt-4">Start Poll</Button>
        ) : (
          <div className="mt-4">
            <div>Start Time: {startTime}</div>
            <div>End Time: {endTime}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
