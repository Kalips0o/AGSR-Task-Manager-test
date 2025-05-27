"use client";

import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { IconEdit } from "@/shared/components/icons/icon-edit";
import { IconTrash } from "@/shared/components/icons/icon-trash";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Modal } from "@/shared/components/ui/modal";
import { TaskTimer } from "@/shared/components/ui/taskTimer";
import { Typography } from "@/shared/components/ui/typography";
import { updateTaskSchema, type UpdateTaskData } from "@/shared/schemas/task";
import type { Task } from "@/shared/types/task";

interface TaskDetailsModalProps {
  task: Task;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onUpdate?: (data: UpdateTaskData) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
}

export function TaskDetailsModal({
  task,
  isOpen,
  isLoading,
  onClose,
  onUpdate,
  onDelete,
}: TaskDetailsModalProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentTimeToComplete, setCurrentTimeToComplete] = React.useState<number | undefined>(
    task.timeToComplete
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateTaskData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      id: task.id,
      title: task.title,
      description: task.description,
      timeToComplete: task.timeToComplete?.toString() || "",
      done: task.done,
    },
  });

  const isDone = watch("done");

  useEffect(() => {
    if (isOpen) {
      reset({
        id: task.id,
        title: task.title,
        description: task.description,
        timeToComplete: task.timeToComplete?.toString() || "",
        done: task.done,
      });
      setCurrentTimeToComplete(task.timeToComplete);
      setIsEditing(false);
    }
  }, [isOpen, task, reset]);

  const onSubmit = async (data: UpdateTaskData) => {
    if (onUpdate) {
      const updateData = {
        ...data,
        timeToComplete: data.timeToComplete === "" ? undefined : Number(data.timeToComplete),
      };
      await onUpdate(updateData);
      setCurrentTimeToComplete(updateData.timeToComplete);
      setIsEditing(false);
    }
  };

  const handleStatusChange = async () => {
    const newStatus = !isDone;
    setValue("done", newStatus);
    if (onUpdate) {
      await onUpdate({
        id: task.id,
        done: newStatus,
        timeToComplete: task.timeToComplete,
      });
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(task.id);
      onClose();
    }
  };

  const handleCancelEdit = () => {
    reset({
      id: task.id,
      title: task.title,
      description: task.description,
      timeToComplete: task.timeToComplete?.toString() || "",
      done: task.done,
    });
    setIsEditing(false);
  };

  return (
    <Modal isOpen={isOpen} size="md" onClose={onClose}>
      <div className="flex flex-col space-y-4">
        {isEditing ? (
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography className="text-gray-600 mb-1" variant="body-m-regular">
                  Title
                </Typography>
                <Input
                  {...register("title")}
                  disabled={isLoading}
                  error={errors.title?.message}
                  placeholder="Task title"
                />
              </div>

              <div>
                <Typography className="text-gray-600 mb-1" variant="body-m-regular">
                  Time estimate (minutes)
                </Typography>
                <Input
                  {...register("timeToComplete")}
                  disabled={isLoading}
                  error={errors.timeToComplete?.message}
                  min="1"
                  placeholder="Time to complete in minutes (optional)"
                  type="number"
                />
              </div>
            </div>

            <div>
              <Typography className="text-gray-600 mb-1" variant="body-m-regular">
                Status
              </Typography>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isDone ?? false}
                  disabled={isLoading}
                  title="Mark as completed"
                  onChange={handleStatusChange}
                />
                <Typography variant="body-m-medium">Mark as completed</Typography>
              </div>
              {errors.done && <p className="mt-1 text-sm text-red-500">{errors.done.message}</p>}
            </div>

            <div>
              <Typography className="text-gray-600 mb-1" variant="body-m-regular">
                Description
              </Typography>
              <textarea
                {...register("description")}
                className="flex w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                disabled={isLoading}
                placeholder="Task description (optional)"
                rows={4}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                className="text-gray-600 hover:text-gray-800"
                disabled={isLoading}
                type="button"
                variant="ghost"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Save
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <Typography className="text-gray-800" variant="headline-2-bold">
                Task Info:
              </Typography>
              <TaskTimer
                className={isDone ? "text-green-600" : "text-red-600"}
                createdAt={task.createdAt}
                isDone={isDone}
                key={`${task.id}-${currentTimeToComplete}-${task.createdAt}`}
                timeToComplete={currentTimeToComplete}
              />
            </div>

            <div className="flex flex-col space-y-4">
              <div>
                <Typography className="text-gray-600" variant="body-m-regular">
                  Title:
                </Typography>
                <Typography className="text-gray-800" variant="body-lg-bold">
                  {task.title}
                </Typography>
              </div>

              {task.description && (
                <div>
                  <Typography className="text-gray-600" variant="body-m-regular">
                    Description:
                  </Typography>
                  <Typography
                    className="text-gray-800 break-words whitespace-pre-line"
                    variant="body-lg-regular"
                  >
                    {task.description}
                  </Typography>
                </div>
              )}

              <div>
                <Typography className="text-gray-600" variant="body-m-regular">
                  Estimate:
                </Typography>
                <Typography className="text-gray-800" variant="body-lg-bold">
                  {task.timeToComplete ? `${task.timeToComplete} min` : "Not set"}
                </Typography>
              </div>

              <div>
                <Typography className="text-gray-600" variant="body-m-regular">
                  Status:
                </Typography>
                <Typography
                  className={`${isDone ? "text-green-600" : "text-yellow-600"}`}
                  variant="body-lg-bold"
                >
                  {isDone ? "Completed" : "In Progress"}
                </Typography>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <Button
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                  size="icon"
                  title="Edit task"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  <IconEdit className="h-5 w-5" />
                </Button>
                <Button
                  className="text-gray-500 hover:text-red-600"
                  disabled={isLoading}
                  size="icon"
                  title="Delete task"
                  variant="ghost"
                  onClick={handleDelete}
                >
                  <IconTrash className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
