"use client";

import { useState, useEffect, useMemo } from "react";
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
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import { FiX, FiTrash2 } from "react-icons/fi";
import { MdCheckCircle } from "react-icons/md";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Country, State, City } from "country-state-city";
import {
  listingEditSchema,
  BUSINESS_CATEGORIES,
  STATUS_OPTIONS,
  CURRENCY_OPTIONS,
} from "./listingSchema";
import { createListing } from "@/app/dashboard/listings/actions";
import BUSINESS_TAG_OPTIONS from "@/data/businessTags";
import CopyableId from "@/components/business-for-sale/CopyableId";
import { formatListingId } from "@/utils/listingIdFormater";

const formatNumberDisplay = (value) => {
  if (value === null || value === undefined || value === "") return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parseNumberInput = (value) => {
  const normalizedValue = value.replace(/[^\d]/g, "");
  return normalizedValue ? Number(normalizedValue) : null;
};

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
  const [approvingStatus, setApprovingStatus] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isApproved, setIsApproved] = useState(listing?.is_approved || false);
  const [tags, setTags] = useState(listing?.tags || []);
  const [links, setLinks] = useState(listing?.links || []);

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddLink = () => {
    setLinks((prev) => [...prev, { text: "", link: "" }]);
  };

  const handleUpdateLink = (index, key, value) => {
    setLinks((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  };

  const handleRemoveLink = (index) => {
    setLinks((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const selectedTagOptions = useMemo(
    () => BUSINESS_TAG_OPTIONS.filter((option) => tags.includes(option.value)),
    [tags],
  );

  const getTagTitle = (tagValue) => {
    return (
      BUSINESS_TAG_OPTIONS.find((option) => option.value === tagValue)?.title ||
      tagValue
    );
  };

  const isViewMode = mode === "view";
  const isNewMode = mode === "new";

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(listingEditSchema),
    defaultValues: {
      title: listing?.title || "",
      description: listing?.description || "",
      business_category: listing?.business_category || "",
      status: listing?.status || "available",
      currency: listing?.currency || "USD",
      min_price: listing?.min_price || null,
      min_revenue: listing?.min_revenue || null,
      min_cashflow: listing?.min_cashflow || null,
      no_of_employees: listing?.no_of_employees || null,
      country: listing?.country || "",
      state: listing?.state || "",
      city: listing?.city || "",
      is_sba_approved: listing?.is_sba_approved || false,
      has_seller_financing: listing?.has_seller_financing || false,
      is_distressed: listing?.is_distressed || false,
      is_remote: listing?.is_remote || false,
      is_featured: listing?.is_featured || false,
      reference_no: listing?.reference_no || "",
    },
  });

  const selectedCountryName = useWatch({ control, name: "country" });
  const selectedStateName = useWatch({ control, name: "state" });
  const selectedCityName = useWatch({ control, name: "city" });
  const selectedCurrencyCode = useWatch({ control, name: "currency" });

  const countryOptions = useMemo(() => Country.getAllCountries(), []);
  const selectedCountry = useMemo(
    () =>
      countryOptions.find((country) => country.name === selectedCountryName),
    [countryOptions, selectedCountryName],
  );
  const stateOptions = useMemo(() => {
    if (!selectedCountry?.isoCode) return [];
    return State.getStatesOfCountry(selectedCountry.isoCode);
  }, [selectedCountry?.isoCode]);
  const selectedState = useMemo(
    () => stateOptions.find((state) => state.name === selectedStateName),
    [selectedStateName, stateOptions],
  );
  const cityOptions = useMemo(() => {
    if (!selectedCountry?.isoCode || !selectedState?.isoCode) return [];
    return City.getCitiesOfState(
      selectedCountry.isoCode,
      selectedState.isoCode,
    );
  }, [selectedCountry?.isoCode, selectedState?.isoCode]);
  const selectedCurrency = useMemo(
    () =>
      CURRENCY_OPTIONS.find(
        (currency) => currency.code === selectedCurrencyCode,
      ) || CURRENCY_OPTIONS[0],
    [selectedCurrencyCode],
  );

  useEffect(() => {
    if (!selectedCountryName) {
      if (selectedStateName) {
        setValue("state", "", { shouldValidate: true });
      }
      if (selectedCityName) {
        setValue("city", "", { shouldValidate: true });
      }
      return;
    }

    if (selectedStateName) {
      const stateExists = stateOptions.some(
        (state) => state.name === selectedStateName,
      );

      if (!stateExists) {
        setValue("state", "", { shouldValidate: true });
        setValue("city", "", { shouldValidate: true });
        return;
      }
    }

    if (!selectedStateName) {
      if (selectedCityName) {
        setValue("city", "", { shouldValidate: true });
      }
      return;
    }

    if (!selectedCityName) return;

    const cityExists = cityOptions.some(
      (city) => city.name === selectedCityName,
    );
    if (!cityExists) {
      setValue("city", "", { shouldValidate: true });
    }
  }, [
    cityOptions,
    selectedCityName,
    selectedCountryName,
    selectedStateName,
    setValue,
    stateOptions,
  ]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (isNewMode) {
        const sanitizedLinks = links
          .map((item) => ({
            text: item?.text?.trim() || "",
            link: item?.link?.trim() || "",
          }))
          .filter((item) => item.text && item.link);

        const result = await createListing({
          ...data,
          tags,
          links: sanitizedLinks,
        });
        if (result?.error) {
          setErrorMessage(result.error);
          return;
        }
        setSuccessMessage("Listing submitted for approval!");
        onSave && onSave({ ...result.data, tags, links: sanitizedLinks });
      } else {
        const sanitizedLinks = links
          .map((item) => ({
            text: item?.text?.trim() || "",
            link: item?.link?.trim() || "",
          }))
          .filter((item) => item.text && item.link);

        await onSave({ ...data, tags, links: sanitizedLinks });
        setSuccessMessage("Listing updated successfully!");
      }

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
    setTags([]);
    setLinks(listing?.links || []);
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

  const listingIdInfo =
    !isNewMode && listing?.id ? formatListingId(listing.id) : null;

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
            {isNewMode
              ? "Create New Listing"
              : isViewMode
                ? "View Listing"
                : "Edit Listing"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#6b7280" }}>
            {isNewMode
              ? "Fill in the details to submit for approval"
              : isViewMode
                ? "View details"
                : "Update your listing information"}
          </Typography>
          {listingIdInfo && (
            <Box sx={{ mt: 0.5 }}>
              <CopyableId
                formatted={listingIdInfo.formatted}
                original={listingIdInfo.original}
              />
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {!isNewMode && (
            <Chip
              label={isApproved ? "✓ Approved" : "⊗ Pending"}
              size="small"
              color={isApproved ? "success" : "warning"}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          )}
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

        {/* Form Fields */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Title */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => {
              const currentLength = field.value?.length || 0;
              const maxLength = 80;
              const remaining = maxLength - currentLength;

              return (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    {...field}
                    label="Business Title"
                    fullWidth
                    variant="outlined"
                    size="small"
                    disabled={isViewMode}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    multiline
                    minRows={1}
                    maxRows={3}
                    inputProps={{ maxLength }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      },
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 0.5,
                      px: 1,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                      {currentLength}/{maxLength} characters
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: remaining < 20 ? "#ef4444" : "#6b7280",
                        fontWeight: remaining < 20 ? 600 : 400,
                      }}
                    >
                      5 minimum, {remaining} left
                    </Typography>
                  </Box>
                </Box>
              );
            }}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => {
              const currentLength = field.value?.length || 0;
              const maxLength = 5000;
              const remaining = maxLength - currentLength;

              return (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    variant="outlined"
                    multiline
                    minRows={16}
                    maxRows={32}
                    size="small"
                    disabled={isViewMode}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    inputProps={{ maxLength }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 0.5,
                      px: 1,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                      {currentLength}/{maxLength} characters
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: remaining < 200 ? "#ef4444" : "#6b7280",
                        fontWeight: remaining < 200 ? 600 : 400,
                      }}
                    >
                      500 minimum, {remaining} left
                    </Typography>
                  </Box>
                </Box>
              );
            }}
          />

          {/* Category & Status */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    disabled={isViewMode}
                    error={!!errors.currency}
                  >
                    <InputLabel>Currency</InputLabel>
                    <Select {...field} label="Currency">
                      {CURRENCY_OPTIONS.map((currency) => (
                        <MenuItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.currency_name} (
                          {currency.symbol})
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
            Asking Price
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Controller
                name="min_price"
                control={control}
                render={({ field }) => (
                  <TextField
                    name={field.name}
                    inputRef={field.ref}
                    label="Price"
                    type="text"
                    fullWidth
                    size="small"
                    disabled={isViewMode}
                    error={!!errors.min_price}
                    helperText={errors.min_price?.message}
                    value={formatNumberDisplay(field.value)}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(parseNumberInput(event.target.value))
                    }
                    inputProps={{ inputMode: "numeric", maxLength: 15 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {selectedCurrency.symbol}
                        </InputAdornment>
                      ),
                    }}
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
            Annual Revenue
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Controller
                name="min_revenue"
                control={control}
                render={({ field }) => (
                  <TextField
                    name={field.name}
                    inputRef={field.ref}
                    label="Revenue"
                    type="text"
                    fullWidth
                    size="small"
                    disabled={isViewMode}
                    error={!!errors.min_revenue}
                    helperText={errors.min_revenue?.message}
                    value={formatNumberDisplay(field.value)}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(parseNumberInput(event.target.value))
                    }
                    inputProps={{ inputMode: "numeric", maxLength: 15 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {selectedCurrency.symbol}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Cashflow Range */}
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1.5, color: "#111827" }}
          >
            Annual Cashflow
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Controller
                name="min_cashflow"
                control={control}
                render={({ field }) => (
                  <TextField
                    name={field.name}
                    inputRef={field.ref}
                    label="Cashflow"
                    type="text"
                    fullWidth
                    size="small"
                    disabled={isViewMode}
                    error={!!errors.min_cashflow}
                    helperText={errors.min_cashflow?.message}
                    value={formatNumberDisplay(field.value)}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(parseNumberInput(event.target.value))
                    }
                    inputProps={{ inputMode: "numeric", maxLength: 15 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {selectedCurrency.symbol}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Team Size */}
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1.5, color: "#111827" }}
          >
            Team Details
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={12}>
              <Controller
                name="no_of_employees"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="No. of Employees"
                    type="number"
                    fullWidth
                    size="small"
                    disabled={isViewMode}
                    error={!!errors.no_of_employees}
                    helperText={errors.no_of_employees?.message}
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
            Country, State & City
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
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
                      {countryOptions.map((country) => (
                        <MenuItem key={country.isoCode} value={country.name}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    disabled={isViewMode || !selectedCountryName}
                    error={!!errors.state}
                  >
                    <InputLabel>State</InputLabel>
                    <Select {...field} label="State">
                      {selectedCountryName && stateOptions.length === 0 && (
                        <MenuItem disabled value="">
                          No states available
                        </MenuItem>
                      )}
                      {stateOptions.map((state) => (
                        <MenuItem
                          key={`${state.countryCode}-${state.isoCode}`}
                          value={state.name}
                        >
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    disabled={isViewMode || !selectedStateName}
                    error={!!errors.city}
                  >
                    <InputLabel>City</InputLabel>
                    <Select {...field} label="City">
                      {selectedStateName && cityOptions.length === 0 && (
                        <MenuItem disabled value="">
                          No cities available
                        </MenuItem>
                      )}
                      {cityOptions.map((city) => (
                        <MenuItem
                          key={`${city.countryCode}-${city.stateCode}-${city.name}`}
                          value={city.name}
                        >
                          {city.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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

          {/* Tags Section */}
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1.5, color: "#111827" }}
          >
            Business Tags (Max 8)
          </Typography>

          {!isViewMode && (
            <Autocomplete
              multiple
              options={BUSINESS_TAG_OPTIONS}
              fullWidth
              size="small"
              disableCloseOnSelect
              ListboxProps={{
                sx: {
                  py: 0.5,
                  "& .MuiAutocomplete-option": {
                    minHeight: 44,
                    py: 1,
                    px: 1.5,
                    lineHeight: 1.4,
                    alignItems: "center",
                  },
                },
              }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 0.5,
                    borderRadius: 2,
                  },
                },
              }}
              value={selectedTagOptions}
              getOptionLabel={(option) => option.title}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              onChange={(event, value) => {
                setTags(value.map((item) => item.value).slice(0, 8));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select business tags..."
                  sx={{ mb: 2 }}
                />
              )}
            />
          )}

          {/* Tags Display */}
          {tags.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={getTagTitle(tag)}
                  onDelete={() => handleRemoveTag(tag)}
                  disabled={isViewMode}
                  sx={{
                    backgroundColor: "#dbeafe",
                    color: "#0284c7",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    "& .MuiChip-deleteIcon": {
                      color: "#0284c7",
                      "&:hover": { color: "#0670d6" },
                    },
                  }}
                />
              ))}
            </Box>
          )}

          {tags.length > 0 && (
            <Typography
              variant="caption"
              sx={{
                color: tags.length >= 8 ? "#ef4444" : "#9ca3af",
                fontWeight: tags.length >= 8 ? 600 : 400,
                display: "block",
                mb: 2,
              }}
            >
              {tags.length}/8 tags used
            </Typography>
          )}

          {/* External Links */}
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "#111827" }}
            >
              External Links
            </Typography>
            {!isViewMode && (
              <Button
                size="small"
                variant="outlined"
                onClick={handleAddLink}
                disabled={links.length >= 10}
                sx={{ textTransform: "none" }}
              >
                Add Link
              </Button>
            )}
          </Box>

          {links.length === 0 ? (
            <Typography
              variant="caption"
              sx={{ color: "#9ca3af", mb: 2, display: "block" }}
            >
              No external links added.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
                mb: 2,
              }}
            >
              {links.map((item, index) => (
                <Grid container spacing={1} key={`listing-link-${index}`}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      value={item.text || ""}
                      onChange={(event) =>
                        handleUpdateLink(index, "text", event.target.value)
                      }
                      label="Link Text"
                      fullWidth
                      size="small"
                      disabled={isViewMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <TextField
                      value={item.link || ""}
                      onChange={(event) =>
                        handleUpdateLink(index, "link", event.target.value)
                      }
                      label="URL"
                      fullWidth
                      size="small"
                      disabled={isViewMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    {!isViewMode && (
                      <IconButton
                        onClick={() => handleRemoveLink(index)}
                        size="small"
                        sx={{ mt: { sm: 0.5 } }}
                      >
                        <FiTrash2 size={16} />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Box>
          )}

          <Divider sx={{ my: 2 }} />
          <Controller
            name="reference_no"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Reference ID"
                fullWidth
                size="small"
                disabled={isViewMode}
                error={!!errors.reference_no}
                helperText={
                  errors.reference_no?.message || "Maximum 6 characters"
                }
                inputProps={{ maxLength: 6 }}
                sx={{ mb: 2 }}
              />
            )}
          />
        </Box>
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
              {isLoading
                ? "Saving..."
                : isNewMode
                  ? "Submit for Approval"
                  : "Save Changes"}
            </Button>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
