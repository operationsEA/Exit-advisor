import { Container, Typography, Box, Card, Grid } from "@mui/material";
import Link from "next/link";
import { FiHeart, FiMessageSquare, FiBell, FiSearch } from "react-icons/fi";
import { getBuyerStats } from "@/app/dashboard/actions";

export default async function BuyerDashboard({ userId, userName }) {
  const stats = await getBuyerStats(userId);

  const statCards = [
    {
      icon: FiHeart,
      label: "Saved Listings",
      value: stats.savedListings,
      color: "#ec4899",
      href: "/business-for-sale",
    },
    {
      icon: FiMessageSquare,
      label: "Active Chats",
      value: stats.activeChats,
      color: "#0884ff",
      href: "/dashboard/chats",
    },
    {
      icon: FiBell,
      label: "Unread Messages",
      value: stats.unreadMessages,
      color: "#f59e0b",
      href: "/dashboard/chats",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#111827" }}>
          Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}!
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
          Track your saved listings and conversations.
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={stat.label}>
              <Link href={stat.href} style={{ textDecoration: "none" }}>
                <Card
                  sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    borderRadius: 2,
                    transition: "box-shadow 0.2s",
                    "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.12)" },
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      backgroundColor: `${stat.color}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
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
              </Link>
            </Grid>
          );
        })}
      </Grid>

      {/* CTA */}
      <Card
        sx={{
          p: 4,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          borderRadius: 2,
          background: "linear-gradient(135deg, #0884ff11 0%, #22bfa311 100%)",
          border: "1px solid #0884ff22",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#111827", mb: 0.5 }}
          >
            Ready to find your next business?
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Browse hundreds of verified businesses for sale across all
            categories.
          </Typography>
        </Box>
        <Link href="/business-for-sale" style={{ textDecoration: "none" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 3,
              py: 1.5,
              backgroundColor: "#0884ff",
              color: "#fff",
              borderRadius: 2,
              fontWeight: 600,
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              "&:hover": { backgroundColor: "#0673d9" },
            }}
          >
            <FiSearch size={16} />
            Browse Listings
          </Box>
        </Link>
      </Card>
    </Container>
  );
}
