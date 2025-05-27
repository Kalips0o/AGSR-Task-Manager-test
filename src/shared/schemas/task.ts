import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(100, "Task title must be less than 100 characters")
    .trim(),
  listId: z.string().uuid("Invalid list ID"),
});

export const taskListSchema = z.object({
  title: z
    .string()
    .min(1, "List title is required")
    .max(50, "List title must be less than 50 characters")
    .trim(),
});

export const updateTaskSchema = z.object({
  id: z.string().uuid("Invalid task ID"),
  title: z
    .string()
    .min(1, "Task title is required")
    .max(100, "Task title must be less than 100 characters")
    .trim()
    .optional(),
  done: z.boolean().optional(),
});

export type CreateTaskData = z.infer<typeof taskSchema>;
export type CreateListData = z.infer<typeof taskListSchema>;
export type UpdateTaskData = z.infer<typeof updateTaskSchema>;
