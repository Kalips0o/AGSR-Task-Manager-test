import { z } from "zod";

export const newListSchema = z.object({
  title: z
    .string()
    .min(1, "List title is required")
    .max(50, "List title must be less than 50 characters")
    .trim(),
});

export type NewListFormData = z.infer<typeof newListSchema>;
