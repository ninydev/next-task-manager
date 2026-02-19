"use client";

import { useEffect } from "react";
import { Container, Typography, Button, Box } from "@mui/material";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h5" color="error" gutterBottom>
        Щось пішло не так!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {error.message || "Виникла непередбачена помилка"}
      </Typography>
      <Box>
        <Button variant="contained" onClick={() => reset()}>
          Спробувати знову
        </Button>
      </Box>
    </Container>
  );
}
