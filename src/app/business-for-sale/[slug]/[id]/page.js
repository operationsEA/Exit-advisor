import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Button,
  Divider,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import { notFound } from "next/navigation";
import {
  FiDollarSign,
  FiTrendingUp,
  FiMapPin,
  FiCalendar,
  FiDownload,
  FiUser,
  FiAward,
} from "react-icons/fi";
import {
  getListingDetail,
  getListingDocumentsPublic,
} from "@/app/business-for-sale/actions";

const STATUS_COLORS = {
  available: { bg: "#ecfdf5", text: "#065f46", label: "Available" },
  loi: { bg: "#fef3c7", text: "#92400e", label: "LOI" },
  sold: { bg: "#fee2e2", text: "#991b1b", label: "Sold" },
};

const FEATURE_FLAGS = [
  { key: "is_sba_approved", label: "SBA Approved", icon: "🏛️" },
  { key: "has_seller_financing", label: "Seller Financing", icon: "💰" },
  { key: "is_distressed", label: "Distressed Sale", icon: "⚡" },
  { key: "is_remote", label: "Remote Business", icon: "🌐" },
  { key: "is_featured", label: "Featured", icon: "⭐" },
];

export async function generateMetadata(props) {
  const params = await props.params;
  const { id } = await params;
  const result = await getListingDetail(id);

  if (!result.success) {
    return { title: "Listing Not Found" };
  }

  const listing = result.data;
  return {
    title: listing.title,
    description: listing.description?.substring(0, 160),
  };
}

