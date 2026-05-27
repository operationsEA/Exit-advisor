"use client";

import { useState, useRef, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  FiUploadCloud,
  FiDownload,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiFile,
} from "react-icons/fi";
import { bulkUploadListings } from "@/app/dashboard/listings/actions";

const TEMPLATE_HEADERS = [
  "title",
  "description",
  "category",
  "status",
  "currency",
  "price",
  "revenue",
  "cashflow",
  "employees",
  "reference_no",
  "country",
  "state",
  "sba_approved",
  "seller_financing",
  "distressed",
  "remote",
  "tags",
  "links",
];

const EXAMPLE_ROW = [
  "Downtown Coffee Shop",
  "This is a profitable coffee shop established in 2018 located in the heart of downtown. The business has a loyal customer base and consistent revenue streams from both walk-in customers and corporate catering contracts. Includes all equipment, furniture, and established supplier relationships. Lease is favorable with 3 years remaining and two 5-year renewal options. Full training and transition support provided by current owner. Strong brand recognition in the area with 4.8 star rating on Google with over 500 reviews. Owner is selling due to relocation abroad.",
  "Restaurant & Café",
  "available",
  "USD",
  "250000",
  "180000",
  "45000",
  "8",
  "BIZ01",
  "United States",
  "California",
  "FALSE",
  "TRUE",
  "FALSE",
  "FALSE",
  "coffee, food & beverage, hospitality",
  "Website|https://example.com, Instagram|https://instagram.com/example",
];

const COLUMN_NOTES = [
  "Required. 5–80 characters.",
  "Required. Min 500 characters — describe the business fully.",
  "Required. One of: Retail Store, Restaurant & Café, Technology Startup, Consulting Firm, E-commerce Business, Fitness & Wellness, Real Estate Agency, Marketing Agency, Manufacturing, Professional Services",
  "draft / available / loi / sold (default: draft)",
  "USD, EUR, GBP, AED, SAR, INR, CAD, AUD, JPY, SGD (default: USD)",
  "Asking price (numbers only, no symbols)",
  "Annual revenue",
  "Annual cash flow",
  "Number of employees",
  "Up to 6 characters",
  "Required. Country name (e.g. United States)",
  "State or province",
  "TRUE or FALSE",
  "TRUE or FALSE",
  "TRUE or FALSE",
  "TRUE or FALSE",
  "Comma-separated tags (max 8, e.g. coffee, retail)",
  "Format: Label|URL pairs separated by commas (e.g. Website|https://example.com, Docs|https://example.com/docs)",
];

