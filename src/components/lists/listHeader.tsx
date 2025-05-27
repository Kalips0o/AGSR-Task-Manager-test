"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { IconArrowLeft } from "@/shared/components/icons/icon-arrow-left";
import { IconEdit } from "@/shared/components/icons/icon-edit";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Typography } from "@/shared/components/ui/typography";
import type { AppDispatch } from "@/shared/redux";
import { updateList } from "@/shared/redux/slices/tasksSlice";
import type { TaskList } from "@/shared/types/task";

interface ListHeaderProps {
  list: TaskList;
  isLoading?: boolean;
}

export function ListHeader({ list, isLoading }: ListHeaderProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(list.title);

  const handleEditTitle = () => {
    setEditingTitle(list.title);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = async () => {
    if (editingTitle.trim() === "") return;

    const result = await dispatch(updateList({ id: list.id, title: editingTitle.trim() }));
    if (updateList.fulfilled.match(result)) {
      setIsEditingTitle(false);
      setEditingTitle("");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
    setEditingTitle("");
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <Button
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          variant="ghost"
          onClick={() => router.push("/dashboard")}
        >
          <IconArrowLeft className="h-5 w-5" />
          <span>Back to Lists</span>
        </Button>

        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <Input
              className="text-2xl font-bold"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveTitle();
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
              onClick={handleSaveTitle}
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
          <div className="flex items-center gap-2">
            <Typography
              className="text-gray-800 cursor-pointer hover:text-gray-600"
              tag="h1"
              variant="headline-1"
              onClick={handleEditTitle}
            >
              {list.title}
            </Typography>
            <Button
              className="text-gray-600 hover:text-gray-800"
              disabled={isLoading}
              size="icon"
              title="Edit list title"
              variant="ghost"
              onClick={handleEditTitle}
            >
              <IconEdit className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
