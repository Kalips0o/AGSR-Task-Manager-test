import React from "react";

import { ListHeader } from "@/components/lists/listHeader";
import { TaskDetailsModal } from "@/components/tasks/taskDetailsModal";
import { TaskForm } from "@/components/tasks/taskForm";
import { TaskList } from "@/components/tasks/taskList";
import { Typography } from "@/shared/components/ui/typography";
import type { UpdateTaskData } from "@/shared/schemas/task";
import { List } from "@/shared/types/list";
import { Task } from "@/shared/types/task";

interface ListContentProps {
  list: List;
  isLoading: boolean;
  onCreateTask: (data: {
    title: string;
    listId: string;
    description?: string;
    timeToComplete?: number;
  }) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onUpdateTask: (data: UpdateTaskData) => Promise<void>;
  onToggleTaskStatus: (task: Task) => Promise<void>;
}

export function ListContent({
  list,
  isLoading,
  onCreateTask,
  onDeleteTask,
  onUpdateTask,
  onToggleTaskStatus,
}: ListContentProps) {
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const handleCreateTask = async (data: {
    title: string;
    listId: string;
    description?: string;
    timeToComplete?: string;
  }) => {
    await onCreateTask({
      ...data,
      timeToComplete: data.timeToComplete ? Number(data.timeToComplete) : undefined,
    });
  };

  return (
    <>
      <ListHeader isLoading={isLoading} list={list} />

      <div className="grid gap-8 md:grid-cols-[300px,1fr]">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <Typography className="text-gray-800 mb-4" variant="headline-2-bold">
            Add New Task
          </Typography>
          <TaskForm isLoading={isLoading} listId={list.id} onSubmit={handleCreateTask} />
        </div>

        <TaskList
          isLoading={isLoading}
          tasks={list.tasks}
          onDeleteTask={onDeleteTask}
          onEditTask={setEditingTask}
          onToggleTaskStatus={onToggleTaskStatus}
        />
      </div>

      {editingTask && (
        <TaskDetailsModal
          isLoading={isLoading}
          isOpen={!!editingTask}
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onDelete={onDeleteTask}
          onUpdate={onUpdateTask}
        />
      )}
    </>
  );
}
