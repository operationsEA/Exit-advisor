"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@/supabase/client";

export default function ResetPasswordForm() {
  const supabase = createBrowserSupabaseClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Check if user has valid session from reset link
    checkSession();
  }, []);

  const checkSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error || !session) {
      setError("Invalid or expired reset link. Please request a new one.");
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Alert severity="success">
        Password reset successful! Redirecting to sign in...
      </Alert>
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
        label="New Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        size="small"
        margin="dense"
        sx={{ mb: 1.5, "& input": { px: 1 } }}
        InputProps={{
          startAdornment: (
            <FiLock
              style={{ marginRight: "8px", color: "#0884ff", fontSize: "18px" }}
            />
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                size="small"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        type={showConfirm ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={loading}
        size="small"
        margin="dense"
        sx={{ mb: 2, "& input": { px: 1 } }}
        InputProps={{
          startAdornment: (
            <FiLock
              style={{ marginRight: "8px", color: "#0884ff", fontSize: "18px" }}
            />
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirm(!showConfirm)}
                edge="end"
                size="small"
              >
                {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </IconButton>
            </InputAdornment>
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
        onClick={handleResetPassword}
        disabled={loading}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </Button>
    </Box>
  );
}
