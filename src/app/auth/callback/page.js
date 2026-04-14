"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { verifyAndCreateProfile } from "@/app/auth/actions";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const { refreshAuth } = useAuth();
  const role = searchParams.get("role");
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [message, setMessage] = useState("Processing your login...");

  useEffect(() => {
    handleCallback();
  }, [role]);

  const handleCallback = async () => {
    try {
      // Call server action to verify token and create/get profile
      await refreshAuth(); // Ensure we have the latest session info
      const result = await verifyAndCreateProfile(role);

      if (!result.success) {
        setStatus("error");
        setMessage(result.error || "Authentication failed. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("Login successful! Redirecting...");

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress sx={{ mb: 3, color: "#0884ff" }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 2, color: "#111827" }}
        >
          {message}
        </Typography>

        {status === "error" && (
          <Alert severity="error" sx={{ mt: 3 }}>
            <Typography variant="body2">{message}</Typography>
          </Alert>
        )}
      </Box>
    </Container>
  );
}
