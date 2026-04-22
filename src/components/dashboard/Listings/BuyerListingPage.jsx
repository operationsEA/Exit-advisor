"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Grid,
} from "@mui/material";
import { getBuyerFavoriteListings } from "@/app/dashboard/listings/actions";
import ListingCard from "./ListingCard";

export default function BuyerListingPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        setError("");
        const result = await getBuyerFavoriteListings();

        if (result?.error) {
          setError(result.error);
          setFavorites([]);
        } else {
          setFavorites(result.data || []);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch favorites");
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleFavoriteChange = (listingId, isFavourite) => {
    if (!isFavourite) {
      // Remove from favorites list when unfavorited
      setFavorites((prev) => prev.filter((item) => item.id !== listingId));
    } else {
      // Re-add if somehow favorites are toggled back on
      // This is a safety net for state sync
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#111827" }}>
          ❤️ My Favorite Listings
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
          {favorites.length} {favorites.length === 1 ? "listing" : "listings"}
        </Typography>
      </Box>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 3,
            backgroundColor: "#f9fafb",
            borderRadius: 2,
            border: "2px dashed #e5e7eb",
          }}
        >
          <Typography variant="h6" sx={{ color: "#6b7280", mb: 1 }}>
            No Favorite Listings Yet
          </Typography>
          <Typography variant="body2" sx={{ color: "#9ca3af" }}>
            Start exploring businesses and add your favorites to see them here.
          </Typography>
        </Box>
      ) : (
        /* Favorites Grid */
        <Grid container spacing={3}>
          {favorites.map((listing) => (
            <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={listing.id}>
              <ListingCard
                listing={listing}
                onFavoriteChange={handleFavoriteChange}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
