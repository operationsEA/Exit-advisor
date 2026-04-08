"use client";

import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

const ROLES = [
  {
    id: "buyer",
    title: "Buy a Business",
    description:
      "Explore carefully curated business opportunities and find your next venture.",
    note: "Unlimited listings you can explore",
  },
  {
    id: "seller",
    title: "Sell a Business",
    description:
      "List your business and connect with serious, qualified buyers.",
    note: "Maximum 2 businesses you can list",
  },
  {
    id: "broker",
    title: "I'm a Broker",
    description: "List multiple businesses and expand your portfolio.",
    note: "Maximum 20 businesses you can list",
  },
];

export default function RoleSelector({ selectedRole, onRoleChange }) {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", mb: 2, color: "#111827", fontSize: "1rem" }}
      >
        What describes you?
      </Typography>

      <RadioGroup
        value={selectedRole}
        onChange={(e) => onRoleChange(e.target.value)}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {ROLES.map((role) => (
            <Box
              key={role.id}
              sx={{
                p: 2,
                border: "2px solid",
                borderColor: selectedRole === role.id ? "#0884ff" : "#e5e7eb",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor: selectedRole === role.id ? "#f0f7ff" : "#fff",
                "&:hover": {
                  borderColor: "#0884ff",
                  backgroundColor: "#f0f7ff",
                },
              }}
            >
              <FormControlLabel
                value={role.id}
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: "#0884ff",
                      "&.Mui-checked": {
                        color: "#0884ff",
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "#111827" }}
                    >
                      {role.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#6b7280", display: "block", mt: 0.25 }}
                    >
                      {role.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "inline-block",
                        mt: 0.75,
                        px: 1.5,
                        py: 0.25,
                        backgroundColor: "#f3f4f6",
                        borderRadius: "4px",
                        color: "#0884ff",
                        fontWeight: "500",
                        fontSize: "0.7rem",
                      }}
                    >
                      {role.note}
                    </Typography>
                  </Box>
                }
                sx={{ width: "100%", m: 0 }}
              />
            </Box>
          ))}
        </Box>
      </RadioGroup>
    </Box>
  );
}
