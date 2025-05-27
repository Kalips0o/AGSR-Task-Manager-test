"use client";

import React, { useEffect, useState, use } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Header } from "@/components/header/header";
import { ListHeader } from "@/components/lists/listHeader";
import { TaskDetailsModal } from "@/components/tasks/taskDetailsModal";
import { TaskForm } from "@/components/tasks/taskForm";
import { TaskList } from "@/components/tasks/taskList";
import { Skeleton, SkeletonGroup, TaskSkeleton } from "@/shared/components/ui/skeleton";
import { Typography } from "@/shared/components/ui/typography";
import type { AppDispatch, RootState } from "@/shared/redux";
import {
  createTask,
  deleteTask,
  fetchLists,
  selectListById,
  selectTasksLoading,
  selectTasksError,
  updateTask,
} from "@/shared/redux/slices/tasksSlice";
import type { CreateTaskFormData, UpdateTaskData } from "@/shared/schemas/task";
import type { Task } from "@/shared/types/task";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ListPage({ params }: PageProps) {
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();
  const list = useSelector((state: RootState) => selectListById(state, id));
  const isLoading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    dispatch(fetchLists());
  }, [dispatch]);

  const handleCreateTask = async (data: CreateTaskFormData) => {
    const taskData = {
      ...data,
      timeToComplete: data.timeToComplete ? Number(data.timeToComplete) : undefined,
    };
    await dispatch(createTask(taskData));
  };

  const handleDeleteTask = async (taskId: string) => {
    await dispatch(deleteTask(taskId));
  };

  const handleUpdateTask = async (data: UpdateTaskData) => {
    await dispatch(updateTask(data));
  };

  const handleToggleTaskStatus = async (task: Task) => {
    await dispatch(updateTask({ ...task, done: !task.done }));
  };

  if (isLoading && !list) {
    return (
      <>
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-10 w-1/3" variant="title" />
          </div>
          <div className="grid gap-8 md:grid-cols-[300px,1fr]">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <Skeleton className="h-8 w-2/3 mb-4" variant="title" />
              <SkeletonGroup>
                <TaskSkeleton />
                <TaskSkeleton />
              </SkeletonGroup>
            </div>
            <div className="space-y-4">
              <TaskSkeleton />
              <TaskSkeleton />
              <TaskSkeleton />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <Typography className="text-red-500" variant="body-lg-regular">
            Error: {error}
          </Typography>
        </main>
      </>
    );
  }

  if (!list) {
    return (
      <>
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <Typography className="text-red-500" variant="body-lg-regular">
            List not found
          </Typography>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
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
            onDeleteTask={handleDeleteTask}
            onEditTask={setEditingTask}
            onToggleTaskStatus={handleToggleTaskStatus}
          />
        </div>

        {editingTask && (
          <TaskDetailsModal
            isLoading={isLoading}
            isOpen={!!editingTask}
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
          />
        )}
      </main>
    </>
  );
}
