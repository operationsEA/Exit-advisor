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
import { createBrowserSupabaseClient } from "@/supabase/client";
import { createUserProfile, getUserProfile } from "@/supabase/auth-helpers";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const supabase = createBrowserSupabaseClient();
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [message, setMessage] = useState("Processing your login...");

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Check if hash contains session data
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setStatus("error");
        setMessage("Authentication failed. Please try again.");
        return;
      }

      // Check if user profile exists
      const { user } = session;
      const existingProfile = await getUserProfile(supabase, user.id);

      if (!existingProfile.success) {
        // Create new user profile
        const profileResult = await createUserProfile(
          supabase,
          user.id,
          user.email,
          user.user_metadata?.full_name || user.email.split("@")[0],
          role || sessionStorage.getItem("userRole") || "buyer",
        );

        if (!profileResult.success) {
          setStatus("error");
          setMessage("Failed to create profile: " + profileResult.error);
          return;
        }
      }

      // Store role in session
      sessionStorage.setItem("userRole", role || "buyer");

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
