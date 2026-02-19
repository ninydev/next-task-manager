import { Container, Skeleton, Box, Paper, List, ListItem } from "@mui/material";

export default function Loading() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Skeleton variant="text" sx={{ fontSize: "2rem", mb: 2, mx: "auto", width: "60%" }} />
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={42} />
      </Box>
      <Paper elevation={2}>
        <List>
          {[1, 2, 3].map((i) => (
            <ListItem key={i} sx={{ py: 2 }}>
              <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
              <Box sx={{ width: "100%" }}>
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="70%" />
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
