import { Box, Typography } from "@mui/material";
import React from "react";

export default function AppFooter() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 4,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        &copy; 2024 - {new Date().getFullYear()} Ruchi12377. All rights
        reserved.
      </Typography>
    </Box>
  );
}
