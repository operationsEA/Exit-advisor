"use client";

import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiDollarSign,
  FiTrendingUp,
  FiMapPin,
} from "react-icons/fi";
import { MdBrokenImage } from "react-icons/md";
import { useState } from "react";
import { deleteListing, updateListing } from "@/app/dashboard/listings/actions";
import EditListingSlide from "./EditListingSlide";

const STATUS_COLORS = {
  available: { bg: "#ecfdf5", text: "#065f46", label: "Available" },
  loi: { bg: "#fef3c7", text: "#92400e", label: "LOI" },
  sold: { bg: "#fee2e2", text: "#991b1b", label: "Sold" },
  draft: { bg: "#f3f4f6", text: "#374151", label: "Draft" },
};

const APPROVAL_COLORS = {
  approved: { bg: "#dbeafe", text: "#0c4a6e", label: "Approved" },
  pending: { bg: "#fef08a", text: "#713f12", label: "Pending" },
};

export default function ListingCard({ listing, onDelete, onRefresh }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [slideOpen, setSlideOpen] = useState(false);
  const [slideMode, setSlideMode] = useState("view"); // 'view' or 'edit'

  const statusInfo = STATUS_COLORS[listing.status] || STATUS_COLORS.draft;
  const approvalInfo = listing.is_approved
    ? APPROVAL_COLORS.approved
    : APPROVAL_COLORS.pending;

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleViewClick = () => {
    setSlideMode("view");
    setSlideOpen(true);
  };

  const handleEditClick = () => {
    setSlideMode("edit");
    setSlideOpen(true);
    handleMenuClose();
  };

  const handleSaveListing = async (updatedListing) => {
    const result = await updateListing(listing.id, updatedListing);
    if (result?.error) {
      throw new Error(result.error);
    }
    onRefresh && onRefresh();
  };

  const handleDeleteClick = () => {
    setDeleteDialog(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError("");
      const result = await deleteListing(listing.id);

      if (result?.error) {
        setDeleteError(result.error);
      } else {
        setDeleteDialog(false);
        onDelete && onDelete(listing.id);
        onRefresh && onRefresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const formatAmount = (min, max) => {
    if (min && max)
      return `$${(min / 1000).toFixed(0)}K - $${(max / 1000).toFixed(0)}K`;
    if (min) return `$${(min / 1000).toFixed(0)}K`;
    if (max) return `$${(max / 1000).toFixed(0)}K`;
    return null;
  };

  const priceDisplay =
    formatAmount(listing.min_price, listing.max_price) || "Price TBD";
  const revenueDisplay = formatAmount(listing.min_revenue, listing.max_revenue);
  const cashflowDisplay = formatAmount(
    listing.min_cashflow,
    listing.max_cashflow,
  );

  const locationDisplay = [listing.state, listing.country]
    .filter(Boolean)
    .join(", ");

  const featureFlags = [
    listing.is_sba_approved && {
      label: "SBA",
      color: "#0284c7",
      bg: "#e0f2fe",
    },
    listing.has_seller_financing && {
      label: "Seller Finance",
      color: "#7c3aed",
      bg: "#ede9fe",
    },
    listing.is_distressed && {
      label: "Distressed",
      color: "#dc2626",
      bg: "#fee2e2",
    },
    listing.is_remote && { label: "Remote", color: "#059669", bg: "#d1fae5" },
  ].filter(Boolean);

  const truncateDescription = (text, maxLength = 60) => {
    return text && text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            transform: "translateY(-4px)",
          },
        }}
      >
        {/* Image Section */}
        <Box sx={{ position: "relative", overflow: "hidden", height: 200 }}>
          {listing.image_url ? (
            <CardMedia
              component="div"
              sx={{
                height: "100%",
                backgroundImage: `url(${listing.image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ) : (
            <Box
              sx={{
                height: "100%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdBrokenImage size={60} color="rgba(255, 255, 255, 0.6)" />
            </Box>
          )}

          {/* Status Badge */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip
              size="small"
              label={statusInfo.label}
              sx={{
                backgroundColor: statusInfo.bg,
                color: statusInfo.text,
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
            {listing.is_featured && (
              <Chip
                size="small"
                label="Featured"
                sx={{
                  backgroundColor: "#fef08a",
                  color: "#713f12",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
            )}
          </Box>

          {/* Approval Badge */}
          <Box sx={{ position: "absolute", top: 12, right: 12 }}>
            <Chip
              size="small"
              label={approvalInfo.label}
              sx={{
                backgroundColor: approvalInfo.bg,
                color: approvalInfo.text,
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
          </Box>
        </Box>

        {/* Content Section */}
        <CardContent sx={{ flexGrow: 1, pb: 1, position: "relative" }}>
          {/* Menu Button - Top Right */}
          <Box sx={{ position: "absolute", top: 24, right: 8 }}>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                backgroundColor: "rgba(8, 132, 255, 0.1)",
                color: "#0884ff",
                "&:hover": { backgroundColor: "rgba(8, 132, 255, 0.2)" },
              }}
            >
              <FiMoreVertical size={18} />
            </IconButton>
          </Box>
          {/* Category */}
          <Typography
            variant="caption"
            sx={{
              color: "#0884ff",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              paddingRight: 4,
            }}
          >
            {listing.business_category || "Uncategorized"}
          </Typography>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#111827",
              mb: 1,
              mt: 0.5,
              fontSize: "1rem",
              lineHeight: 1.3,
              paddingRight: 4,
            }}
          >
            {listing.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              mb: 1.5,
              lineHeight: 1.4,
            }}
          >
            {truncateDescription(listing.description)}
          </Typography>

          {/* Location */}
          {locationDisplay && (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}
            >
              <FiMapPin size={13} color="#9ca3af" />
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                {locationDisplay}
              </Typography>
            </Box>
          )}

          {/* Key Metrics */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.75,
              p: 1.25,
              borderRadius: 1.5,
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              mb: 1.5,
            }}
          >
            {/* Price */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <FiDollarSign size={13} color="#0884ff" />
                <Typography
                  variant="caption"
                  sx={{ color: "#6b7280", fontWeight: 500 }}
                >
                  Price
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: "#0884ff" }}
              >
                {priceDisplay}
              </Typography>
            </Box>

            {/* Revenue */}
            {revenueDisplay && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <FiTrendingUp size={13} color="#059669" />
                  <Typography
                    variant="caption"
                    sx={{ color: "#6b7280", fontWeight: 500 }}
                  >
                    Revenue
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: "#059669" }}
                >
                  {revenueDisplay}
                </Typography>
              </Box>
            )}

            {/* Cashflow */}
            {cashflowDisplay && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <FiDollarSign size={13} color="#7c3aed" />
                  <Typography
                    variant="caption"
                    sx={{ color: "#6b7280", fontWeight: 500 }}
                  >
                    Cashflow
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: "#7c3aed" }}
                >
                  {cashflowDisplay}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Feature Flags */}
          {featureFlags.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
              {featureFlags.map((flag) => (
                <Chip
                  key={flag.label}
                  size="small"
                  label={flag.label}
                  sx={{
                    height: 22,
                    fontSize: "0.675rem",
                    fontWeight: 600,
                    backgroundColor: flag.bg,
                    color: flag.color,
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
              ))}
            </Box>
          )}

          {/* Created Date */}
          <Typography
            variant="caption"
            sx={{
              color: "#9ca3af",
              display: "block",
            }}
          >
            Listed {new Date(listing.created_at).toLocaleDateString()}
          </Typography>
        </CardContent>

        {/* Actions Section */}
        <CardActions
          sx={{
            padding: "12px 16px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: 1,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<FiEye size={16} />}
            onClick={handleViewClick}
            sx={{
              flex: 1,
              textTransform: "none",
              color: "#0884ff",
              borderColor: "#0884ff",
              "&:hover": { borderColor: "#0670d6", color: "#0670d6" },
            }}
          >
            View
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FiEdit2 size={16} />}
            onClick={handleEditClick}
            sx={{
              flex: 1,
              textTransform: "none",
              color: "#0884ff",
              borderColor: "#0884ff",
              "&:hover": { borderColor: "#0670d6", color: "#0670d6" },
            }}
          >
            Edit
          </Button>
        </CardActions>
      </Card>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem>
          <FiEdit2 size={16} style={{ marginRight: 8 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <FiTrash2 size={16} style={{ marginRight: 8, color: "#ef4444" }} />
          <span style={{ color: "#ef4444" }}>Delete</span>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Listing?</DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <Typography>
            Are you sure you want to delete "{listing.title}"? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Listing Slide */}
      <EditListingSlide
        open={slideOpen}
        onClose={() => setSlideOpen(false)}
        listing={listing}
        mode={slideMode}
        onSave={handleSaveListing}
      />
    </>
  );
}
