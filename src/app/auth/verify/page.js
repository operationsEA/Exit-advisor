"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import Link from "next/link";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { createBrowserSupabaseClient } from "@/supabase/client";
import { createUserProfile, getUserProfile } from "@/supabase/auth-helpers";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      // Get the current session (Supabase auto-verifies email after clicking link)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setStatus("error");
        setMessage(
          "Email not verified yet. Please click the link in your email.",
        );
        return;
      }

      const { user } = session;

      // Check if user profile exists
      const profileResult = await getUserProfile(supabase, user.id);

      if (!profileResult.success) {
        // Create profile if doesn't exist
        const createResult = await createUserProfile(
          supabase,
          user.id,
          user.email,
          user.user_metadata?.full_name || user.email.split("@")[0],
          sessionStorage.getItem("userRole") || "buyer",
        );

        if (!createResult.success) {
          setStatus("error");
          setMessage("Failed to create profile. " + createResult.error);
          return;
        }
      }

      setStatus("success");
      setMessage("Email verified successfully!");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Verification failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: "center" }}>
        {/* Loading State */}
        {status === "verifying" && (
          <>
            <CircularProgress sx={{ mb: 3, color: "#0884ff" }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 1, color: "#111827" }}
            >
              Verifying Your Email...
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Please wait while we verify your account.
            </Typography>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <FiCheckCircle
              size={48}
              color="#10b981"
              style={{ marginBottom: "1.5rem" }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 2, color: "#111827" }}
            >
              Email Verified!
            </Typography>
            <Alert severity="success" sx={{ mb: 3 }}>
              Your account has been verified successfully. Redirecting to
              dashboard...
            </Alert>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <FiAlertCircle
              size={48}
              color="#ef4444"
              style={{ marginBottom: "1.5rem" }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 2, color: "#111827" }}
            >
              Verification Failed
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              {message}
            </Alert>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Link href="/auth/signup" style={{ textDecoration: "none" }}>
                <Button variant="contained" sx={{ backgroundColor: "#0884ff" }}>
                  Try Again
                </Button>
              </Link>
              <Link href="/" style={{ textDecoration: "none" }}>
                <Button variant="outlined">Go Home</Button>
              </Link>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}
