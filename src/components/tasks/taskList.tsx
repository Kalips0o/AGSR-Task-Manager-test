import React from "react";

import { Typography } from "@/shared/components/ui/typography";
import type { Task } from "@/shared/types/task";

import { TaskCard } from "./taskCard";

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => Promise<void>;
  onToggleTaskStatus?: (task: Task) => Promise<void>;
}

export function TaskList({
  tasks,
  isLoading,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Typography className="text-gray-500" variant="body-lg-regular">
          No tasks yet. Create your first task to get started!
        </Typography>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <TaskCard
          isLoading={isLoading}
          key={task.id}
          task={task}
          onDelete={onDeleteTask}
          onEdit={onEditTask}
          onToggleStatus={onToggleTaskStatus}
        />
      ))}
    </div>
  );
}
