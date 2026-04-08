"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import Link from "next/link";
import { FiMail } from "react-icons/fi";

export default function VerifyPendingPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 12 }}>
      <Box sx={{ textAlign: "center" }}>
        <FiMail
          size={48}
          color="#0884ff"
          style={{
            margin: "auto",
          }}
        />
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", my: 2, color: "#111827" }}
        >
          Check Your Email
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280", mb: 4 }}>
          We sent a verification link to your email. Click it to confirm your
          account and complete signup.
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "#9ca3af", display: "block", mb: 4 }}
        >
          Didn't receive it? Check spam folder or try signing up again.
        </Typography>
        <Link href="/auth/signup" style={{ textDecoration: "none" }}>
          <Button variant="outlined" sx={{ borderColor: "#d1d5db" }}>
            Back to Signup
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