export default async function ListingDetailPage(props) {
  const params = await props.params;
  const { id } = await params;

  // Fetch listing detail and documents
  const listingResult = await getListingDetail(id);
  const documentsResult = await getListingDocumentsPublic(id);

  if (!listingResult.success) {
    notFound();
  }

  const listing = listingResult.data;
  const documents = documentsResult.success ? documentsResult.data : [];

  // Format numbers
  const formatPrice = (val) => {
    if (!val) return "N/A";
    return `$${(val / 1000000).toFixed(2)}M`;
  };

  const priceDisplay =
    listing.min_price && listing.max_price
      ? `$${(listing.min_price / 1000).toFixed(0)}K - $${(listing.max_price / 1000).toFixed(0)}K`
      : listing.min_price
        ? `$${(listing.min_price / 1000).toFixed(0)}K`
        : "Price TBD";

  const revenueDisplay =
    listing.min_revenue && listing.max_revenue
      ? `$${(listing.min_revenue / 1000).toFixed(0)}K - $${(listing.max_revenue / 1000).toFixed(0)}K`
      : listing.min_revenue
        ? `$${(listing.min_revenue / 1000).toFixed(0)}K`
        : null;

  const cashflowDisplay =
    listing.min_cashflow && listing.max_cashflow
      ? `$${(listing.min_cashflow / 1000).toFixed(0)}K - $${(listing.max_cashflow / 1000).toFixed(0)}K`
      : listing.min_cashflow
        ? `$${(listing.min_cashflow / 1000).toFixed(0)}K`
        : null;

  const statusInfo = STATUS_COLORS[listing.status] || STATUS_COLORS.available;
  const location = [listing.state, listing.country].filter(Boolean).join(", ");

  return (
    <div suppressHydrationWarning>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, mb: 2, color: "#111827" }}
          >
            {listing.title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={statusInfo.label}
              sx={{
                backgroundColor: statusInfo.bg,
                color: statusInfo.text,
                fontWeight: 600,
              }}
            />
            {listing.is_featured && (
              <Chip
                label="⭐ Featured"
                sx={{
                  backgroundColor: "#fef08a",
                  color: "#713f12",
                  fontWeight: 600,
                }}
              />
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#6b7280",
              }}
            >
              <FiMapPin size={16} />
              <Typography variant="body2">{location}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#6b7280",
              }}
            >
              <FiCalendar size={16} />
              <Typography variant="body2">
                {new Date(listing.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Image Section */}
            {listing.image_url ? (
              <Paper
                sx={{
                  height: 400,
                  backgroundImage: `url(${listing.image_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2,
                  mb: 3,
                }}
              />
            ) : (
              <Paper
                sx={{
                  height: 400,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: 2,
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h5" sx={{ color: "white" }}>
                  No Image Available
                </Typography>
              </Paper>
            )}

            {/* Description */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Business Description
              </Typography>
              <Typography
                sx={{
                  lineHeight: 1.8,
                  color: "#4b5563",
                  whiteSpace: "pre-wrap",
                }}
              >
                {listing.description}
              </Typography>
            </Paper>

            {/* Key Metrics */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Financial Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{ p: 2, backgroundColor: "#f0f9ff", borderRadius: 1.5 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <FiDollarSign size={18} color="#0884ff" />
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, color: "#6b7280" }}
                      >
                        Asking Price
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#0884ff" }}
                    >
                      {priceDisplay}
                    </Typography>
                  </Box>
                </Grid>

                {revenueDisplay && (
                  <Grid item xs={12} sm={4}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "#f0fdf4",
                        borderRadius: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <FiTrendingUp size={18} color="#059669" />
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, color: "#6b7280" }}
                        >
                          Annual Revenue
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#059669" }}
                      >
                        {revenueDisplay}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {cashflowDisplay && (
                  <Grid item xs={12} sm={4}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "#faf5ff",
                        borderRadius: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <FiDollarSign size={18} color="#7c3aed" />
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, color: "#6b7280" }}
                        >
                          Annual Cashflow
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#7c3aed" }}
                      >
                        {cashflowDisplay}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Special Features */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Special Features
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {FEATURE_FLAGS.map(
                  (flag) =>
                    listing[flag.key] && (
                      <Chip
                        key={flag.key}
                        label={`${flag.icon} ${flag.label}`}
                        sx={{
                          backgroundColor: "#f3f4f6",
                          border: "1px solid #e5e7eb",
                          fontWeight: 600,
                        }}
                      />
                    ),
                )}
              </Box>
            </Paper>

            {/* Documents Section */}
            {documents.length > 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Documents ({documents.length})
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                        <TableCell sx={{ fontWeight: 700 }}>
                          File Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, textAlign: "center" }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id} hover>
                          <TableCell sx={{ color: "#111827" }}>
                            {doc.file_url.split("/").pop().substring(0, 40)}...
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={doc.file_type?.toUpperCase() || "FILE"}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell sx={{ color: "#6b7280" }}>
                            {new Date(doc.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Button
                              size="small"
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              startIcon={<FiDownload size={16} />}
                              sx={{
                                textTransform: "none",
                                color: "#0884ff",
                                "&:hover": {
                                  backgroundColor: "rgba(8, 132, 255, 0.1)",
                                },
                              }}
                            >
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Seller Card */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Seller Information
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: "#0884ff",
                    color: "white",
                  }}
                >
                  {listing.profiles?.full_name?.charAt(0).toUpperCase() || "S"}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>
                    {listing.profiles?.full_name || "Unknown Seller"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6b7280" }}>
                    {listing.profiles?.email}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <FiAward size={14} color="#059669" />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "#059669",
                        textTransform: "capitalize",
                      }}
                    >
                      {listing.profiles?.role || "Seller"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#0884ff",
                  textTransform: "none",
                  mb: 1,
                }}
              >
                Contact Seller
              </Button>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: "#0884ff",
                  color: "#0884ff",
                  textTransform: "none",
                }}
              >
                Request More Info
              </Button>
            </Paper>

            {/* Listing Info */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Listing Details
              </Typography>
              <Box sx={{ space: "y-2" }}>
                <Box sx={{ pb: 1.5 }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: "#6b7280" }}
                  >
                    Category
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {listing.business_category}
                  </Typography>
                </Box>
                <Box sx={{ pb: 1.5 }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: "#6b7280" }}
                  >
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={statusInfo.label}
                      sx={{
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.text,
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ pb: 1.5 }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: "#6b7280" }}
                  >
                    Location
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>{location}</Typography>
                </Box>
                {listing.ffe && (
                  <Box sx={{ pb: 1.5 }}>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: "#6b7280" }}
                    >
                      Seller Financed Amount
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      ${(listing.ffe / 1000).toFixed(0)}K
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: "#6b7280" }}
                  >
                    Listed Date
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {new Date(listing.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
