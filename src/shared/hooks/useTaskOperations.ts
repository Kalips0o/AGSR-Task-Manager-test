import { useState } from "react";

import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/shared/redux";
import { createTask, deleteTask, updateTask } from "@/shared/redux/slices/tasksSlice";
import type { CreateTaskFormData, UpdateTaskData } from "@/shared/schemas/task";
import type { Task } from "@/shared/types/task";

export function useTaskOperations() {
  const dispatch = useDispatch<AppDispatch>();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreateTask = async (data: CreateTaskFormData) => {
    const taskData = {
      ...data,
      timeToComplete: data.timeToComplete ? parseInt(data.timeToComplete, 10) : undefined,
    };
    await dispatch(createTask(taskData));
  };

  const handleDeleteTask = async (taskId: string) => {
    await dispatch(deleteTask(taskId));
  };

  const handleUpdateTask = async (data: UpdateTaskData) => {
    const taskData = {
      ...data,
      createdAt: data.timeToComplete !== undefined ? new Date().toISOString() : undefined,
    };
    await dispatch(updateTask(taskData));
  };

  const handleToggleTaskStatus = async (task: Task) => {
    await dispatch(updateTask({ ...task, done: !task.done }));
  };

  return {
    editingTask,
    setEditingTask,
    handleCreateTask,
    handleDeleteTask,
    handleUpdateTask,
    handleToggleTaskStatus,
  };
}