async function downloadTemplate() {
  const XLSX = await import("xlsx");

  const notesRow = COLUMN_NOTES;
  const aoa = [TEMPLATE_HEADERS, notesRow, EXAMPLE_ROW];

  const worksheet = XLSX.utils.aoa_to_sheet(aoa);

  // Set column widths
  worksheet["!cols"] = TEMPLATE_HEADERS.map((h) => ({
    wch: h === "description" ? 60 : h === "category" ? 30 : 20,
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Listings");

  XLSX.writeFile(workbook, "listings-bulk-upload-template.xlsx");
}

export default function BrokerExcelUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [globalError, setGlobalError] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = useCallback((selectedFile) => {
    setResult(null);
    setGlobalError("");
    if (!selectedFile) return;

    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls"].includes(ext)) {
      setGlobalError("Invalid file type. Please select an .xlsx or .xls file.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setGlobalError("File too large. Maximum size is 5MB.");
      return;
    }
    setFile(selectedFile);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile],
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setGlobalError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await bulkUploadListings(formData);

      if (res.error) {
        setGlobalError(res.error);
      } else {
        setResult(res);
        if (res.summary?.succeeded > 0 && onUploaded) {
          onUploaded(res.summary.succeeded);
        }
      }
    } catch (err) {
      setGlobalError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    setGlobalError("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "#111827", mb: 0.5 }}
        >
          Bulk Upload Listings
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Upload an Excel file (.xlsx or .xls) to create multiple listings at
          once. Maximum 100 listings per upload.
        </Typography>
      </Box>

      {/* Template Download */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          bgcolor: "#eff6ff",
          borderRadius: 2,
          border: "1px solid #bfdbfe",
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#1e40af" }}
          >
            Download Template
          </Typography>
          <Typography variant="caption" sx={{ color: "#3b82f6" }}>
            Use this template to ensure correct column format
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FiDownload />}
          onClick={downloadTemplate}
          sx={{
            borderColor: "#3b82f6",
            color: "#3b82f6",
            textTransform: "none",
            "&:hover": {
              borderColor: "#1d4ed8",
              color: "#1d4ed8",
              bgcolor: "#dbeafe",
            },
          }}
        >
          Download
        </Button>
      </Box>

      {/* Drop Zone */}
      {!file && (
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: `2px dashed ${isDragging ? "#0884ff" : "#d1d5db"}`,
            borderRadius: 2,
            p: 5,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: isDragging ? "#eff6ff" : "#f9fafb",
            transition: "all 0.15s ease",
            "&:hover": { borderColor: "#0884ff", bgcolor: "#eff6ff" },
          }}
        >
          <FiUploadCloud size={40} color={isDragging ? "#0884ff" : "#9ca3af"} />
          <Typography
            variant="body1"
            sx={{ mt: 2, fontWeight: 500, color: "#374151" }}
          >
            Drag & drop your Excel file here
          </Typography>
          <Typography variant="body2" sx={{ color: "#9ca3af", mt: 0.5 }}>
            or click to browse — .xlsx / .xls, max 5MB
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={handleInputChange}
          />
        </Box>
      )}

      {/* Selected File */}
      {file && !result && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            bgcolor: "#f0fdf4",
            borderRadius: 2,
            border: "1px solid #bbf7d0",
          }}
        >
          <FiFile size={24} color="#16a34a" />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#15803d" }}
              noWrap
            >
              {file.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              {(file.size / 1024).toFixed(1)} KB
            </Typography>
          </Box>
          <Tooltip title="Remove file">
            <IconButton size="small" onClick={handleClear}>
              <FiX size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Global Error */}
      {globalError && (
        <Alert severity="error" onClose={() => setGlobalError("")}>
          {globalError}
        </Alert>
      )}

      {/* Upload Button */}
      {file && !result && (
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={uploading}
          sx={{
            backgroundColor: "#0884ff",
            color: "white",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#0670d6" },
            "&:disabled": { backgroundColor: "#93c5fd" },
          }}
        >
          {uploading ? "Uploading..." : "Upload Listings"}
        </Button>
      )}

      {/* Progress */}
      {uploading && <LinearProgress sx={{ borderRadius: 1 }} />}

      {/* Results Summary */}
      {result && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Summary chips */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#374151" }}
            >
              Upload complete:
            </Typography>
            <Chip
              icon={<FiCheckCircle size={14} />}
              label={`${result.summary.succeeded} succeeded`}
              size="small"
              sx={{ bgcolor: "#dcfce7", color: "#15803d", fontWeight: 600 }}
            />
            {result.summary.failed > 0 && (
              <Chip
                icon={<FiAlertCircle size={14} />}
                label={`${result.summary.failed} failed`}
                size="small"
                sx={{ bgcolor: "#fee2e2", color: "#dc2626", fontWeight: 600 }}
              />
            )}
            <Button
              size="small"
              variant="outlined"
              onClick={handleClear}
              sx={{
                ml: "auto",
                textTransform: "none",
                borderColor: "#d1d5db",
                color: "#374151",
              }}
            >
              Upload Another File
            </Button>
          </Box>

          {/* Per-row results table */}
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ maxHeight: 400, overflow: "auto" }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 700, bgcolor: "#f9fafb", width: 60 }}
                  >
                    Row
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: "#f9fafb" }}>
                    Title
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, bgcolor: "#f9fafb", width: 100 }}
                  >
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: "#f9fafb" }}>
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.results.map((row) => (
                  <TableRow
                    key={row.row}
                    sx={{
                      bgcolor: row.status === "success" ? "#f0fdf4" : "#fff7f7",
                    }}
                  >
                    <TableCell sx={{ color: "#6b7280", fontSize: 13 }}>
                      {row.row}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, maxWidth: 200 }}>
                      <Typography variant="caption" noWrap display="block">
                        {row.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {row.status === "success" ? (
                        <Chip
                          label="Success"
                          size="small"
                          sx={{
                            bgcolor: "#dcfce7",
                            color: "#15803d",
                            fontSize: 11,
                          }}
                        />
                      ) : (
                        <Chip
                          label="Failed"
                          size="small"
                          sx={{
                            bgcolor: "#fee2e2",
                            color: "#dc2626",
                            fontSize: 11,
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>
                      {row.status === "success" ? (
                        <Typography variant="caption" sx={{ color: "#16a34a" }}>
                          Created successfully
                        </Typography>
                      ) : (
                        <Box component="ul" sx={{ m: 0, pl: 2 }}>
                          {row.errors?.map((err, idx) => (
                            <li key={idx}>
                              <Typography
                                variant="caption"
                                sx={{ color: "#dc2626" }}
                              >
                                {err}
                              </Typography>
                            </li>
                          ))}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}
