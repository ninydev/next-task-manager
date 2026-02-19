"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskInput } from "@/lib/validations/task";
import { TextField, Button, Box, Alert } from "@mui/material";
import { createTaskAction } from "@/actions/tasks";
import { useState, useTransition } from "react";

export default function TaskForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: TaskInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await createTaskAction(data);
      if (result?.error) {
        setServerError(result.error);
      } else {
        reset();
      }
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 4 }}>
      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Назва завдання"
            fullWidth
            margin="normal"
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Опис (необов'язково)"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        )}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={isPending}
        sx={{ mt: 2 }}
        fullWidth
      >
        {isPending ? "Додавання..." : "Додати завдання"}
      </Button>
    </Box>
  );
}
