"use client";

import { AppBar, Toolbar, Typography, Button, Box, Avatar, Snackbar, Alert, IconButton, useTheme } from "@mui/material";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useColorMode } from "./ThemeRegistry/ThemeRegistry";

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Header({ user }: HeaderProps) {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const [isConnected, setIsConnected] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  useEffect(() => {
    // Діагностика в консолі браузера
    console.log("Header user data:", { 
      name: user.name, 
      image: user.image,
      imagePrefix: user.image?.substring(0, 20)
    });
  }, [user]);

  useEffect(() => {
    const eventSource = new EventSource("/api/events");

    eventSource.onopen = () => {
      console.log("SSE connection opened");
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status === "ok") {
          console.log("SSE heartbeat:", data.timestamp);
        } else if (data.message) {
          console.log("SSE message received:", data.message);
          setSnackbar({ open: true, message: data.message });
        }
      } catch (e) {
        console.error("Error parsing SSE data:", e);
      }
    };

    eventSource.onerror = (e) => {
      console.error("SSE error:", e);
      setIsConnected(false);
      // Не закриваємо примусово, щоб дозволити браузеру перепідключитися
      // Але якщо стан CLOSED, то варто закрити
      if (eventSource.readyState === EventSource.CLOSED) {
        eventSource.close();
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Task Tracker
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isConnected ? (
            <WifiIcon color="success" fontSize="small" titleAccess="SSE Connected" />
          ) : (
            <WifiOffIcon color="error" fontSize="small" titleAccess="SSE Disconnected" />
          )}

          <IconButton onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar 
              src={user.image || undefined} 
              sx={{ width: 32, height: 32 }}
              imgProps={{ referrerPolicy: "no-referrer" }}
            >
              {user.name?.[0]}
            </Avatar>
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
              {user.name}
            </Typography>
          </Box>
          
          <Button color="inherit" component={Link} href="/about">
            Про завдання
          </Button>
          
          <Button color="inherit" onClick={() => signOut({ callbackUrl: "/login" })}>
            Вийти
          </Button>
        </Box>
      </Toolbar>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppBar>
  );
}
