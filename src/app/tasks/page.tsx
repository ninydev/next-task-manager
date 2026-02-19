import { auth } from "@/auth";
import { getTasks } from "@/lib/tasks";
import { Container, Typography, Box } from "@mui/material";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import Header from "@/components/Header";

export default async function TasksPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null; // Вже має оброблятися middleware
  }

  const { tasks: initialTasks, total: initialTotal } = await getTasks(session.user.id, 1, 5);

  return (
    <>
      <Header user={session.user} />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Task Tracker
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <TaskForm />
        </Box>

        <TaskList initialTasks={initialTasks} initialTotal={initialTotal} />
      </Container>
    </>
  );
}
