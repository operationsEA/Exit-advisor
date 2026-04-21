"use client";

import { useState, useCallback } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import EditListingSlide from "@/components/dashboard/Listings/EditListingSlide";
import ListingsList from "@/components/dashboard/Listings/ListingsList";

export default function SellerListingPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [newListingOpen, setNewListingOpen] = useState(false);

  const handleListingCreated = useCallback(() => {
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
        <Button
          variant="contained"
          onClick={() => setNewListingOpen(true)}
          sx={{
            backgroundColor: "#0884ff",
            color: "white",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&:hover": { backgroundColor: "#0670d6" },
          }}
        >
          <FiPlus size={20} />
          New Listing
        </Button>
      </Box>

      {/* Listings Content */}
      <Box sx={{ mt: 4 }}>
        <ListingsList refreshTrigger={refreshTrigger} />
      </Box>

      {/* New Listing Slide */}
      <EditListingSlide
        open={newListingOpen}
        onClose={() => setNewListingOpen(false)}
        listing={null}
        mode="new"
        onSave={handleListingCreated}
      />
    </Container>
  );
}
