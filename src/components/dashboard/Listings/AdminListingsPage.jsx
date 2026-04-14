"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  CircularProgress,
  Chip,
  TextField,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  FiCheck,
  FiX,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";
import {
  getAllListingsWithUsers,
  updateListingApprovalStatus,
  adminUpdateListingStatus,
  deleteListing,
} from "@/app/dashboard/listings/actions";
import EditListingSlide from "./EditListingSlide";
import { BUSINESS_CATEGORIES } from "./listingSchema";

const STATUS_COLORS = {
  draft: "#9ca3af",
  pending: "#f59e0b",
  active: "#10b981",
  sold: "#6366f1",
  expired: "#ef4444",
};

export default function AdminListingsPage() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Dialog and view states
  const [selectedListing, setSelectedListing] = useState(null);
  const [viewSlideOpen, setViewSlideOpen] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  // Filter listings when search term or filters change
  useEffect(() => {
    let filtered = listings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.profiles?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          listing.profiles?.full_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((listing) => listing.status === statusFilter);
    }

    // Approval filter
    if (approvalFilter !== "all") {
      filtered = filtered.filter(
        (listing) => listing.is_approved === (approvalFilter === "approved"),
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (listing) => listing.business_category === categoryFilter,
      );
    }

    setFilteredListings(filtered);
  }, [listings, searchTerm, statusFilter, approvalFilter, categoryFilter]);

  const fetchListings = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getAllListingsWithUsers();
      if (result.success) {
        setListings(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to fetch listings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewListing = (listing) => {
    setSelectedListing(listing);
    setViewSlideOpen(true);
  };

  const handleApprovalChange = async (listingId, isApproved) => {
    try {
      const result = await updateListingApprovalStatus(listingId, isApproved);
      if (result.success) {
        setListings(
          listings.map((l) =>
            l.id === listingId ? { ...l, is_approved: isApproved } : l,
          ),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedListing || !newStatus) return;

    try {
      const result = await adminUpdateListingStatus(
        selectedListing.id,
        newStatus,
      );
      if (result.success) {
        setListings(
          listings.map((l) =>
            l.id === selectedListing.id ? { ...l, status: newStatus } : l,
          ),
        );
        setStatusDialog(false);
        setSelectedListing(null);
        setNewStatus("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;

    setDeletingId(listingId);
    try {
      const result = await deleteListing(listingId);
      if (result.success) {
        setListings(listings.filter((l) => l.id !== listingId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          📊 All Listings Management
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Manage and approve all listings from users
        </Typography>
      </Box>

      {error && (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: "#fee2e2",
            border: "1px solid #fecaca",
            borderRadius: 1,
          }}
        >
          <Typography sx={{ color: "#dc2626" }}>{error}</Typography>
        </Paper>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2.5, mb: 3, backgroundColor: "#f9fafb" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search listing or seller..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <FiSearch size={18} style={{ marginRight: 8 }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 40,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="loi">LOI</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Approval</InputLabel>
              <Select
                value={approvalFilter}
                label="Approval"
                onChange={(e) => setApprovalFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {BUSINESS_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <IconButton onClick={fetchListings} title="Refresh listings">
              <FiRefreshCw size={18} />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      {/* Listings Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: "#111827" }}>
                Listing
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#111827" }}>
                Seller
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#111827" }}>
                Category
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#111827" }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#111827" }}>
                Approved
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#111827" }}>
                Created
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, color: "#111827" }}
                align="right"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredListings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography sx={{ color: "#9ca3af" }}>
                    No listings found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredListings.map((listing) => (
                <TableRow
                  key={listing.id}
                  sx={{
                    "&:hover": { backgroundColor: "#f9fafb" },
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#111827" }}
                      >
                        {listing.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#6b7280" }}>
                        {listing.id.substring(0, 8)}...
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#111827" }}>
                        {listing.profiles?.full_name || "N/A"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#6b7280" }}>
                        {listing.profiles?.email}
                      </Typography>
                    </Box>
                    <Chip
                      label={listing.profiles?.role || "user"}
                      size="small"
                      variant="outlined"
                      sx={{
                        mt: 0.5,
                        height: 20,
                        fontSize: "0.7rem",
                        textTransform: "capitalize",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {listing.business_category}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={listing.status}
                      size="small"
                      variant="outlined"
                      sx={{
                        color: STATUS_COLORS[listing.status] || "#6b7280",
                        borderColor: STATUS_COLORS[listing.status] || "#d1d5db",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={listing.is_approved ? "✓ Approved" : "⊗ Pending"}
                      size="small"
                      color={listing.is_approved ? "success" : "warning"}
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#6b7280" }}>
                      {formatDate(listing.created_at)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      title="View Details"
                      onClick={() => handleViewListing(listing)}
                      sx={{ color: "#0884ff", mr: 1 }}
                    >
                      <FiEye size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      title="Edit Status"
                      onClick={() => {
                        setSelectedListing(listing);
                        setNewStatus(listing.status);
                        setStatusDialog(true);
                      }}
                      sx={{ color: "#0884ff" }}
                    >
                      <FiEdit2 size={16} />
                    </IconButton>
                    {/* <IconButton
                      size="small"
                      title="Delete"
                      onClick={() => handleDelete(listing.id)}
                      disabled={deletingId === listing.id}
                      sx={{ color: "#ef4444" }}
                    >
                      {deletingId === listing.id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <FiTrash2 size={16} />
                      )}
                    </IconButton> */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Stats Footer */}
      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Chip
          label={`Total: ${listings.length}`}
          variant="outlined"
          color="default"
        />
        <Chip
          label={`Approved: ${listings.filter((l) => l.is_approved).length}`}
          variant="outlined"
          color="success"
        />
        <Chip
          label={`Pending: ${listings.filter((l) => !l.is_approved).length}`}
          variant="outlined"
          color="warning"
        />
      </Box>

      {/* Status Change Dialog */}
      <Dialog
        fullWidth
        maxWidth="xs"
        open={statusDialog}
        onClose={() => setStatusDialog(false)}
      >
        <DialogTitle>Change Listing Status</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2, color: "#6b7280" }}>
              Current: <strong>{selectedListing?.title}</strong>
            </Typography>
            <FormControl fullWidth>
              <InputLabel>New Status</InputLabel>
              <Select
                value={newStatus}
                label="New Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="loi">LOI</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button
            onClick={handleStatusChange}
            variant="contained"
            sx={{ backgroundColor: "#0884ff" }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Listing Slide - View Mode for Admin */}
      {selectedListing && (
        <EditListingSlide
          open={viewSlideOpen}
          onClose={() => {
            setViewSlideOpen(false);
            setSelectedListing(null);
          }}
          listing={selectedListing}
          mode="view"
          isAdmin={true}
          onApprovalStatusChange={handleApprovalChange}
        />
      )}
    </Box>
  );
}
