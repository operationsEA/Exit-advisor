"use client";

import {
  AppBar,
  Toolbar,
  Box,
  Button,
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

// Navbar configuration - centralized menu and nav items
const navConfig = {
  // Public navigation links (shown based on auth state)
  publicLinks: [
    {
      label: "Browse",
      href: "/browse",
      requiresAuth: false,
      hideIfAuth: false,
    },
    { label: "About", href: "/about", requiresAuth: false, hideIfAuth: true },
    { label: "Sell", href: "/sell", requiresAuth: true, hideIfAuth: false },
    {
      label: "Dashboard",
      href: "/dashboard",
      requiresAuth: true,
      hideIfAuth: false,
    },
  ],
  // Auth action buttons (shown only to unauthenticated users)
  authButtons: [
    { label: "Login", href: "/auth/login", variant: "text" },
    { label: "Get Started", href: "/auth/signup", variant: "contained" },
  ],
  // User dropdown menu items (shown only to authenticated users)
  menuItems: [
    { label: "Dashboard", href: "/dashboard", icon: FiBriefcase },
    { label: "Profile", href: "/dashboard/profile", icon: FiUser },
    { label: "Settings", href: "/dashboard/settings", icon: FiSettings },
  ],
};

export default function Navbar() {
  const { isAuth, user, isLoading, refreshAuth } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleMenuClose();
    await signout();
    await refreshAuth();
    setTimeout(() => {
      router.push("/auth/login");
    }, 100);
  };

  // Filter visible nav links based on auth state
  const visibleLinks = navConfig.publicLinks.filter((link) => {
    if (link.requiresAuth && !isAuth) return false;
    if (link.hideIfAuth && isAuth) return false;
    return true;
  });

  // Render auth buttons from config
  const renderAuthButtons = () => (
    <>
      {navConfig.authButtons.map((btn) => (
        <Link key={btn.href} href={btn.href} style={{ textDecoration: "none" }}>
          <Button
            variant={btn.variant}
            sx={{
              color: btn.variant === "text" ? "#0884ff" : "white",
              backgroundColor:
                btn.variant === "contained" ? "#0884ff" : "transparent",
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                backgroundColor:
                  btn.variant === "contained"
                    ? "#0670d6"
                    : "rgba(8, 132, 255, 0.05)",
              },
            }}
          >
            {btn.label}
          </Button>
        </Link>
      ))}
    </>
  );

  // Render menu items from config
  const renderMenuItems = () =>
    navConfig.menuItems.map((item) => {
      const Icon = item.icon;
      return (
        <MenuItem
          key={item.href}
          component={Link}
          href={item.href}
          onClick={handleMenuClose}
          sx={{ fontSize: "0.9rem" }}
        >
          <Icon style={{ marginRight: "12px" }} size={18} />
          {item.label}
        </MenuItem>
      );
    });

  // Loading skeleton
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 4,
            maxWidth: "1280px",
            mx: "auto",
            width: "100%",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              px: 0,
              width: "100%",
            }}
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
        </Box>
      </AppBar>
    );
  }

  // Main navbar render
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#ffffff",
        color: "#0884ff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
          mx: "auto",
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 0,
            width: "100%",
          }}
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

          {/* Navigation Container */}
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            {/* Render navigation links from config */}
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ textDecoration: "none", color: "#0884ff" }}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth state dependent content */}
            {!isAuth ? (
              renderAuthButtons()
            ) : (
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

                {/* Dropdown menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  PaperProps={{
                    sx: {
                      minWidth: 280,
                      mt: 1,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {/* Menu items from config */}
                  {renderMenuItems()}

                  <Divider sx={{ my: 1 }} />

                  {/* Logout button */}
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      color: "#d32f2f",
                      fontSize: "0.9rem",
                      "&:hover": {
                        backgroundColor: "rgba(211, 47, 47, 0.05)",
                      },
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
      </Box>
    </AppBar>
  );
}
