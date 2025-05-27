import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { ListTasksModal } from "@/components/lists/listTasksModal";
import { IconEdit } from "@/shared/components/icons/icon-edit";
import { IconEye } from "@/shared/components/icons/icon-eye";
import { IconTrash } from "@/shared/components/icons/icon-trash";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Typography } from "@/shared/components/ui/typography";
import type { AppDispatch } from "@/shared/redux";
import {
  createList,
  deleteList,
  selectLists,
  selectTasksLoading,
  selectTasksError,
  updateList,
} from "@/shared/redux/slices/tasksSlice";
import { newListSchema, type NewListFormData } from "@/shared/schemas/list";
import type { TaskList } from "@/shared/types/task";

export function DashboardContent() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const lists = useSelector(selectLists);
  const isLoading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);
  const [viewingList, setViewingList] = useState<TaskList | null>(null);

  // Сортируем списки от новых к старым
  const sortedLists = [...lists].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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

  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const onSubmit: SubmitHandler<NewListFormData> = async (data) => {
    const result = await dispatch(createList(data));
    if (createList.fulfilled.match(result)) {
      reset();
    }
  };

  const handleDeleteList = async (id: string) => {
    await dispatch(deleteList(id));
  };

  const handleEditTitle = (id: string, currentTitle: string) => {
    setEditingListId(id);
    setEditingTitle(currentTitle);
  };

  const handleSaveTitle = async (id: string) => {
    if (editingTitle.trim() === "") return;

    const result = await dispatch(updateList({ id, title: editingTitle.trim() }));
    if (updateList.fulfilled.match(result)) {
      setEditingListId(null);
      setEditingTitle("");
    }
  };

  const handleCancelEdit = () => {
    setEditingListId(null);
    setEditingTitle("");
  };

  if (error) {
    return (
      <Typography className="text-red-500" variant="body-lg-regular">
        Error: {error}
      </Typography>
    );
  }

  return (
    <div className="space-y-8">
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
          {sortedLists.map((list) => (
            <div
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
              key={list.id}
            >
              {editingListId === list.id ? (
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    className="flex-1"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveTitle(list.id);
                      } else if (e.key === "Escape") {
                        handleCancelEdit();
                      }
                    }}
                  />
                  <Button
                    className="text-green-600 hover:text-green-700"
                    size="icon"
                    title="Save"
                    variant="ghost"
                    onClick={() => handleSaveTitle(list.id)}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </Button>
                  <Button
                    className="text-gray-600 hover:text-gray-700"
                    size="icon"
                    title="Cancel"
                    variant="ghost"
                    onClick={handleCancelEdit}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 18L18 6M6 6l12 12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-4">
                  <Typography
                    className="text-lg font-medium text-gray-800 flex-1 cursor-pointer hover:text-gray-600"
                    tag="h2"
                    onClick={() => handleEditTitle(list.id, list.title)}
                  >
                    {list.title}
                  </Typography>
                </div>
              )}

              <Typography className="text-gray-500 mt-1 mb-4" variant="body-m-regular">
                Tasks: {list.tasks.length}
              </Typography>

              <div className="flex flex-wrap gap-2">
                <Button
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                  size="icon"
                  title="View tasks"
                  variant="ghost"
                  onClick={() => setViewingList(list)}
                >
                  <IconEye className="h-5 w-5" />
                </Button>
                <Button
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                  size="icon"
                  title="Edit list"
                  variant="ghost"
                  onClick={() => router.push(`/list/${list.id}`)}
                >
                  <IconEdit className="h-5 w-5" />
                </Button>
                <Button
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  disabled={isLoading}
                  size="icon"
                  title="Delete list"
                  variant="ghost"
                  onClick={() => handleDeleteList(list.id)}
                >
                  <IconTrash className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewingList && (
        <ListTasksModal
          isOpen={!!viewingList}
          listTitle={viewingList.title}
          tasks={viewingList.tasks}
          onClose={() => setViewingList(null)}
        />
      )}
    </div>
  );
}
