"use client";

import { Container, Typography, Box, Card, Grid } from "@mui/material";
import { FiTrendingUp, FiEye, FiBriefcase, FiStar } from "react-icons/fi";

export default function DashboardPage() {
  const stats = [
    {
      icon: FiBriefcase,
      label: "Active Listings",
      value: "0",
      color: "#0884ff",
    },
    { icon: FiEye, label: "Views", value: "0", color: "#22bfa3" },
    { icon: FiTrendingUp, label: "Inquiries", value: "0", color: "#f59e0b" },
    { icon: FiStar, label: "Favorites", value: "0", color: "#06b6d4" },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 4, color: "#111827" }}
      >
        Dashboard
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: `${stat.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={24} color={stat.color} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280", mb: 0.5 }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#111827" }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Welcome Message */}
      <Card
        sx={{
          p: 4,
          textAlign: "center",
          backgroundColor: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "#6b7280", mb: 2 }}>
          Welcome to your dashboard!
        </Typography>
        <Typography variant="body2" sx={{ color: "#9ca3af" }}>
          Start by creating a new listing or viewing your profile settings.
        </Typography>
      </Card>
    </Container>
  );
}
