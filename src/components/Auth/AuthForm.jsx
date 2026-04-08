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
import { createBrowserSupabaseClient } from "@/supabase/client";

export default function AuthForm({ selectedRole }) {
  const supabase = createBrowserSupabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignupWithEmail = async () => {
    if (!email || !password || !fullName) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Check if email already exists in Profiles table
      const { data: existingProfile } = await supabase
        .from("Profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (existingProfile) {
        setError("This email is already registered. Please sign in instead.");
        return;
      }

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        role: selectedRole,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify`,
          data: {
            full_name: fullName,
            role: selectedRole,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      // Store signup info for verification
      sessionStorage.setItem("userRole", selectedRole);
      sessionStorage.setItem("userEmail", email);

      // Redirect to verification pending page
      window.location.href = `/auth/verify-pending`;
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      // Get base URL for redirect
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      // Sign in with Google via Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${baseUrl}/auth/callback?role=${selectedRole}`,
          queryParams: {
            prompt: "consent",
          },
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError(err.message || "Google signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <Typography variant="body2" sx={{ color: "#6b7280" }}>
        Please select a role above to continue
      </Typography>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Google Signup */}
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
        onClick={handleGoogleSignup}
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

      {/* Email & Password Form */}
      <TextField
        fullWidth
        label="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
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
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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

      <Button
        fullWidth
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
        onClick={handleSignupWithEmail}
        disabled={loading}
      >
        {loading ? "Creating..." : "Sign Up"}
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
        Already have an account?{" "}
        <a
          href="/auth/login"
          style={{
            color: "#0884ff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Sign In
        </a>
      </Typography>
    </Box>
  );
}
