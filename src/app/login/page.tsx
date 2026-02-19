"use client";

import { signIn } from "next-auth/react";
import { Button, Box, Typography, Container, Paper } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function LoginPage() {
  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/tasks" });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Task Tracker
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Будь ласка, увійдіть у свій аккаунт для продовження
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleSignIn}
            sx={{ py: 1.5 }}
          >
            Увійти через Google
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
