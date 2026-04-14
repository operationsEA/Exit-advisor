"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  FiX,
  FiUpload,
  FiTrash2,
  FiDownload,
  FiFile,
  FiFileText,
  FiImage,
} from "react-icons/fi";
import { MdCheckCircle } from "react-icons/md";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  listingEditSchema,
  BUSINESS_CATEGORIES,
  STATUS_OPTIONS,
} from "./listingSchema";
import { COUNTRIES } from "./countriesList";
import {
  uploadAndUpdateListingImage,
  uploadAndUpdateFile,
  deleteListingDocument,
  getListingDocuments,
} from "@/app/dashboard/listings/actions";
import { updateListing } from "@/app/dashboard/listings/actions";

export default function EditListingSlide({
  open,
  onClose,
  listing,
  mode = "edit",
  onSave,
  isAdmin = false,
  onApprovalStatusChange,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [approvingStatus, setApprovingStatus] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [listingImage, setListingImage] = useState(listing?.image_url || null);
  const [documents, setDocuments] = useState([]);
  const [deletingDocId, setDeletingDocId] = useState(null);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [isApproved, setIsApproved] = useState(listing?.is_approved || false);

  const isViewMode = mode === "view";

  // Fetch documents on mount or when drawer opens
  useEffect(() => {
    if (open && listing?.id) {
      fetchDocuments();
    }
  }, [open, listing?.id]);

  const fetchDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const result = await getListingDocuments(listing.id);
      if (result.success) {
        setDocuments(result.data);
      } else {
        console.error("Failed to fetch documents:", result.error);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(listingEditSchema),
    defaultValues: {
      title: listing?.title || "",
      description: listing?.description || "",
      business_category: listing?.business_category || "",
      status: listing?.status || "draft",
      min_price: listing?.min_price || null,
      max_price: listing?.max_price || null,
      min_revenue: listing?.min_revenue || null,
      max_revenue: listing?.max_revenue || null,
      country: listing?.country || "",
      state: listing?.state || "",
      is_sba_approved: listing?.is_sba_approved || false,
      has_seller_financing: listing?.has_seller_financing || false,
      is_distressed: listing?.is_distressed || false,
      is_remote: listing?.is_remote || false,
      is_featured: listing?.is_featured || false,
    },
  });

  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      setUploadingImage(true);
      setErrorMessage("");

      // Call server action to handle delete + upload + update
      const result = await uploadAndUpdateListingImage(
        listing.id,
        listing.image_url,
        file,
        file.name,
      );

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        setListingImage(result.imageUrl);
        setSuccessMessage("Image uploaded successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to upload image");
      console.error("Image upload error:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      setUploadingFile(true);
      setErrorMessage("");

      const result = await uploadAndUpdateFile(
        listing.id,
        file,
        file.name,
        file.size,
      );

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        setSuccessMessage("Document uploaded successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        // Refresh documents list
        await fetchDocuments();
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to upload document");
      console.error("File upload error:", error);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteDocument = async (documentId, fileUrl) => {
    try {
      setDeletingDocId(documentId);
      const result = await deleteListingDocument(documentId, fileUrl);

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        setSuccessMessage("Document deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        // Refresh documents list
        await fetchDocuments();
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete document");
      console.error("Delete error:", error);
    } finally {
      setDeletingDocId(null);
    }
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <FiFile size={18} />;
    const type = fileType.toLowerCase();
    if (type === "pdf" || type === "doc" || type === "docx" || type === "txt") {
      return <FiFileText size={18} />;
    }
    if (type === "png" || type === "jpg" || type === "jpeg" || type === "gif") {
      return <FiImage size={18} />;
    }
    return <FiFile size={18} />;
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const updatedListing = {
        ...data,
        image_url: listingImage,
      };

      await onSave(updatedListing);
      setSuccessMessage("Listing updated successfully!");

      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message || "Failed to save listing");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setListingImage(listing?.image_url || null);
    setSuccessMessage("");
    setErrorMessage("");
    setIsApproved(listing?.is_approved || false);
    onClose();
  };

  const handleApprovalToggle = async () => {
    if (!isAdmin) return;

    setApprovingStatus(true);
    try {
      const newApprovalStatus = !isApproved;
      if (onApprovalStatusChange) {
        await onApprovalStatusChange(listing.id, newApprovalStatus);
      }
      setIsApproved(newApprovalStatus);
      setSuccessMessage(
        `Listing ${newApprovalStatus ? "approved" : "rejected"} successfully!`,
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error.message || "Failed to update approval status");
    } finally {
      setApprovingStatus(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 500, md: 600 },
          maxWidth: "100%",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
            {isViewMode ? "View" : "Edit"} Listing
          </Typography>
          <Typography variant="caption" sx={{ color: "#6b7280" }}>
            {isViewMode ? "View details" : "Update your listing information"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={isApproved ? "✓ Approved" : "⊗ Pending"}
            size="small"
            color={isApproved ? "success" : "warning"}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <IconButton onClick={handleClose} size="small">
            <FiX size={20} />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ overflowY: "auto", p: 3, height: "calc(100vh - 140px)" }}>
        {/* Alerts */}
        {successMessage && (
          <Alert
            severity="success"
            onClose={() => setSuccessMessage("")}
            sx={{ mb: 2 }}
            icon={<MdCheckCircle />}
          >
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert
            severity="error"
            onClose={() => setErrorMessage("")}
            sx={{ mb: 2 }}
          >
            {errorMessage}
          </Alert>
        )}

        {/* Image Section */}
        {!isViewMode && (
          <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f9fafb" }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 2, color: "#111827" }}
            >
              Listing Image
            </Typography>
            {listingImage && (
              <Box
                sx={{
                  mb: 2,
                  borderRadius: 1,
                  overflow: "hidden",
                  height: 200,
                  backgroundColor: "#e5e7eb",
                }}
              >
                <img
                  src={listingImage}
                  alt="Listing"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
            <Button
              component="label"
              variant="outlined"
              size="small"
              startIcon={
                uploadingImage ? (
                  <CircularProgress size={20} />
                ) : (
                  <FiUpload size={18} />
                )
              }
              fullWidth
              disabled={uploadingImage}
              sx={{
                textTransform: "none",
                color: "#0884ff",
                borderColor: "#0884ff",
                "&:hover": { borderColor: "#0670d6", color: "#0670d6" },
              }}
            >
              {uploadingImage ? "Uploading..." : "Upload Image"}
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => handleImageUpload(e.target.files?.[0])}
              />
            </Button>
          </Paper>
        )}

        {/* Form Fields */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Title */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Business Title"
                fullWidth
                variant="outlined"
                size="small"
                disabled={isViewMode}
                error={!!errors.title}
                helperText={errors.title?.message}
                sx={{ mb: 2 }}
              />
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                size="small"
                disabled={isViewMode}
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={{ mb: 2 }}
              />
            )}
          />

          {/* Category & Status */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Controller
                name="business_category"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    disabled={isViewMode}
                    error={!!errors.business_category}
                  >
                    <InputLabel>Category</InputLabel>
                    <Select {...field} label="Category">
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    disabled={isViewMode}
                    error={!!errors.status}
                  >
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      {STATUS_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>

          {/* Price Range */}
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1.5, color: "#111827" }}
          >
            Price Range
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Controller
                name="min_price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Min Price"
                    type="number"
                    fullWidth
                    size="small"
                    disabled={isViewMode}
                    error={!!errors.min_price}
                    helperText={errors.min_price?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="max_price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Max Price"
                    type="number"
                    fullWidth
                    size="small"
                    disabled={isViewMode}
                    error={!!errors.max_price}
                    helperText={errors.max_price?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Revenue Range */}
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1.5, color: "#111827" }}
          >
            Revenue Range
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Controller
                name="min_revenue"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Min Revenue"
                    type="number"
                    fullWidth
                    size="small"
                    disabled={isViewMode}
                    error={!!errors.min_revenue}
                    helperText={errors.min_revenue?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="max_revenue"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Max Revenue"
                    type="number"
                    fullWidth
                    size="small"
                    disabled={isViewMode}
                    error={!!errors.max_revenue}
                    helperText={errors.max_revenue?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Location */}
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1.5, color: "#111827" }}
          >
            Location
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    disabled={isViewMode}
                    error={!!errors.country}
                  >
                    <InputLabel>Country</InputLabel>
                    <Select {...field} label="Country">
                      {COUNTRIES.map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="State"
                    fullWidth
                    size="small"
                    disabled={isViewMode}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Checkboxes */}
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1.5, color: "#111827" }}
          >
            Business Details
          </Typography>

          <Grid container spacing={1}>
            {[
              { name: "is_sba_approved", label: "SBA Approved" },
              {
                name: "has_seller_financing",
                label: "Seller Financing Available",
              },
              { name: "is_distressed", label: "Distressed Sale" },
              { name: "is_remote", label: "Remote Business" },
              //   { name: "is_featured", label: "Featured Listing" },
            ].map(({ name, label }) => (
              <Grid item xs={6} key={name}>
                <Controller
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          disabled={isViewMode}
                          size="small"
                        />
                      }
                      label={<Typography variant="body2">{label}</Typography>}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* Documents Section */}
        <Paper sx={{ p: 2, mb: 3, mt: 2, backgroundColor: "#f9fafb" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "#111827" }}
            >
              📄 Business Documents
            </Typography>
            {!isViewMode && (
              <Chip
                label={`${documents.length} file(s)`}
                size="small"
                variant="outlined"
                color="info"
              />
            )}
          </Box>

          {/* Documents List */}
          {loadingDocuments ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={30} />
            </Box>
          ) : documents.length > 0 ? (
            <TableContainer sx={{ mb: 2, border: "1px solid #e5e7eb" }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: "#111827" }}>
                      File Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#111827" }}>
                      Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#111827" }}>
                      Uploaded
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 600, color: "#111827" }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((doc) => {
                    const fileName = doc.file_url
                      .split("/")
                      .pop()
                      .split("-")
                      .slice(1)
                      .join("-");
                    const uploadDate = new Date(
                      doc.created_at,
                    ).toLocaleDateString();

                    return (
                      <TableRow
                        key={doc.id}
                        sx={{
                          "&:hover": { backgroundColor: "#f9fafb" },
                        }}
                      >
                        <TableCell sx={{ py: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box sx={{ color: "#0884ff" }}>
                              {getFileIcon(doc.file_type)}
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: "150px",
                              }}
                              title={fileName}
                            >
                              {fileName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip
                            label={doc.file_type?.toUpperCase() || "FILE"}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.75rem",
                              height: 24,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1, fontSize: "0.875rem" }}>
                          {uploadDate}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1 }}>
                          <IconButton
                            size="small"
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Download"
                            sx={{
                              color: "#0884ff",
                              mr: 1,
                              "&:hover": { backgroundColor: "#e0f0ff" },
                            }}
                          >
                            <FiDownload size={16} />
                          </IconButton>
                          {!isViewMode && (
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDeleteDocument(doc.id, doc.file_url)
                              }
                              disabled={deletingDocId === doc.id}
                              title="Delete"
                              sx={{
                                color: "#ef4444",
                                "&:hover": { backgroundColor: "#fee2e2" },
                              }}
                            >
                              {deletingDocId === doc.id ? (
                                <CircularProgress size={16} />
                              ) : (
                                <FiTrash2 size={16} />
                              )}
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 3,
                color: "#9ca3af",
              }}
            >
              <FiFile size={32} style={{ margin: "0 auto 8px" }} />
              <Typography variant="body2">No documents uploaded yet</Typography>
            </Box>
          )}

          {/* Upload File Button */}
          {!isViewMode && (
            <Button
              component="label"
              variant="outlined"
              size="small"
              startIcon={
                uploadingFile ? (
                  <CircularProgress size={20} />
                ) : (
                  <FiUpload size={18} />
                )
              }
              fullWidth
              disabled={uploadingFile}
              sx={{
                textTransform: "none",
                color: "#0884ff",
                borderColor: "#0884ff",
                "&:hover": { borderColor: "#0670d6", color: "#0670d6" },
              }}
            >
              {uploadingFile ? "Uploading..." : "Upload Document"}
              <input
                hidden
                type="file"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />
            </Button>
          )}
        </Paper>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
        }}
      >
        <Box>
          {isViewMode && isAdmin && (
            <Button
              onClick={handleApprovalToggle}
              variant={isApproved ? "contained" : "outlined"}
              color={isApproved ? "error" : "success"}
              disabled={approvingStatus}
              size="small"
              sx={{
                textTransform: "none",
              }}
            >
              {approvingStatus ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  {isApproved ? "Rejecting..." : "Approving..."}
                </>
              ) : isApproved ? (
                "⊗ Reject Listing"
              ) : (
                "⊗ ✓ Approve Listing"
              )}
            </Button>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={handleClose}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            {isViewMode ? "Close" : "Cancel"}
          </Button>
          {!isViewMode && (
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              size="small"
              disabled={isLoading}
              sx={{
                backgroundColor: "#0884ff",
                color: "white",
                textTransform: "none",
                "&:hover": { backgroundColor: "#0670d6" },
              }}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
