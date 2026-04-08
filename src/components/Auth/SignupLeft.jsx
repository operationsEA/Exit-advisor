"use client";

import { Box, Typography } from "@mui/material";
import { FiBriefcase, FiCheckCircle } from "react-icons/fi";

export default function SignupLeft() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-end",
        px: { xs: 4, sm: 6, lg: 8 },
        minHeight: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          mb: 4,
          color: "#111827",
          lineHeight: 1.3,
          maxWidth: "450px",
        }}
      >
        Buy, Sell & Grow Your Business
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "#6b7280",
          mb: 6,
          maxWidth: "450px",
          lineHeight: 1.6,
        }}
      >
        Connect with verified buyers and sellers on the most trusted business
        marketplace.
      </Typography>
    </Box>
  );
}
