"use client";

import { useState, useCallback } from "react";
import { Container, Box, Typography } from "@mui/material";
import NewListingDialog from "@/components/dashboard/Listings/NewListingDialog";
import ListingsList from "@/components/dashboard/Listings/ListingsList";

export default function SellerListingPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleListingCreated = useCallback((newListing) => {
    // Trigger a refresh of the listings list
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#111827" }}>
          My Listings
        </Typography>
        <NewListingDialog onListingCreated={handleListingCreated} />
      </Box>

      {/* Listings Content */}
      <Box sx={{ mt: 4 }}>
        <ListingsList refreshTrigger={refreshTrigger} />
      </Box>
    </Container>
  );
}
