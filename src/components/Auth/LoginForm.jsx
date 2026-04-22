"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { SiGoogle } from "react-icons/si";
import { login } from "@/app/auth/actions";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createBrowserSupabaseClient } from "@/supabase/client";

export default function LoginForm() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      await refreshAuth();

      // Now redirect - AuthContext will be updated
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (err) {
      setError(err.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${baseUrl}/auth/callback`,
          queryParams: {
            prompt: "consent",
          },
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError(err.message || "Google sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSignIn}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        variant="outlined"
        size="small"
        sx={{
          borderColor: "#d1d5db",
          color: "#111827",
          textTransform: "none",
          fontSize: "0.9rem",
          py: 1,
          mb: 2,
          display: "flex",
          gap: 2,
          "&:hover": {
            borderColor: "#0884ff",
            backgroundColor: "rgba(8, 132, 255, 0.05)",
          },
        }}
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <SiGoogle size={18} />
        Google
      </Button>

      <Divider sx={{ my: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: "#9ca3af", fontSize: "0.75rem" }}
        >
          OR
        </Typography>
      </Divider>

      <TextField
        fullWidth
        name="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        size="small"
        margin="dense"
        sx={{ mb: 1.5, "& input": { px: 1 } }}
        InputProps={{
          startAdornment: (
            <FiMail
              style={{ marginRight: "8px", color: "#0884ff", fontSize: "18px" }}
            />
          ),
        }}
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        size="small"
        margin="dense"
        sx={{ mb: 1, "& input": { px: 1 } }}
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

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mb: 2,
          color: "#0884ff",
          textAlign: "right",
          fontSize: "0.75rem",
        }}
      >
        <a
          href="/auth/forgot-password"
          style={{
            color: "#0884ff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Forgot Password?
        </a>
      </Typography>

      <Button
        fullWidth
        type="submit"
        variant="contained"
        size="small"
        sx={{
          backgroundColor: "#0884ff",
          color: "white",
          textTransform: "none",
          fontSize: "0.9rem",
          py: 1,
          "&:hover": { backgroundColor: "#0670d6" },
        }}
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 2,
          color: "#6b7280",
          textAlign: "center",
          fontSize: "0.75rem",
        }}
      >
        Don't have an account?{" "}
        <a
          href="/auth/signup"
          style={{
            color: "#0884ff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Sign Up
        </a>
      </Typography>
    </Box>
  );
}
