"use client";

import React from "react";
import { use } from "react";

import { Header } from "@/components/header/header";
import { ListContent } from "@/components/lists/listContent";
import { Skeleton, SkeletonGroup, TaskSkeleton } from "@/shared/components/ui/skeleton";
import { Typography } from "@/shared/components/ui/typography";
import { useListData } from "@/shared/hooks/useListData";
import { useTaskOperations } from "@/shared/hooks/useTaskOperations";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ListPage({ params }: PageProps) {
  const { id } = use(params);
  const { list, isLoading, error } = useListData(id);
  const { handleCreateTask, handleDeleteTask, handleUpdateTask, handleToggleTaskStatus } =
    useTaskOperations();

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
        <ListContent
          isLoading={isLoading}
          list={list}
          onCreateTask={handleCreateTask}
          onDeleteTask={handleDeleteTask}
          onToggleTaskStatus={handleToggleTaskStatus}
          onUpdateTask={handleUpdateTask}
        />
      </main>
    </>
  );
}
