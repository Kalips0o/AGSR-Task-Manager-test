import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Typography } from "@/shared/components/ui/typography";
import { taskFormSchema } from "@/shared/schemas/task";

type TaskFormProps = {
  isLoading: boolean;
  listId: string;
  onSubmit: (data: {
    title: string;
    listId: string;
    description?: string;
    timeToComplete?: string;
  }) => Promise<void>;
};

export function TaskForm({ isLoading, listId, onSubmit }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    title: string;
    description?: string;
    timeToComplete?: string;
    listId: string;
  }>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      timeToComplete: "60",
      listId,
    },
  });

  const handleFormSubmit = handleSubmit(async (formData) => {
    try {
      await onSubmit(formData);
      reset();
    } catch (error) {
      console.error("Validation error:", error);
    }
  });

  return (
    <form className="space-y-4" onSubmit={handleFormSubmit}>
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <Typography className="text-gray-700" variant="body-m-medium">
            Title
          </Typography>
          <Input
            {...register("title")}
            disabled={isLoading}
            error={errors.title?.message}
            placeholder="Enter task title"
          />
        </div>

        <div className="w-32 space-y-2">
          <Typography className="text-gray-700" variant="body-m-medium">
            Time (min)
          </Typography>
          <Input
            {...register("timeToComplete")}
            disabled={isLoading}
            error={errors.timeToComplete?.message}
            min="1"
            placeholder="Optional"
            type="number"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Typography className="text-gray-700" variant="body-m-medium">
          Description
        </Typography>
        <Input
          {...register("description")}
          disabled={isLoading}
          error={errors.description?.message}
          placeholder="Enter task description (optional)"
        />
      </div>

      <Button className="w-full" disabled={isLoading} type="submit">
        {isLoading ? "Creating..." : "Create Task"}
      </Button>
    </form>
  );
}
