import { v4 as uuidv4 } from "uuid";

import type { CreateTaskData, CreateListData, UpdateTaskData } from "../schemas/task";
import type { Task, TaskList } from "../types/task";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const STORAGE_KEY = "task_lists";

const getStoredLists = (): TaskList[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLists = (lists: TaskList[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
};

export const tasksService = {
  async getLists(): Promise<ApiResponse<TaskList[]>> {
    try {
      const lists = getStoredLists();
      return { success: true, data: lists };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch lists",
      };
    }
  },

  async createList(data: CreateListData): Promise<ApiResponse<TaskList>> {
    try {
      const lists = getStoredLists();
      const newList: TaskList = {
        id: uuidv4(),
        title: data.title,
        tasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      lists.unshift(newList);
      saveLists(lists);

      return { success: true, data: newList };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create list",
      };
    }
  },

  async createTask(data: CreateTaskData): Promise<ApiResponse<Task>> {
    try {
      const lists = getStoredLists();
      const list = lists.find((l) => l.id === data.listId);

      if (!list) {
        return {
          success: false,
          error: "List not found",
        };
      }

      const newTask: Task = {
        id: uuidv4(),
        title: data.title,
        description: data.description,
        timeToComplete: data.timeToComplete,
        done: false,
        listId: data.listId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      list.tasks.push(newTask);
      list.updatedAt = new Date().toISOString();
      saveLists(lists);

      return { success: true, data: newTask };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create task",
      };
    }
  },

  async updateTask(data: UpdateTaskData): Promise<ApiResponse<Task>> {
    try {
      const lists = getStoredLists();
      const list = lists.find((l) => l.tasks.some((t) => t.id === data.id));

      if (!list) {
        return {
          success: false,
          error: "Task not found",
        };
      }

      const taskIndex = list.tasks.findIndex((t) => t.id === data.id);
      if (taskIndex === -1) {
        return {
          success: false,
          error: "Task not found in list",
        };
      }

      const updatedTask = {
        ...list.tasks[taskIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      list.tasks[taskIndex] = updatedTask;
      list.updatedAt = new Date().toISOString();
      saveLists(lists);

      return { success: true, data: updatedTask };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update task",
      };
    }
  },

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    try {
      const lists = getStoredLists();
      const list = lists.find((l) => l.tasks.some((t) => t.id === id));

      if (!list) {
        return {
          success: false,
          error: "Task not found",
        };
      }

      list.tasks = list.tasks.filter((t) => t.id !== id);
      list.updatedAt = new Date().toISOString();
      saveLists(lists);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete task",
      };
    }
  },

  async deleteList(id: string): Promise<ApiResponse<void>> {
    try {
      const lists = getStoredLists();
      const filteredLists = lists.filter((l) => l.id !== id);

      if (filteredLists.length === lists.length) {
        return {
          success: false,
          error: "List not found",
        };
      }

      saveLists(filteredLists);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete list",
      };
    }
  },

  async updateList(data: { id: string; title: string }): Promise<ApiResponse<void>> {
    try {
      const lists = getStoredLists();
      const list = lists.find((l) => l.id === data.id);

      if (!list) {
        return {
          success: false,
          error: "List not found",
        };
      }

      list.title = data.title;
      list.updatedAt = new Date().toISOString();
      saveLists(lists);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update list",
      };
    }
  },
};
