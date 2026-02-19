"use client";

import { Task } from "@/lib/validations/task";
import { 
  List, 
  ListItem, 
  ListItemText, 
  Checkbox, 
  IconButton, 
  Typography, 
  Paper,
  Box,
  Button,
  CircularProgress,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toggleTaskStatusAction } from "@/actions/tasks";
import { useState, useTransition, useEffect, useCallback, useRef } from "react";

interface TaskListProps {
  initialTasks: Task[];
  initialTotal: number;
}

export default function TaskList({ initialTasks, initialTotal }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const isFirstRender = useRef(true);

  // Функція для завантаження даних з API
  const fetchTasks = useCallback(async (currentPage: number, currentPageSize: number) => {
    setIsLoading(true);
    console.log(`TaskList: Fetching page ${currentPage}, size ${currentPageSize}`);
    try {
      // Додаємо t=... для запобігання кешуванню браузером
      const response = await fetch(`/api/tasks?page=${currentPage}&limit=${currentPageSize}&t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`TaskList: Received ${data.tasks.length} tasks, total ${data.total}`);
        setTasks(data.tasks);
        setTotalCount(data.total);
      } else {
        console.error("TaskList: Failed to fetch tasks", response.statusText);
      }
    } catch (error) {
      console.error("TaskList: Error fetching tasks", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Оновлюємо стейт при зміні пропсів (від Server Component)
  useEffect(() => {
    console.log("TaskList: initialTasks updated");
    setTasks(initialTasks);
    setTotalCount(initialTotal);
    setPage(1); 
  }, [initialTasks, initialTotal]);

  // Завантаження при зміні сторінки або розміру
  useEffect(() => {
    // Якщо це перший рендер, дані вже отримані від сервера в initialTasks
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    fetchTasks(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, fetchTasks]);

  // Оновлення статусу через Server Action
  const handleToggle = async (id: string, completed: boolean) => {
    startTransition(async () => {
      await toggleTaskStatusAction(id, completed);
      // Оптимістичне оновлення локального стану
      setTasks(tasks.map(t => t.id === id ? { ...t, completed } : t));
    });
  };

  // Видалення завдання через API Route (стандартний fetch)
  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені?")) return;

    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Якщо на сторінці залишився один елемент і це не перша сторінка, переходимо на попередню
      if (tasks.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchTasks(page, pageSize);
      }
    } else {
      alert("Помилка при видаленні");
    }
  };

  // Оновлення списку (скидаємо на 1 сторінку)
  const handleRefresh = async () => {
    if (page === 1) {
      fetchTasks(1, pageSize);
    } else {
      setPage(1);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    setPageSize(event.target.value as number);
    setPage(1); // При зміні розміру повертаємось на першу сторінку
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalCount === 0 && !isLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="text.secondary">Завдань поки немає</Typography>
        <Button 
          startIcon={<RefreshIcon />} 
          onClick={handleRefresh} 
          sx={{ mt: 2 }}
        >
          Оновити
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Ваші завдання ({totalCount})</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="page-size-label">На сторінці</InputLabel>
            <Select
              labelId="page-size-label"
              value={pageSize}
              onChange={handlePageSizeChange}
              label="На сторінці"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={isLoading ? <CircularProgress size={16} /> : <RefreshIcon />} 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Оновити
          </Button>
        </Box>
      </Box>

      <Paper elevation={2} sx={{ mb: 2, minHeight: tasks.length > 0 ? 'auto' : 200, display: 'flex', flexDirection: 'column' }}>
        {isLoading && tasks.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            {tasks.map((task) => (
              <ListItem
                key={task.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
              >
                <Checkbox
                  edge="start"
                  checked={task.completed}
                  onChange={(e) => handleToggle(task.id, e.target.checked)}
                  tabIndex={-1}
                  disableRipple
                  sx={{ ml: 1 }}
                />
                <ListItemText
                  primary={task.title}
                  secondary={task.description}
                  sx={{ 
                    textDecoration: task.completed ? "line-through" : "none",
                    color: task.completed ? "text.disabled" : "text.primary"
                  }}
                />
              </ListItem>
            ))}
            {tasks.length === 0 && isLoading && (
               <ListItem sx={{ justifyContent: 'center' }}>
                 <Typography variant="body2" color="text.secondary">Завантаження...</Typography>
               </ListItem>
            )}
          </List>
        )}
      </Paper>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
            disabled={isLoading}
          />
        </Box>
      )}
    </Box>
  );
}
