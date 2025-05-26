"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { Header } from "../../components/header/header";
import { Button } from "../../shared/components/ui/button";
import { EditableTitle } from "../../shared/components/ui/editableTitle";
import { Input } from "../../shared/components/ui/input";

export default function DashboardPage() {
  const router = useRouter();
  const [lists, setLists] = useState([
    {
      id: "1",
      title: "Work Tasks",
      tasks: [{ id: "t1", title: "Make a commit", done: false }],
    },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const userEmail = "test@example.com";

  const handleAddList = () => {
    if (!newTitle.trim()) return;
    const newList = {
      id: uuidv4(),
      title: newTitle,
      tasks: [],
    };
    setLists((prev) => [...prev, newList]);
    setNewTitle("");
  };

  const handleDeleteList = (id: string) => {
    setLists((prev) => prev.filter((list) => list.id !== id));
  };

  const handleEditTitle = (id: string, title: string) => {
    setLists((prev) => prev.map((list) => (list.id === id ? { ...list, title } : list)));
  };

  return (
    <>
      <Header email={userEmail} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Lists</h1>
          <p className="text-gray-500">Manage your tasks in organized groups</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 min-w-0">
              <Input
                placeholder="New list name"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <Button className="sm:w-auto" variant="default" onClick={handleAddList}>
              Add List
            </Button>
          </div>
        </div>

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

              <p className="text-sm text-gray-500 mt-1 mb-4">Tasks: {list.tasks.length}</p>

              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => router.push(`/list/${list.id}`)}>
                  Open
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteList(list.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
