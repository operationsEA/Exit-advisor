"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { FiMail } from "react-icons/fi";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/supabase/client";

export default function ForgotPasswordForm() {
  const supabase = createBrowserSupabaseClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetRequest = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${baseUrl}/auth/reset-password`,
        },
      );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box>
        <Alert severity="success" sx={{ mb: 3 }}>
          Reset link sent to {email}. Check your inbox and spam folder.
        </Alert>
        <Link href="/auth/login" style={{ textDecoration: "none" }}>
          <Button variant="outlined" fullWidth>
            Back to Sign In
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        size="small"
        margin="dense"
        sx={{ mb: 2, "& input": { px: 1 } }}
        InputProps={{
          startAdornment: (
            <FiMail
              style={{ marginRight: "8px", color: "#0884ff", fontSize: "18px" }}
            />
          ),
        }}
      />

      <Button
        fullWidth
        variant="contained"
        size="small"
        sx={{
          backgroundColor: "#0884ff",
          py: 1,
          "&:hover": { backgroundColor: "#0670d6" },
        }}
        onClick={handleResetRequest}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 2,
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        <Link
          href="/auth/login"
          style={{ color: "#0884ff", textDecoration: "none" }}
        >
          Back to Sign In
        </Link>
      </Typography>
    </Box>
  );
}
