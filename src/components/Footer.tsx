"use client";

import { Box, Container, Typography, Link as MuiLink, Stack } from "@mui/material";
import NextLink from "next/link";

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 3, mt: 'auto', backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900] }}>
      <Container maxWidth="sm">
        <Stack spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Oleksandr Nykytin
          </Typography>
          <Stack direction="row" spacing={2}>
            <MuiLink component={NextLink} href="/about" color="inherit" underline="hover">
              Про завдання
            </MuiLink>
            <MuiLink href="https://gerc.ua" target="_blank" rel="noopener" color="inherit" underline="hover">
              gerc.ua
            </MuiLink>
            <MuiLink href="https://itstep.org" target="_blank" rel="noopener" color="inherit" underline="hover">
              itstep.org
            </MuiLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
