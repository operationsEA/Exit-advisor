import { Container, Typography, Box, Card, Grid, Chip } from "@mui/material";
import Link from "next/link";
import {
  FiBriefcase,
  FiClock,
  FiMessageSquare,
  FiUploadCloud,
  FiArrowRight,
} from "react-icons/fi";
import { getBrokerStats } from "@/app/dashboard/actions";

const STATUS_COLORS = {
  available: { bg: "#ecfdf5", text: "#065f46", label: "Available" },
  loi: { bg: "#fef3c7", text: "#92400e", label: "LOI" },
  sold: { bg: "#fee2e2", text: "#991b1b", label: "Sold" },
  draft: { bg: "#f3f4f6", text: "#374151", label: "Draft" },
};

export default async function BrokerDashboard({ userId, userName }) {
  const stats = await getBrokerStats(userId);

  const statCards = [
    {
      icon: FiBriefcase,
      label: "Active Listings",
      value: stats.activeListings,
      color: "#0884ff",
      href: "/dashboard/listings",
    },
    {
      icon: FiClock,
      label: "Pending Approval",
      value: stats.pendingListings,
      color: "#f59e0b",
      href: "/dashboard/listings",
    },
    {
      icon: FiMessageSquare,
      label: "Total Inquiries",
      value: stats.totalInquiries,
      color: "#22bfa3",
      href: "/dashboard/chats",
    },
    {
      icon: FiUploadCloud,
      label: "Bulk Uploaded",
      value: stats.totalUploaded,
      color: "#8b5cf6",
      href: "/dashboard/listings",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#111827" }}>
          Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}!
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
          Your broker portfolio at a glance.
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

      {/* Recent Listings */}
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
            Recent Listings
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

        {stats.recentListings.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: "#9ca3af", textAlign: "center", py: 3 }}
          >
            No listings yet.{" "}
            <Link href="/dashboard/listings" style={{ color: "#0884ff" }}>
              Create your first listing
            </Link>
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {stats.recentListings.map((listing) => {
              const statusInfo =
                STATUS_COLORS[listing.status] ?? STATUS_COLORS.draft;
              return (
                <Box
                  key={listing.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 1.5,
                    backgroundColor: "#f9fafb",
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
                      {new Date(listing.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label={statusInfo.label}
                      size="small"
                      sx={{
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.text,
                        fontWeight: 600,
                        fontSize: "0.7rem",
                      }}
                    />
                    {!listing.is_approved && listing.status !== "draft" && (
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
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Card>
    </Container>
  );
}
