"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import { FiMenu, FiX, FiHome, FiUser } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const menuItems = [
    { icon: FiHome, label: "Dashboard", href: "/dashboard" },
    { icon: FiUser, label: "Profile", href: "/dashboard/profile" },
  ];

  const sidebarContent = (
    <Box sx={{ width: 250, pt: 2, px: 2 }}>
      {/* User Profile Section */}
      {isMounted && user && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            mb: 3,
            p: 1,
            backgroundColor: "rgba(8, 132, 255, 0.05)",
            borderRadius: 2,
            border: "1px solid rgba(8, 132, 255, 0.1)",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#0884ff",
              width: 48,
              height: 48,
              fontSize: "1.5rem",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            {user?.email?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#111827",
              mb: 0.5,
            }}
          >
            {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "#6b7280",
              mb: 1,
              wordBreak: "break-word",
            }}
          >
            {user?.email}
          </Typography>
        </Box>
      )}

      <Divider sx={{ mb: 2 }} />

      {/* Navigation Menu */}
      <List>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: "none" }}
            >
              <ListItem
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: isActive
                    ? "rgba(8, 132, 255, 0.1)"
                    : "transparent",
                  color: isActive ? "#0884ff" : "#6b7280",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(8, 132, 255, 0.05)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "#0884ff" : "#6b7280",
                    minWidth: 40,
                  }}
                >
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ "& .MuiTypography-root": { fontSize: "0.95rem" } }}
                />
              </ListItem>
            </Link>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300,
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
          }}
        >
          <FiMenu size={20} />
        </IconButton>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#0884ff",
              }}
            >
              Menu
            </span>
            <IconButton onClick={() => setMobileOpen(false)}>
              <FiX size={20} />
            </IconButton>
          </Box>
          {sidebarContent}
        </Drawer>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: 250,
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e5e7eb",
            minHeight: "100vh",
            position: "sticky",
            top: 0,
          }}
        >
          {sidebarContent}
        </Box>
      )}
    </>
  );
}
