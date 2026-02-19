"use client";

import { Container, Typography, Box, Paper, Divider, List, ListItem, ListItemText, Button } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          variant="text"
          component={Link}
          href="/"
        >
          Назад до завдань
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
          Тестове завдання: Next.js Developer (Junior/Intern)
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 'medium' }}>
          Огляд проєкту
        </Typography>
        <Typography variant="body1" paragraph>
          Необхідно розробити <strong>Task Tracker</strong> — веб-додаток для управління списком завдань з авторизацією, розділенням серверної/клієнтської логіки та real-time повідомленнями.
        </Typography>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
          Стек технологій:
        </Typography>
        <List dense>
          <ListItem><ListItemText primary="Framework: Next.js 16 (App Router)" /></ListItem>
          <ListItem><ListItemText primary="Auth: Auth.js (NextAuth) + Google Provider" /></ListItem>
          <ListItem><ListItemText primary="UI Library: MUI (Material UI)" /></ListItem>
          <ListItem><ListItemText primary="Forms: React Hook Form + Zod (валідація)" /></ListItem>
          <ListItem><ListItemText primary="Data: MockAPI.io (або будь-який аналогічний сервіс)" /></ListItem>
          <ListItem><ListItemText primary="Language: TypeScript (сувора типізація)" /></ListItem>
        </List>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Технічне завдання по рівнях
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h3" color="primary" gutterBottom>
            Рівень 1: Базова логіка (MVP)
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>1. Авторизація:</Typography>
          <List dense>
            <ListItem><ListItemText primary="Реалізувати вхід через Google (Auth.js)." /></ListItem>
            <ListItem><ListItemText primary="Налаштувати Middleware для захисту внутрішніх роутів (неавторизований користувач перенаправляється на /login)." /></ListItem>
            <ListItem><ListItemText primary="Перевірити коректність роботи Callback URL." /></ListItem>
          </List>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>2. CRUD через Server Actions:</Typography>
          <List dense>
            <ListItem><ListItemText primary="Створення завдання та перемикання статусу (виконано/ні) через Server Actions." /></ListItem>
            <ListItem><ListItemText primary="Валідація даних через Zod як на клієнті, так і на стороні сервера всередині екшену." /></ListItem>
            <ListItem><ListItemText primary="Використання revalidatePath для миттєвого оновлення інтерфейсу." /></ListItem>
          </List>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>3. Інтеграція MUI + React Hook Form:</Typography>
          <List dense>
            <ListItem><ListItemText primary="Форми мають бути побудовані з використанням компонента Controller з RHF." /></ListItem>
            <ListItem><ListItemText primary="Відображення серверних та клієнтських помилок валідації під полями MUI." /></ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h3" color="primary" gutterBottom>
            Рівень 2: API, Архітектура та UX (Health & Patterns)
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>1. Розділення підходів (API vs Actions):</Typography>
          <List dense>
            <ListItem><ListItemText primary="Видалення завдання: Реалізувати через стандартний запит до API Route (DELETE /api/tasks/[id]), щоб показати вміння працювати з Route Handlers та fetch на клієнті." /></ListItem>
            <ListItem><ListItemText primary="Оновлення списку: Список завдань завантажується в Server Component, але необхідно додати кнопку 'Refresh', яка робить клієнтський запит до API роуту (GET)." /></ListItem>
          </List>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>2. UX (App Router Style):</Typography>
          <List dense>
            <ListItem><ListItemText primary="Обов'язкове використання файлів loading.tsx (скелетони) та error.tsx для обробки помилок." /></ListItem>
            <ListItem><ListItemText primary="Індикація процесу відправки форми через useFormStatus або useTransition." /></ListItem>
          </List>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>3. Здоров&apos;я проєкту (Project Health):</Typography>
          <List dense>
            <ListItem><ListItemText primary="ENV Validation: Валідація змінних оточення через Zod (додаток не повинен запускатися без потрібних ключів Google Auth)." /></ListItem>
            <ListItem><ListItemText primary="Код: Організація папок за стандартами (наприклад, shared/features/entities або логічне розділення actions/components/hooks). Використання абсолютних імпортів (@/...)." /></ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h3" color="primary" gutterBottom>
            Рівень 3: Real-time (SSE)
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>1. SSE Ендпоїнт:</Typography>
          <List dense>
            <ListItem><ListItemText primary="Створити Route Handler /api/events, який тримає з'єднання (Server-Sent Events) і відправляє: раз на 30 секунд heartbeat та сповіщення про вхід користувачів." /></ListItem>
          </List>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>2. Клієнтська частина:</Typography>
          <List dense>
            <ListItem><ListItemText primary="У хедері має бути індикатор/лог, який відображає ці повідомлення в реальному часі. Обов'язкова очистка (cleanup) з'єднання при розмонтуванні компонента." /></ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" component="h3" gutterBottom>
          Вимоги до документації
        </Typography>
        <List dense>
          <ListItem><ListItemText primary="README.md: Інструкція з розгортання, налаштування ENV та архітектурний блок (пояснення Server Actions vs API Routes)." /></ListItem>
          <ListItem><ListItemText primary="API.md: Документація ендпоїнтів та формат даних SSE." /></ListItem>
        </List>

        <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 4 }}>
          Критерії оцінювання
        </Typography>
        <List dense>
          <ListItem><ListItemText primary="TypeScript: Якість опису інтерфейсів, відсутність any." /></ListItem>
          <ListItem><ListItemText primary="Security: Перевірка сесії (Auth.js) не тільки в Middleware, але й всередині серверних функцій." /></ListItem>
          <ListItem><ListItemText primary="Next.js 16 Patterns: Правильне використання Client та Server Components." /></ListItem>
          <ListItem><ListItemText primary="MUI Usage: Грамотне використання компонентів бібліотеки." /></ListItem>
          <ListItem><ListItemText primary="Чистота коду: Відсутність логів, зрозумілий неймінг." /></ListItem>
          <ListItem><ListItemText primary="Організація роботи: Дотримання стандартів структури проєкту." /></ListItem>
        </List>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center', bgcolor: 'grey.100', p: 3, borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Термін виконання: 3–5 днів
          </Typography>
          <Typography variant="body1">
            Результат: Посилання на публічний репозиторій. Деплой на Vercel вітається!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
