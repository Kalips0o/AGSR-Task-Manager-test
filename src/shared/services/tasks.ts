import type { CreateTaskData, CreateListData, UpdateTaskData } from "../schemas/task";
import type { Task, TaskList } from "../types/task";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const tasksService = {
  async getLists(): Promise<ApiResponse<TaskList[]>> {
    try {
      const response = await fetch("/api/tasks?type=lists");
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Failed to fetch lists",
        };
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred",
      };
    }
  },

  async createList(data: CreateListData): Promise<ApiResponse<TaskList>> {
    try {
      const response = await fetch("/api/tasks?type=list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Failed to create list",
        };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred",
      };
    }
  },

  async createTask(data: CreateTaskData): Promise<ApiResponse<Task>> {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          timeToComplete: data.timeToComplete ? Number(data.timeToComplete) : undefined,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Failed to create task",
        };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred",
      };
    }
  },

  async updateTask(data: UpdateTaskData): Promise<ApiResponse<Task>> {
    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          timeToComplete: data.timeToComplete ? Number(data.timeToComplete) : undefined,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Failed to update task",
        };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred",
      };
    }
  },

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Failed to delete task",
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred",
      };
    }
  },

  async deleteList(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`/api/tasks?id=${id}&type=list`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Failed to delete list",
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred",
      };
    }
  },

  async updateList(data: { id: string; title: string }): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`/api/tasks?id=${data.id}&type=list`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: data.title }),
      });
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Failed to update list",
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred",
      };
    }
  },
};
