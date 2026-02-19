import type { Metadata } from "next";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/Footer";
import { Box } from "@mui/material";

export const metadata: Metadata = {
  title: "Task Tracker",
  description: "Веб-додаток для управління завданнями",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>
        <SessionProvider>
          <ThemeRegistry>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
              </Box>
              <Footer />
            </Box>
          </ThemeRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
