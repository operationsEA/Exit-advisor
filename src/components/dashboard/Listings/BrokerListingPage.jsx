"use client";

import { useState, useCallback } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { FiPlus, FiUploadCloud, FiX } from "react-icons/fi";
import EditListingSlide from "@/components/dashboard/Listings/EditListingSlide";
import ListingsList from "@/components/dashboard/Listings/ListingsList";
import BrokerExcelUpload from "@/components/dashboard/Listings/BrokerExcelUpload";

export default function BrokerListingPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [newListingOpen, setNewListingOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  const handleListingCreated = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleBulkUploaded = useCallback((count) => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h1" sx={{ fontWeight: "bold", color: "#111827" }}>
          My Listings
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setBulkUploadOpen(true)}
            sx={{
              borderColor: "#0884ff",
              color: "#0884ff",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": {
                borderColor: "#0670d6",
                color: "#0670d6",
                bgcolor: "#eff6ff",
              },
            }}
          >
            <FiUploadCloud size={20} />
            Bulk Upload
          </Button>

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
      </Box>

      {/* Listings */}
      <Box sx={{ mt: 4 }}>
        <ListingsList refreshTrigger={refreshTrigger} />
      </Box>

      {/* Single Listing Slide */}
      <EditListingSlide
        open={newListingOpen}
        onClose={() => setNewListingOpen(false)}
        listing={null}
        mode="new"
        onSave={handleListingCreated}
      />

      {/* Bulk Upload Dialog */}
      <Dialog
        open={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <FiUploadCloud size={22} color="#0884ff" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Bulk Upload Listings
            </Typography>
          </Box>
          <IconButton onClick={() => setBulkUploadOpen(false)} size="small">
            <FiX size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <BrokerExcelUpload onUploaded={handleBulkUploaded} />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
