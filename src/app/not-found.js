"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Skeleton,
} from "@mui/material";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiHome, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";

export default function NotFoundPage() {
  const { isAuth } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  const dashboardLink = isAuth ? "/dashboard" : "/auth/login";
  const dashboardText = isAuth ? "Go to Dashboard" : "Login to Continue";

  // Two-pass rendering: server render shows skeleton, after hydration show real content
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Server render: show skeleton (isMounted = false)
  if (!isMounted) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 200px)",
            py: 6,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              textAlign: "center",
              p: 6,
              backgroundColor: "rgba(8, 132, 255, 0.02)",
              border: "1px solid rgba(8, 132, 255, 0.1)",
              borderRadius: 2,
            }}
          >
            {/* 404 Number Skeleton */}
            <Skeleton
              variant="text"
              width={200}
              height={120}
              sx={{ mx: "auto", mb: 2 }}
            />

            {/* Heading Skeleton */}
            <Skeleton
              variant="text"
              width={300}
              height={50}
              sx={{ mx: "auto", mb: 2 }}
            />

            {/* Description Skeleton */}
            <Skeleton
              variant="text"
              width="100%"
              height={30}
              sx={{ mx: "auto", mb: 1 }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={30}
              sx={{ mx: "auto", mb: 4 }}
            />

            {/* Buttons Skeleton */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Skeleton variant="rectangular" width={150} height={45} />
              <Skeleton variant="rectangular" width={150} height={45} />
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Client render after hydration: show actual content with auth state
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 200px)",
          py: 6,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            p: 6,
            backgroundColor: "rgba(8, 132, 255, 0.02)",
            border: "1px solid rgba(8, 132, 255, 0.1)",
            borderRadius: 2,
          }}
        >
          {/* 404 Number */}
          <Typography
            sx={{
              fontSize: "6rem",
              fontWeight: "bold",
              color: "#0884ff",
              lineHeight: 1,
              mb: 2,
            }}
          >
            404
          </Typography>

          {/* Heading */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#111827",
              mb: 2,
            }}
          >
            Page Not Found
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: "#6b7280",
              mb: 4,
              fontSize: "1.1rem",
            }}
          >
            Sorry, the page you're looking for doesn't exist or has been moved.
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#0884ff",
                  color: "#0884ff",
                  textTransform: "none",
                  fontSize: "1rem",
                  px: 3,
                  "&:hover": {
                    borderColor: "#0670d6",
                    backgroundColor: "rgba(8, 132, 255, 0.05)",
                  },
                }}
              >
                <FiArrowLeft style={{ marginRight: "8px" }} />
                Go Home
              </Button>
            </Link>

            <Link href={dashboardLink} style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#0884ff",
                  color: "white",
                  textTransform: "none",
                  fontSize: "1rem",
                  px: 3,
                  "&:hover": { backgroundColor: "#0670d6" },
                }}
              >
                <FiHome style={{ marginRight: "8px" }} />
                {dashboardText}
              </Button>
            </Link>
          </Box>

          {/* Additional Help Text */}
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 4,
              color: "#9ca3af",
            }}
          >
            If you believe this is an error, please{" "}
            <Link
              href="/"
              style={{
                color: "#0884ff",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              contact support
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
