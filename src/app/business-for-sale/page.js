"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Paper,
  Pagination,
  FormControlLabel,
  Checkbox,
  Slider,
} from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { getPublicListings } from "@/app/business-for-sale/actions";
import ListingCard from "@/components/dashboard/Listings/ListingCard";
import CATEGORIES from "@/data/categories.json";
import COUNTRIES_LIST from "@/data/countries.json";

export default function BusinessForSalePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    categories: CATEGORIES,
    countries: COUNTRIES_LIST,
    states: [],
  });

  // Filter state
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [country, setCountry] = useState(searchParams.get("country") || "");
  const [state, setState] = useState(searchParams.get("state") || "");
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get("minPrice")) || 0,
    parseInt(searchParams.get("maxPrice")) || 5000000,
  ]);
  const [revenueRange, setRevenueRange] = useState([
    parseInt(searchParams.get("minRevenue")) || 0,
    parseInt(searchParams.get("maxRevenue")) || 10000000,
  ]);

  // Feature flags
  const [featured, setFeatured] = useState(
    searchParams.get("featured") === "true",
  );
  const [sbaApproved, setSbaApproved] = useState(
    searchParams.get("sbaApproved") === "true",
  );
  const [sellerFinancing, setSellerFinancing] = useState(
    searchParams.get("sellerFinancing") === "true",
  );
  const [distressed, setDistressed] = useState(
    searchParams.get("distressed") === "true",
  );
  const [remote, setRemote] = useState(searchParams.get("remote") === "true");

  // Pagination
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);

  // Build query string from filters
  const buildQueryString = useCallback(
    (
      searchVal,
      categoryVal,
      statusVal,
      countryVal,
      stateVal,
      priceVal,
      revenueVal,
      pageVal,
    ) => {
      const params = new URLSearchParams();

      if (searchVal) params.set("search", searchVal);
      if (categoryVal !== "") params.set("category", categoryVal);
      if (statusVal !== "") params.set("status", statusVal);
      if (countryVal !== "") params.set("country", countryVal);
      if (stateVal) params.set("state", stateVal);
      if (priceVal[0] > 0) params.set("minPrice", priceVal[0]);
      if (priceVal[1] < 5000000) params.set("maxPrice", priceVal[1]);
      if (revenueVal[0] > 0) params.set("minRevenue", revenueVal[0]);
      if (revenueVal[1] < 10000000) params.set("maxRevenue", revenueVal[1]);
      if (featured) params.set("featured", "true");
      if (sbaApproved) params.set("sbaApproved", "true");
      if (sellerFinancing) params.set("sellerFinancing", "true");
      if (distressed) params.set("distressed", "true");
      if (remote) params.set("remote", "true");
      if (pageVal > 1) params.set("page", pageVal);

      return params.toString();
    },
    [featured, sbaApproved, sellerFinancing, distressed, remote],
  );

  // Fetch listings when filters change
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      // Build filters object with only non-default values
      const filters = {
        page,
        pageSize: 12,
      };

      // Only include search if not empty
      if (search) filters.search = search;

      // Only include category if not empty
      if (category) filters.category = category;

      // Only include status if not empty
      if (status) filters.status = status;

      // Only include country if not empty
      if (country) filters.country = country;

      // Only include state if not empty
      if (state) filters.state = state;

      // Only include price range if not at defaults
      if (priceRange[0] !== 0 || priceRange[1] !== 5000000) {
        filters.minPrice = priceRange[0];
        filters.maxPrice = priceRange[1];
      }

      // Only include revenue range if not at defaults
      if (revenueRange[0] !== 0 || revenueRange[1] !== 10000000) {
        filters.minRevenue = revenueRange[0];
        filters.maxRevenue = revenueRange[1];
      }

      // Only include feature flags if true
      if (featured) filters.featured = featured;
      if (sbaApproved) filters.sbaApproved = sbaApproved;
      if (sellerFinancing) filters.sellerFinancing = sellerFinancing;
      if (distressed) filters.distressed = distressed;
      if (remote) filters.remote = remote;

      const result = await getPublicListings(filters);

      if (result.success) {
        setListings(result.data);
        setTotalPages(result.totalPages);
      }
      setLoading(false);
    };

    fetchListings();
  }, [
    search,
    category,
    status,
    country,
    state,
    priceRange,
    revenueRange,
    featured,
    sbaApproved,
    sellerFinancing,
    distressed,
    remote,
    page,
  ]);

  // Update URL when filters change
  useEffect(() => {
    const queryString = buildQueryString(
      search,
      category,
      status,
      country,
      state,
      priceRange,
      revenueRange,
      page,
    );
    router.push(`/business-for-sale?${queryString}`);
  }, [
    search,
    category,
    status,
    country,
    state,
    priceRange,
    revenueRange,
    page,
    buildQueryString,
    router,
  ]);

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("");
    setCountry("");
    setState("");
    setPriceRange([0, 5000000]);
    setRevenueRange([0, 10000000]);
    setFeatured(false);
    setSbaApproved(false);
    setSellerFinancing(false);
    setDistressed(false);
    setRemote(false);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          🏢 Business Listings
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Explore approved business opportunities
        </Typography>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: "#ffffff" }}>
        <TextField
          fullWidth
          placeholder="Search by title, description..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: <FiSearch size={20} style={{ marginRight: 12 }} />,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 48,
            },
          }}
        />
      </Paper>

      <Grid container spacing={3}>
        {/* Left Sidebar - Filters */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2.5,
              backgroundColor: "#f9fafb",
              position: "sticky",
              top: 20,
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Filters
              </Typography>
              <Button
                size="small"
                onClick={handleResetFilters}
                sx={{
                  textTransform: "none",
                  color: "#0884ff",
                  "&:hover": { backgroundColor: "rgba(8, 132, 255, 0.08)" },
                }}
              >
                Reset
              </Button>
            </Box>

            {/* Category Filter */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {filterOptions.categories?.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Status Filter */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="loi">LOI</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
              </Select>
            </FormControl>

            {/* Country Filter */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Country</InputLabel>
              <Select
                value={country}
                label="Country"
                onChange={(e) => {
                  setCountry(e.target.value);
                  setState(""); // Reset state when country changes
                  setPage(1);
                }}
              >
                <MenuItem value="">All Countries</MenuItem>
                {filterOptions.countries?.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* State Filter */}
            {country !== "" && (
              <TextField
                fullWidth
                size="small"
                label="State"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setPage(1);
                }}
                sx={{ mb: 2 }}
              />
            )}

            {/* Price Range */}
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1, mt: 2 }}
            >
              Price Range
            </Typography>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => {
                setPriceRange(newValue);
                setPage(1);
              }}
              min={0}
              max={5000000}
              step={50000}
              marks={[
                { value: 0, label: "$0" },
                { value: 5000000, label: "$5M" },
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `$${(value / 1000000).toFixed(1)}M`}
              sx={{ mb: 2 }}
            />

            {/* Revenue Range */}
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1, mt: 2 }}
            >
              Revenue Range
            </Typography>
            <Slider
              value={revenueRange}
              onChange={(e, newValue) => {
                setRevenueRange(newValue);
                setPage(1);
              }}
              min={0}
              max={10000000}
              step={100000}
              marks={[
                { value: 0, label: "$0" },
                { value: 10000000, label: "$10M" },
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `$${(value / 1000000).toFixed(1)}M`}
              sx={{ mb: 2 }}
            />

            {/* Special Features */}
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1, mt: 2 }}
            >
              Special Features
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={featured}
                  onChange={(e) => {
                    setFeatured(e.target.checked);
                    setPage(1);
                  }}
                />
              }
              label="Featured Only"
              sx={{ display: "block", mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={sbaApproved}
                  onChange={(e) => {
                    setSbaApproved(e.target.checked);
                    setPage(1);
                  }}
                />
              }
              label="SBA Approved"
              sx={{ display: "block", mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={sellerFinancing}
                  onChange={(e) => {
                    setSellerFinancing(e.target.checked);
                    setPage(1);
                  }}
                />
              }
              label="Seller Financing"
              sx={{ display: "block", mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={distressed}
                  onChange={(e) => {
                    setDistressed(e.target.checked);
                    setPage(1);
                  }}
                />
              }
              label="Distressed Sales"
              sx={{ display: "block", mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={remote}
                  onChange={(e) => {
                    setRemote(e.target.checked);
                    setPage(1);
                  }}
                />
              }
              label="Remote Business"
              sx={{ display: "block" }}
            />
          </Paper>
        </Grid>

        {/* Right Content - Listings Grid */}
        <Grid item xs={12} md={9}>
          {loading ? (
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
          ) : listings.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "#9ca3af",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                No listings found
              </Typography>
              <Typography variant="body2">
                Try adjusting your filters
              </Typography>
            </Box>
          ) : (
            <>
              {/* Results Count */}
              <Typography variant="body2" sx={{ mb: 2, color: "#6b7280" }}>
                Showing {listings.length} listings
              </Typography>

              {/* Listings Grid */}
              <Grid container spacing={2}>
                {listings.map((listing) => (
                  <Grid item xs={12} sm={6} lg={4} key={listing.id}>
                    <ListingCard listing={listing} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
