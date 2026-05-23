import { Container, Typography, Box, Card, Grid, Chip } from "@mui/material";
import Link from "next/link";
import {
  FiList,
  FiAlertCircle,
  FiFileText,
  FiUsers,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { getAdminStats } from "@/app/dashboard/actions";

export default async function AdminDashboard({ userName }) {
  const stats = await getAdminStats();

  const statCards = [
    {
      icon: FiList,
      label: "Total Listings",
      value: stats.totalListings,
      color: "#0884ff",
      href: "/dashboard/listings",
    },
    {
      icon: FiAlertCircle,
      label: "Pending Approvals",
      value: stats.pendingApprovals,
      color: "#f59e0b",
      href: "/dashboard/listings",
    },
    {
      icon: FiFileText,
      label: "Published Blogs",
      value: stats.publishedBlogs,
      color: "#22bfa3",
      href: "/dashboard/blogs",
    },
    {
      icon: FiUsers,
      label: "Total Users",
      value: stats.totalUsers,
      color: "#8b5cf6",
      href: "/dashboard/users",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#111827" }}>
          Admin Overview{userName ? ` — ${userName.split(" ")[0]}` : ""}
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
          Platform-wide snapshot and pending actions.
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
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

      {/* Pending Approvals Queue */}
      <Card
        sx={{ p: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderRadius: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2.5,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
            Listings Awaiting Approval
          </Typography>
          <Link
            href="/dashboard/listings"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "#0884ff",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            View all <FiArrowRight size={14} />
          </Link>
        </Box>

        {stats.pendingListings.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              py: 3,
              justifyContent: "center",
            }}
          >
            <FiCheckCircle size={20} color="#22c55e" />
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              All caught up — no pending listings.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {stats.pendingListings.map((listing) => (
              <Box
                key={listing.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: 1.5,
                  backgroundColor: "#fffbeb",
                  border: "1px solid #fde68a",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#111827" }}
                  >
                    {listing.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                    {listing.business_category} &bull;{" "}
                    {listing.profiles?.full_name ?? "Unknown seller"} &bull;{" "}
                    {new Date(listing.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                <Chip
                  label="Pending"
                  size="small"
                  sx={{
                    backgroundColor: "#fef08a",
                    color: "#713f12",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Card>
    </Container>
  );
}
