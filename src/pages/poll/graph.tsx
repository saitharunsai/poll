import React, { useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Modal } from "@/shared/modal";
import { Loader2 } from "lucide-react";
import { getRequest } from "@/axios/apiRequests";

interface PollResult {
  option: string;
  count: number;
}

interface PollResultsGraphProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pollId: string;
}

const PollResultsGraph: React.FC<PollResultsGraphProps> = ({
  isOpen,
  onOpenChange,
  pollId,
}) => {
  const [pollData, setPollData] = useState<{
    title: string;
    question: string;
    results: PollResult[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && pollId) {
      setIsLoading(true);
      setError(null);
      getRequest(`polls/${pollId}/results`)
        .then(({ data: { data } }: any) => {
          setPollData(data);
        })
        .catch((err) => {
          setError("Failed to fetch poll results");
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, pollId]);

  if (!pollData) return null;

  const { title, question, results } = pollData;

  const chartData = results.map((result, index) => ({
    option: result.option,
    votes: result.count,
    fill: `hsl(var(--chart-${index + 1}))`,
  }));

  const chartConfig = results.reduce(
    (config, result) => {
      config[result.option] = {
        label: result.option,
        color: `hsl(var(--chart-${Object.keys(config).length + 1}))`,
      };
      return config;
    },
    {
      votes: {
        label: "Votes",
      },
    } as ChartConfig,
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={title}
      description={question}
      confirmText="Close"
      cancelText="Cancel"
      onConfirm={() => onOpenChange(false)}
    >
      <Card className="w-full max-w-2xl">
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                  left: 0,
                }}
              >
                <YAxis
                  dataKey="option"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  //@ts-ignore
                  tickFormatter={(value) =>
                    chartConfig[value as keyof typeof chartConfig]?.label
                  }
                />
                <XAxis dataKey="votes" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="votes" layout="vertical" radius={5} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </Modal>
  );
};

export default PollResultsGraph;
