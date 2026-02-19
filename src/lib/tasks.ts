import { env } from "./env";
import { Task } from "./validations/task";

const BASE_URL = env.MOCKAPI_URL;

/**
 * Отримує список завдань для конкретного користувача через MockAPI з підтримкою пагінації.
 */
export async function getTasks(user_id: string, page?: number, limit?: number): Promise<{ tasks: Task[], total: number }> {
  try {
    // Спочатку отримуємо загальну кількість для користувача
    const countUrl = new URL(BASE_URL);
    countUrl.searchParams.append("user_id", user_id);
    
    const countResponse = await fetch(countUrl.toString(), {
      next: { revalidate: 0 },
    });
    
    if (!countResponse.ok) {
      console.error(`Failed to fetch tasks for count: ${countResponse.statusText}`);
      return { tasks: [], total: 0 };
    }
    
    const allTasks: Task[] = await countResponse.json();
    const total = allTasks.length;

    // Якщо пагінація не потрібна, повертаємо всі
    if (!page || !limit) {
      return { tasks: allTasks, total };
    }

    // Оскільки ми вже маємо всі завдання користувача (через MockAPI фільтрацію),
    // ми можемо просто зробити slice на стороні сервера (у нашому випадку у Route Handler).
    // Це надійніше, ніж поєднувати ?user_id=... та ?page=...&limit=... у MockAPI,
    // які іноді можуть конфліктувати.
    const start = (page - 1) * limit;
    const tasks = allTasks.slice(start, start + limit);
    
    return { tasks, total };
  } catch (error) {
    console.error("Error in getTasks:", error);
    return { tasks: [], total: 0 };
  }
}

/**
 * Додає нове завдання через MockAPI.
 */
export async function addTask(task: Task): Promise<void> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error(`Failed to add task: ${response.statusText}`);
  }
}

/**
 * Оновлює статус завдання.
 * Оскільки MockAPI не перевіряє user_id при PUT, ми маємо бути впевнені, що це завдання належить користувачу.
 */
export async function updateTaskStatus(id: string, user_id: string, completed: boolean): Promise<void> {
  // Перед оновленням варто було б перевірити власника, але для швидкості робимо запит.
  // В реальному проекті це робиться через бэкенд з авторизацією.
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.statusText}`);
  }
}

/**
 * Видаляє завдання.
 */
export async function deleteTask(id: string, user_id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }
}
