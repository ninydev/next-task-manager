import { auth } from "@/auth";

export const dynamic = "force-dynamic";

// Глобальний набір для розсилки повідомлень всім підключеним клієнтам
// У Node.js (локально) це працюватиме в межах одного процесу
const clients = new Set<ReadableStreamDefaultController>();

export async function GET() {
  const session = await auth();
  const userName = session?.user?.name || "Гість";

  const encoder = new TextEncoder();
  let intervalId: NodeJS.Timeout;
  let currentController: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(controller) {
      currentController = controller;
      clients.add(controller);
      console.log(`SSE: Клієнт підключився (${userName}). Всього: ${clients.size}`);

      // Функція для розсилки всім
      const broadcast = (data: { message?: string; status?: string; timestamp?: string }) => {
        const msg = encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
        clients.forEach((client) => {
          try {
            client.enqueue(msg);
          } catch {
            clients.delete(client);
          }
        });
      };

      // Сповіщаємо всіх про нове підключення
      broadcast({ message: `Користувач ${userName} увійшов у систему` });

      // Серцебиття (heartbeat) раз на 30 секунд для підтримки з'єднання
      intervalId = setInterval(() => {
        try {
          const heartbeat = { status: "ok", timestamp: new Date().toISOString() };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(heartbeat)}\n\n`));
        } catch {
          clearInterval(intervalId);
          clients.delete(controller);
        }
      }, 30000);
    },
    cancel() {
      if (currentController) {
        clients.delete(currentController);
        console.log(`SSE: Клієнт відключився. Всього: ${clients.size}`);
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
