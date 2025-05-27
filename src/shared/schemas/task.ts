import { z } from "zod";

// Схема для формы создания задачи
const timeToCompleteFormSchema = z
  .string()
  .transform((val) => {
    if (val === "") return undefined;
    if (!/^\d+$/.test(val)) throw new Error("Time must be a positive integer");
    return Number(val);
  })
  .optional();

// Схема для API
const timeToCompleteApiSchema = z
  .number()
  .int()
  .positive("Time must be a positive integer")
  .optional();

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(100, "Task title must be less than 100 characters")
    .trim(),
  description: z.string().max(150, "Description must be less than 150 characters").optional(),
  timeToComplete: timeToCompleteFormSchema,
  listId: z.string().uuid("Invalid list ID"),
});

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(100, "Task title must be less than 100 characters")
    .trim(),
  description: z.string().max(150, "Description must be less than 150 characters").optional(),
  timeToComplete: timeToCompleteApiSchema,
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
  description: z.string().max(150, "Description must be less than 150 characters").optional(),
  timeToComplete: z.union([
    z.string().transform((val) => (val === "" ? undefined : Number(val))),
    z.number().optional(),
    z.undefined(),
  ]),
  done: z.boolean().optional(),
});

export type CreateTaskFormData = z.infer<typeof taskFormSchema>;
export type CreateTaskData = z.infer<typeof taskSchema>;
export type CreateListData = z.infer<typeof taskListSchema>;
export type UpdateTaskData = z.infer<typeof updateTaskSchema>;

// Добавляем тип для формы с учетом преобразования времени
export type TaskFormValues = Omit<CreateTaskFormData, "timeToComplete"> & {
  timeToComplete?: string;
};
