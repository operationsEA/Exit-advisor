"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { FiRefreshCw } from "react-icons/fi";
import { getListings } from "@/app/dashboard/listings/actions";
import ListingCard from "./ListingCard";

export default function ListingsList({ refreshTrigger = 0 }) {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchListings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const result = await getListings();

      if (result?.error) {
        setError(result.error);
        setListings([]);
      } else {
        setListings(result.data || []);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch listings");
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch listings on mount and when refreshTrigger changes
  useEffect(() => {
    fetchListings();
  }, [refreshTrigger, fetchListings]);

  const handleDelete = (deletedId) => {
    setListings((prev) => prev.filter((item) => item.id !== deletedId));
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mb: 3 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchListings}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (listings.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          px: 3,
          backgroundColor: "#f9fafb",
          borderRadius: 2,
          border: "2px dashed #e5e7eb",
        }}
      >
        <Typography variant="h6" sx={{ color: "#6b7280", mb: 1 }}>
          No Listings Yet
        </Typography>
        <Typography variant="body2" sx={{ color: "#9ca3af" }}>
          Create your first listing to get started. Your listings will appear
          here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Refresh */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ color: "#111827", fontWeight: 600 }}>
          Your Listings ({listings.length})
        </Typography>
        <Button
          size="small"
          startIcon={<FiRefreshCw size={16} />}
          onClick={fetchListings}
          sx={{
            textTransform: "none",
            color: "#0884ff",
            "&:hover": { backgroundColor: "rgba(8, 132, 255, 0.1)" },
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Grid of Listing Cards */}
      <Grid container spacing={3}>
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={listing.id}>
            <ListingCard
              listing={listing}
              onDelete={handleDelete}
              onRefresh={fetchListings}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
