import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Modal } from "@/shared/modal";

const CreatePollSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or less"),
  question: z
    .string()
    .min(1, "Question is required")
    .max(1000, "Question must be 1000 characters or less"),
  options: z
    .array(z.string().min(1, "Option is required"))
    .min(2, "At least two options are required"),
  duration: z.number().int().positive("Duration must be a positive integer"),
});

export type CreatePollFormValues = z.infer<typeof CreatePollSchema>;

interface CreatePollFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreatePollFormValues) => void;
}

export const CreatePollForm: React.FC<CreatePollFormProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatePollFormValues>({
    resolver: zodResolver(CreatePollSchema),
    defaultValues: {
      title: "",
      question: "",
      options: ["", ""],
      duration: 60,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const handleSubmit = async (data: CreatePollFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create poll:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Create New Poll"
      confirmText="Create Poll"
      cancelText="Cancel"
      onConfirm={form.handleSubmit(handleSubmit)}
      buttonDisabled={isSubmitting}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`options.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Option ${index + 1}`}</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input {...field} />
                      {index > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="button" variant="outline" onClick={() => append("")}>
            Add Option
          </Button>
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (seconds)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    step="1"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Modal>
  );
};
