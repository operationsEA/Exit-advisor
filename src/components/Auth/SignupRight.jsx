"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Chip } from "@mui/material";
import RoleSelector from "./RoleSelector";
import AuthForm from "./AuthForm";

const ROLE_LABELS = {
  buyer: "Buy a Business",
  seller: "Sell a Business",
  broker: "I'm a Broker",
};

export default function SignupRight() {
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const savedRole = sessionStorage.getItem("signupRole");
    if (savedRole) {
      setSelectedRole(savedRole);
    }
  }, []);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    sessionStorage.setItem("signupRole", role);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Heading */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 0.5, color: "#111827" }}
        >
          Sign Up
        </Typography>
        <Typography variant="caption" sx={{ color: "#6b7280" }}>
          Create your free account to get started
        </Typography>
      </Box>

      {/* Show Role Selector or Selected Role */}
      {!selectedRole ? (
        <RoleSelector
          selectedRole={selectedRole}
          onRoleChange={handleRoleChange}
        />
      ) : (
        <Box>
          <Box
            sx={{
              mb: 3,
              pb: 3,
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Chip
              label={ROLE_LABELS[selectedRole]}
              onDelete={() => setSelectedRole("")}
              size="small"
              sx={{
                backgroundColor: "#f0f7ff",
                color: "#0884ff",
                fontWeight: "bold",
                "& .MuiChip-deleteIcon": {
                  color: "#0884ff",
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "#9ca3af",
                cursor: "pointer",
                textDecoration: "underline",
                "&:hover": { color: "#0884ff" },
              }}
              onClick={() => setSelectedRole("")}
            >
              Change
            </Typography>
          </Box>

          <AuthForm selectedRole={selectedRole} />
        </Box>
      )}
    </Box>
  );
}
