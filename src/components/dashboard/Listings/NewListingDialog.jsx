"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  Box,
  Alert,
} from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createListing } from "@/app/dashboard/listings/actions";

import BUSINESS_CATEGORIES from "@/data/categories";

// Yup validation schema
const listingSchema = yup.object().shape({
  title: yup
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters")
    .required("Title is required"),
  description: yup
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must not exceed 1000 characters")
    .required("Description is required"),
  business_category: yup
    .string()
    .oneOf(BUSINESS_CATEGORIES, "Please select a valid category")
    .required("Business category is required"),
});

export default function NewListingDialog({ onListingCreated }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      business_category: "",
    },
  });

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => {
    setOpen(false);
    setAlertMessage("");
    reset();
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setAlertMessage("");
      const result = await createListing(data);

      // Handle server action response
      if (result?.error) {
        setAlertSeverity("error");
        setAlertMessage(result.error);
      } else {
        setAlertSeverity("success");
        setAlertMessage("Listing created successfully!");

        // Call the callback to refresh parent component
        onListingCreated && onListingCreated(result.data);

        // Auto-close dialog after 2 seconds on success
        setTimeout(() => {
          handleCloseDialog();
        }, 2000);
      }
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(
        error.message || "Failed to create listing. Please try again.",
      );
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="contained"
        onClick={handleOpenDialog}
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

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {/* Dialog Title */}
        <DialogTitle
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#111827",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          Create New Listing
        </DialogTitle>

        {/* Dialog Content */}
        <DialogContent sx={{ py: 3 }}>
          {alertMessage && (
            <Alert
              severity={alertSeverity}
              variant="outlined"
              onClose={() => setAlertMessage("")}
              sx={{ mb: 2 }}
            >
              {alertMessage}
            </Alert>
          )}
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              pt: 1,
            }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Title Field */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Business Title"
                  placeholder="e.g., Tech Startup with AI Focus"
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            {/* Description Field */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Business Description"
                  placeholder="Describe your business, revenue, growth potential, etc..."
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  size="small"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />

            {/* Business Category Dropdown */}
            <Controller
              name="business_category"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  size="small"
                  error={!!errors.business_category}
                >
                  <InputLabel id="category-label">Business Category</InputLabel>
                  <Select
                    {...field}
                    labelId="category-label"
                    id="category-select"
                    label="Business Category"
                  >
                    <MenuItem value="">
                      <span style={{ color: "#9ca3af" }}>
                        Select a category
                      </span>
                    </MenuItem>
                    {BUSINESS_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.business_category && (
                    <FormHelperText sx={{ color: "#d32f2f" }}>
                      {errors.business_category.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Box>
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions
          sx={{
            padding: "12px 24px",
            borderTop: "1px solid #e5e7eb",
            gap: 1,
          }}
        >
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            disabled={isLoading}
            sx={{
              textTransform: "none",
              color: "#0884ff",
              borderColor: "#0884ff",
              "&:hover": { borderColor: "#0670d6", color: "#0670d6" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={isLoading}
            sx={{
              backgroundColor: "#0884ff",
              color: "white",
              textTransform: "none",
              "&:hover": { backgroundColor: "#0670d6" },
              "&:disabled": { backgroundColor: "#c4c4c4" },
            }}
          >
            {isLoading ? "Creating..." : "Create Listing"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
