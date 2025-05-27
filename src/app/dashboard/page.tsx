"use client";

import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch } from "@/shared/redux";
import {
  fetchLists,
  createList,
  deleteList,
  selectLists,
  selectTasksLoading,
  selectTasksError,
} from "@/shared/redux/slices/tasksSlice";
import { newListSchema, type NewListFormData } from "@/shared/schemas/list";

import { Header } from "../../components/header/header";
import { Button } from "../../shared/components/ui/button";
import { EditableTitle } from "../../shared/components/ui/editableTitle";
import { Input } from "../../shared/components/ui/input";
import { Typography } from "../../shared/components/ui/typography";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const lists = useSelector(selectLists);
  const isLoading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewListFormData>({
    resolver: zodResolver(newListSchema),
    defaultValues: {
      title: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    dispatch(fetchLists());
  }, [dispatch]);

  const onSubmit: SubmitHandler<NewListFormData> = async (data) => {
    const result = await dispatch(createList(data));
    if (createList.fulfilled.match(result)) {
      reset();
    }
  };

  const handleDeleteList = async (id: string) => {
    await dispatch(deleteList(id));
  };

  const handleEditTitle = (id: string, title: string) => {
    // TODO: Implement edit list title functionality
    console.log("Edit title:", id, title);
  };

  if (isLoading && lists.length === 0) {
    return (
      <>
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <Typography variant="body-lg-regular">Loading...</Typography>
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

  return (
    <>
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Typography className="text-gray-800 mb-2" tag="h1" variant="headline-1">
            Task Lists
          </Typography>
          <Typography className="text-gray-500" variant="body-m-regular">
            Manage your tasks in organized groups
          </Typography>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8 shadow-sm">
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex-1 min-w-0">
              <Input
                {...register("title")}
                disabled={isLoading}
                error={errors.title?.message}
                placeholder="New list name"
              />
            </div>
            <Button className="sm:w-auto" disabled={isLoading} type="submit" variant="default">
              {isLoading ? "Adding..." : "Add List"}
            </Button>
          </form>
        </div>

        {lists.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
            <Typography className="text-gray-600 mb-2" variant="body-lg-regular">
              You don&#39;t have any task lists yet
            </Typography>
            <Typography className="text-gray-500" variant="body-m-regular">
              Create your first list to start organizing your tasks
            </Typography>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <div
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
                key={list.id}
              >
                <EditableTitle
                  inputClassName="text-lg font-medium text-gray-800 w-full border-b border-gray-300 focus:outline-none focus:border-gray-500"
                  title={list.title}
                  onChange={(newTitle) => handleEditTitle(list.id, newTitle)}
                />

                <Typography className="text-gray-500 mt-1 mb-4" variant="body-m-regular">
                  Tasks: {list.tasks.length}
                </Typography>

                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => router.push(`/list/${list.id}`)}>
                    Edit
                  </Button>
                  <Button
                    disabled={isLoading}
                    variant="destructive"
                    onClick={() => handleDeleteList(list.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
