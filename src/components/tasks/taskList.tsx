import React from "react";

import type { Task } from "@/shared/types/task";

import { EmptyTaskList } from "./emptyTaskList";
import { TaskCard } from "./taskCard";

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTaskStatus: (task: Task) => void;
}

export function TaskList({
  tasks,
  isLoading,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyTaskList />;
  }

  // Сортируем задачи по дате создания (новые сверху)
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
