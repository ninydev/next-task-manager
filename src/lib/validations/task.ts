import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(3, "Назва повинна містити мінімум 3 символи").max(100, "Назва занадто довга"),
  description: z.string().max(500, "Опис занадто довгий").optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;

export interface Task extends TaskInput {
  id: string;
  completed: boolean;
  user_id: string;
  createdAt: string;
}
