"use server";

import { auth } from "@/auth";
import { taskSchema, TaskInput, Task } from "@/lib/validations/task";
import { addTask, updateTaskStatus } from "@/lib/tasks";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

/**
 * Створення нового завдання
 */
export async function createTaskAction(data: TaskInput) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Неавторизований");
  }

  // Валідація на стороні сервера (Zod v4)
  const validatedFields = taskSchema.safeParse(data);
  if (!validatedFields.success) {
    const flattened = validatedFields.error.flatten();
    const details = flattened.fieldErrors as Record<string, string[]>; // Узгодження типів для Zod v4
    return {
      error: "Некоректні дані",
      details,
    };
  }

  const newTask: Task = {
    ...validatedFields.data,
    id: uuidv4(),
    completed: false,
    user_id: session.user.id,
    createdAt: new Date().toISOString(),
  };

  await addTask(newTask);
  revalidatePath("/tasks");
  return { success: true };
}

/**
 * Перемикання статусу завдання (виконано/не виконано)
 */
export async function toggleTaskStatusAction(id: string, completed: boolean) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Неавторизований");
  }

  await updateTaskStatus(id, session.user.id, completed);
  revalidatePath("/tasks");
}
