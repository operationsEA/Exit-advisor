"use client";

import {
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
import { FiBriefcase, FiLogOut, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signout } from "@/app/auth/actions";

const authButtons = [
  { label: "Login", href: "/auth/login", variant: "text" },
  { label: "Get Started", href: "/auth/signup", variant: "contained" },
];

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: FiBriefcase },
  //   { label: "Profile", href: "/dashboard/profile", icon: FiUser },
];

export default function NavbarAuth() {
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

  // Loading skeleton
  if (!isMounted || isLoading) {
    return (
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Skeleton variant="text" width={70} height={24} />
        <Skeleton
          variant="rectangular"
          width={70}
          height={40}
          sx={{ borderRadius: 1 }}
        />
        <Skeleton
          variant="rectangular"
          width={90}
          height={40}
          sx={{ borderRadius: 1 }}
        />
      </Box>
    );
  }

  if (!isAuth) {
    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {authButtons.map((btn) => (
          <Link
            key={btn.href}
            href={btn.href}
            style={{ textDecoration: "none" }}
          >
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
      </Box>
    );
  }

  return (
    <>
      {/* Dashboard link (auth-only) */}
      <Link
        href="/dashboard"
        style={{ textDecoration: "none", color: "#0884ff" }}
      >
        Dashboard
      </Link>

      {/* User avatar / dropdown trigger */}
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
          src={user?.user_metadata?.avatar_url || undefined}
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
            {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
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
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            minWidth: 280,
            mt: 1,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        }}
      >
        {menuItems.map((item) => {
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
        })}

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
  );
}
