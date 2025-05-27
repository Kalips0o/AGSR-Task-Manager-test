import React from "react";

import { cn } from "@/lib/utils";
import { IconEye } from "@/shared/components/icons/icon-eye";
import { IconTrash } from "@/shared/components/icons/icon-trash";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Typography } from "@/shared/components/ui/typography";
import type { Task } from "@/shared/types/task";

interface TaskCardProps {
  task: Task;
  isLoading?: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (task: Task) => void;
}

export function TaskCard({ task, isLoading, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={task.done}
              disabled={isLoading}
              title={`Mark task as ${task.done ? "incomplete" : "complete"}`}
              onChange={() => onToggleStatus(task)}
            />
            <Typography
              className={cn("text-gray-800", task.done && "line-through text-gray-500")}
              variant="body-lg-bold"
            >
              {task.title}
            </Typography>
          </div>

          {task.description && (
            <Typography
              className={cn("text-gray-600 text-sm", task.done && "line-through text-gray-400")}
              variant="body-m-regular"
            >
              {task.description}
            </Typography>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            <Typography className="text-gray-500" variant="body-m-regular">
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </Typography>
            {task.timeToComplete && (
              <Typography className="text-gray-500" variant="body-m-regular">
                Estimated time: {task.timeToComplete} min
              </Typography>
            )}
            <Typography
              className={`${task.done ? "text-green-600" : "text-yellow-600"}`}
              variant="body-m-medium"
            >
              {task.done ? "Completed" : "In Progress"}
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
            size="icon"
            title="View task details"
            variant="ghost"
            onClick={() => onEdit(task)}
          >
            <IconEye className="h-5 w-5" />
          </Button>
          <Button
            className="text-gray-500 hover:text-red-600"
            disabled={isLoading}
            size="icon"
            title="Delete task"
            variant="ghost"
            onClick={() => onDelete(task.id)}
          >
            <IconTrash className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
