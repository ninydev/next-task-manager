# API Documentation

## REST API (Route Handlers)

### Отримати завдання (з підтримкою пагінації)
* **URL:** `/api/tasks?page=1&limit=5`
* **Метод:** `GET`
* **Авторизація:** Обов'язкова (Session cookie)
* **Параметри:** 
  * `page` (optional): Номер сторінки
  * `limit` (optional): Кількість елементів на сторінці
* **Відповідь:** `200 OK`
* **Приклад відповіді:**
```json
{
  "tasks": [
    {
      "id": "uuid-1",
      "title": "Купити хліб",
      "description": "Бажано житній",
      "completed": false,
      "user_id": "user-1",
      "createdAt": "2024-05-20T10:00:00.000Z"
    }
  ],
  "total": 15
}
```

### Видалити завдання
* **URL:** `/api/tasks/[id]`
* **Метод:** `DELETE`
* **Авторизація:** Обов'язкова
* **Відповідь:** `200 OK`
```json
{ "success": true }
```

---

## Server Actions

### Створення завдання
* **Функція:** `createTaskAction(data: TaskInput)`
* **Вхідні дані:** `title` (min 3), `description` (optional)
* **Поведінка:** Валідує дані через Zod, зберігає в БД, викликає `revalidatePath('/tasks')`.

### Перемикання статусу
* **Функція:** `toggleTaskStatusAction(id: string, completed: boolean)`
* **Поведінка:** Оновлює статус завдання, викликає `revalidatePath('/tasks')`.

---

## Real-time Events (SSE)

### Потік подій
* **URL:** `/api/events`
* **Метод:** `GET`
* **Headers:** `Content-Type: text/event-stream`

### Формат повідомлень
Події відправляються у форматі JSON всередині поля `data`.

1. **Heartbeat (кожні 30 секунд):**
```json
{ "status": "ok", "timestamp": "2024-05-20T10:00:30.000Z" }
```

2. **Системне повідомлення:**
```json
{ "message": "Користувач [Ім'я] увійшов у систему" }
```
