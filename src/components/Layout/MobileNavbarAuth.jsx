"use client";

import { useState } from "react";
import {
  IconButton,
  Drawer,
  Box,
  Typography,
  Divider,
  Button,
  Avatar,
  Skeleton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import {
  FiMenu,
  FiX,
  FiBriefcase,
  FiLogOut,
  FiShoppingBag,
  FiBookOpen,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signout } from "@/app/auth/actions";

export default function MobileNavbarAuth({ staticLinks }) {
  const [open, setOpen] = useState(false);
  const { isAuth, user, isLoading, refreshAuth } = useAuth();
  const router = useRouter();

  const close = () => setOpen(false);

  const handleLogout = async () => {
    close();
    await signout();
    await refreshAuth();
    setTimeout(() => router.push("/auth/login"), 100);
  };

  const staticLinkIcons = {
    "/business-for-sale": FiShoppingBag,
    "/blogs": FiBookOpen,
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} sx={{ color: "#0884ff", p: 1 }}>
        <FiMenu size={24} />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={close}
        PaperProps={{
          sx: { width: 280, display: "flex", flexDirection: "column" },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2.5,
            py: 2,
          }}
        >
          <Typography
            sx={{ fontWeight: 700, color: "#111827", fontSize: "1rem" }}
          >
            Menu
          </Typography>
          <IconButton onClick={close} size="small" sx={{ color: "#6b7280" }}>
            <FiX size={20} />
          </IconButton>
        </Box>

        <Divider />

        {/* Auth section */}
        <Box sx={{ px: 2.5, py: 2 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={18} />
                <Skeleton variant="text" width="40%" height={14} />
              </Box>
            </Box>
          ) : isAuth ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                bgcolor: "rgba(8,132,255,0.05)",
                border: "1px solid rgba(8,132,255,0.12)",
                borderRadius: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#0884ff",
                  width: 40,
                  height: 40,
                  fontSize: "1rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {user?.email?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#111827",
                  }}
                  noWrap
                >
                  {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
                </Typography>
                {user?.user_metadata?.role && (
                  <Typography
                    sx={{
                      fontSize: "0.72rem",
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
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                fullWidth
                component={Link}
                href="/auth/login"
                onClick={close}
                variant="outlined"
                sx={{
                  borderColor: "#0884ff",
                  color: "#0884ff",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "rgba(8,132,255,0.05)",
                    borderColor: "#0670d6",
                  },
                }}
              >
                Login
              </Button>
              <Button
                fullWidth
                component={Link}
                href="/auth/signup"
                onClick={close}
                variant="contained"
                sx={{
                  bgcolor: "#0884ff",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": { bgcolor: "#0670d6" },
                }}
              >
                Get Started
              </Button>
            </Box>
          )}
        </Box>

        <Divider />

        {/* Nav links: static + dashboard */}
        <List disablePadding sx={{ flex: 1 }}>
          {staticLinks.map((link) => {
            const Icon = staticLinkIcons[link.href] || FiShoppingBag;
            return (
              <ListItem key={link.href} disablePadding>
                <ListItemButton
                  component={Link}
                  href={link.href}
                  onClick={close}
                  sx={{
                    px: 2.5,
                    py: 1.4,
                    gap: 1.5,
                    color: "#374151",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: "rgba(8,132,255,0.05)",
                      color: "#0884ff",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, color: "inherit" }}>
                    <Icon size={18} />
                  </ListItemIcon>
                  {link.label}
                </ListItemButton>
              </ListItem>
            );
          })}

          {isAuth && (
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/dashboard"
                onClick={close}
                sx={{
                  px: 2.5,
                  py: 1.4,
                  gap: 1.5,
                  color: "#374151",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "rgba(8,132,255,0.05)",
                    color: "#0884ff",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, color: "inherit" }}>
                  <FiBriefcase size={18} />
                </ListItemIcon>
                Dashboard
              </ListItemButton>
            </ListItem>
          )}
        </List>

        {/* Sign out pinned at bottom */}
        {isAuth && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                onClick={handleLogout}
                startIcon={<FiLogOut size={16} />}
                sx={{
                  justifyContent: "flex-start",
                  color: "#ef4444",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  px: 1,
                  "&:hover": { bgcolor: "rgba(239,68,68,0.06)" },
                }}
              >
                Sign out
              </Button>
            </Box>
          </>
        )}
      </Drawer>
    </>
  );
}
