import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Modal } from "@/shared/components/ui/modal";
import { Typography } from "@/shared/components/ui/typography";
import type { AppDispatch } from "@/shared/redux";
import { updateTask } from "@/shared/redux/slices/tasksSlice";
import { updateTaskSchema, type UpdateTaskData } from "@/shared/schemas/task";
import type { Task } from "@/shared/types/task";

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTaskData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      id: task.id,
      title: task.title,
      description: task.description,
      timeToComplete: task.timeToComplete,
      done: task.done,
    },
  });

  const handleFormSubmit: SubmitHandler<UpdateTaskData> = async (data) => {
    await onSubmit(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <Typography className="text-gray-800" tag="h2" variant="headline-2-bold">
              Edit Task
            </Typography>
            <Button
              className="text-gray-500 hover:text-gray-700"
              size="icon"
              title="Close"
              variant="ghost"
              onClick={onClose}
            >
              ×
            </Button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="space-y-2">
              <Typography className="text-gray-700" variant="body-m-medium">
                Task Title
              </Typography>
              <Input
                {...register("title")}
                disabled={isLoading}
                error={errors.title?.message}
                placeholder="Task title"
              />
            </div>

            <div className="space-y-2">
              <Typography className="text-gray-700" variant="body-m-medium">
                Description
              </Typography>
              <Input
                {...register("description")}
                disabled={isLoading}
                error={errors.description?.message}
                placeholder="Task description (optional)"
              />
            </div>

            <div className="space-y-2">
              <Typography className="text-gray-700" variant="body-m-medium">
                Time to Complete (minutes)
              </Typography>
              <Input
                {...register("timeToComplete", { valueAsNumber: true })}
                disabled={isLoading}
                error={errors.timeToComplete?.message}
                min="1"
                placeholder="Estimated time in minutes (optional)"
                type="number"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                {...register("done")}
                className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-500"
                disabled={isLoading}
                type="checkbox"
              />
              <Typography className="text-gray-700" variant="body-m-medium">
                Mark as completed
              </Typography>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                className="text-gray-700"
                disabled={isLoading}
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
