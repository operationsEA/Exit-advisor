"use client";

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiBriefcase, FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signout } from "@/app/auth/actions";

export default function Navbar() {
  const { isAuth, user, isLoading, refreshAuth } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  // Two-pass rendering: server render shows skeleton, after hydration show real navbar
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    setAnchorEl(null);
    // Call server action to sign out
    await signout();

    // Refresh auth context to update UI
    await refreshAuth();

    // Then redirect
    setTimeout(() => {
      router.push("/auth/login");
    }, 100);
  };

  // Server render: show skeleton (isMounted = false)
  if (!isMounted || isLoading) {
    return (
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#ffffff",
          color: "#0884ff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{ display: "flex", justifyContent: "space-between", px: 0 }}
          >
            {/* Logo Skeleton */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Skeleton variant="circular" width={28} height={28} />
              <Skeleton variant="text" width={120} height={32} />
            </Box>

            {/* Navigation Skeleton */}
            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
              <Skeleton variant="text" width={70} height={24} />
              <Skeleton variant="text" width={70} height={24} />
              <Skeleton variant="text" width={100} height={24} />
              <Skeleton variant="rectangular" width={70} height={40} />
              <Skeleton variant="rectangular" width={90} height={40} />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }

  // Client render after hydration: show actual navbar with auth state
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#ffffff",
        color: "#0884ff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", px: 0 }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FiBriefcase size={28} color="#0884ff" />
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#0884ff",
              }}
            >
              BizForSale
            </span>
          </Link>

          {/* Navigation Links */}
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            <Link
              href="/browse"
              style={{ textDecoration: "none", color: "#0884ff" }}
            >
              Browse
            </Link>

            {isAuth && (
              <Link
                href="/sell"
                style={{ textDecoration: "none", color: "#0884ff" }}
              >
                Sell
              </Link>
            )}

            {!isAuth && (
              <Link
                href="/about"
                style={{ textDecoration: "none", color: "#0884ff" }}
              >
                About
              </Link>
            )}

            {/* Dashboard Link - Authenticated Users */}
            {isAuth && (
              <Link
                href="/dashboard"
                style={{ textDecoration: "none", color: "#0884ff" }}
              >
                Dashboard
              </Link>
            )}

            {/* Guest User Auth Buttons */}
            {!isAuth && (
              <>
                <Link href="/auth/login" style={{ textDecoration: "none" }}>
                  <Button
                    variant="text"
                    sx={{
                      color: "#0884ff",
                      textTransform: "none",
                      fontSize: "1rem",
                      "&:hover": { backgroundColor: "rgba(8, 132, 255, 0.05)" },
                    }}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup" style={{ textDecoration: "none" }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#0884ff",
                      color: "white",
                      textTransform: "none",
                      fontSize: "1rem",
                      "&:hover": { backgroundColor: "#0670d6" },
                    }}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Authenticated User Menu */}
            {isAuth && (
              <>
                <Box
                  onClick={handleMenuOpen}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2,
                    py: 1,
                    backgroundColor: "rgba(8, 132, 255, 0.05)",
                    border: "1px solid rgba(8, 132, 255, 0.1)",
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(8, 132, 255, 0.1)",
                      border: "1px solid rgba(8, 132, 255, 0.2)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#0884ff",
                      width: 40,
                      height: 40,
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {user?.email?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "#111827",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {user?.user_metadata?.full_name ||
                        user?.email?.split("@")[0]}
                    </Typography>
                    {user?.user_metadata?.role && (
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: "#0884ff",
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {user.user_metadata.role} Account
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      minWidth: 280,
                      mt: 1,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Divider sx={{ my: 1 }} />

                  {/* Menu Items */}
                  <MenuItem
                    component={Link}
                    href="/dashboard"
                    onClick={handleMenuClose}
                    sx={{ fontSize: "0.9rem" }}
                  >
                    <FiBriefcase style={{ marginRight: "12px" }} size={18} />
                    Dashboard
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    href="/dashboard/profile"
                    onClick={handleMenuClose}
                    sx={{ fontSize: "0.9rem" }}
                  >
                    <FiUser style={{ marginRight: "12px" }} size={18} />
                    Profile
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    href="/dashboard/settings"
                    onClick={handleMenuClose}
                    sx={{ fontSize: "0.9rem" }}
                  >
                    <FiSettings style={{ marginRight: "12px" }} size={18} />
                    Settings
                  </MenuItem>

                  <Divider sx={{ my: 1 }} />

                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      color: "#d32f2f",
                      fontSize: "0.9rem",
                      "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.05)" },
                    }}
                  >
                    <FiLogOut style={{ marginRight: "12px" }} size={18} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
