import { Box, Grid, Typography, Chip } from "@mui/material";
import ListingCard from "@/components/dashboard/Listings/ListingCard";
import PaginationClient from "@/components/business-for-sale/PaginationClient";
import { getPublicListings } from "@/app/business-for-sale/actions";
import {
  PRICE_LIMITS,
  REVENUE_LIMITS,
  CASHFLOW_LIMITS,
  EMPLOYEE_LIMITS,
} from "@/data/listingFilterRanges";

/**
 * Server Component - Listings Grid
 * Fetches listings based on search params and renders them
 */
export default async function ListingsGrid({ searchParams }) {
  // Parse all filter parameters from URL
  const search = searchParams.search || "";
  const category = searchParams.category || "";
  const status = searchParams.status || "";
  const country = searchParams.country || "";
  const state = searchParams.state || "";
  const page = parseInt(searchParams.page || "1", 10);
  const tag = searchParams.tag || "";

  // Parse ranges
  const minPrice = parseInt(searchParams.minPrice || PRICE_LIMITS[0], 10);
  const maxPrice = parseInt(searchParams.maxPrice || PRICE_LIMITS[1], 10);
  const minRevenue = parseInt(searchParams.minRevenue || REVENUE_LIMITS[0], 10);
  const maxRevenue = parseInt(searchParams.maxRevenue || REVENUE_LIMITS[1], 10);
  const minCashflow = parseInt(
    searchParams.minCashflow || CASHFLOW_LIMITS[0],
    10,
  );
  const maxCashflow = parseInt(
    searchParams.maxCashflow || CASHFLOW_LIMITS[1],
    10,
  );
  const minEmployees = parseInt(
    searchParams.minEmployees || EMPLOYEE_LIMITS[0],
    10,
  );
  const maxEmployees = parseInt(
    searchParams.maxEmployees || EMPLOYEE_LIMITS[1],
    10,
  );

  // Parse feature flags
  const featured = searchParams.featured === "true";
  const sbaApproved = searchParams.sbaApproved === "true";
  const sellerFinancing = searchParams.sellerFinancing === "true";
  const distressed = searchParams.distressed === "true";
  const remote = searchParams.remote === "true";

  // Build filters object
  const filters = {
    page,
    pageSize: 12,
  };

  if (search) filters.search = search;
  if (category) filters.category = category;
  if (status) filters.status = status;
  if (country) filters.country = country;
  if (state) filters.state = state;

  if (minPrice > PRICE_LIMITS[0] || maxPrice < PRICE_LIMITS[1]) {
    if (minPrice > PRICE_LIMITS[0]) filters.minPrice = minPrice;
    if (maxPrice < PRICE_LIMITS[1]) filters.maxPrice = maxPrice;
  }

  if (minRevenue > REVENUE_LIMITS[0] || maxRevenue < REVENUE_LIMITS[1]) {
    if (minRevenue > REVENUE_LIMITS[0]) filters.minRevenue = minRevenue;
    if (maxRevenue < REVENUE_LIMITS[1]) filters.maxRevenue = maxRevenue;
  }

  if (minCashflow > CASHFLOW_LIMITS[0] || maxCashflow < CASHFLOW_LIMITS[1]) {
    if (minCashflow > CASHFLOW_LIMITS[0]) filters.minCashflow = minCashflow;
    if (maxCashflow < CASHFLOW_LIMITS[1]) filters.maxCashflow = maxCashflow;
  }

  if (minEmployees > EMPLOYEE_LIMITS[0] || maxEmployees < EMPLOYEE_LIMITS[1]) {
    if (minEmployees > EMPLOYEE_LIMITS[0])
      filters.minNoOfEmployees = minEmployees;
    if (maxEmployees < EMPLOYEE_LIMITS[1])
      filters.maxNoOfEmployees = maxEmployees;
  }

  if (featured) filters.featured = featured;
  if (sbaApproved) filters.sbaApproved = sbaApproved;
  if (sellerFinancing) filters.sellerFinancing = sellerFinancing;
  if (distressed) filters.distressed = distressed;
  if (remote) filters.remote = remote;
  if (tag) filters.tag = tag;

  // Fetch listings on server
  const result = await getPublicListings(filters);

  if (!result.success) {
    return (
      <Box sx={{ textAlign: "center", py: 8, color: "#9ca3af" }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Error loading listings
        </Typography>
        <Typography variant="body2">Please try again later</Typography>
      </Box>
    );
  }

  const listings = result.data || [];
  const totalPages = result.totalPages || 1;

  return (
    <>
      {/* Active Filters Display */}
      {tag && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#6b7280", fontWeight: 500 }}
          >
            Active filters:
          </Typography>
          <Chip
            label={`Tag: ${tag}`}
            size="small"
            sx={{
              backgroundColor: "#dbeafe",
              color: "#0284c7",
              fontWeight: 600,
            }}
          />
        </Box>
      )}

      {/* Results Count */}
      <Typography variant="body2" sx={{ mb: 2, color: "#6b7280" }}>
        Showing {listings.length} listings
      </Typography>

      {listings.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, color: "#9ca3af" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            No listings found
          </Typography>
          <Typography variant="body2">Try adjusting your filters</Typography>
        </Box>
      ) : (
        <>
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
              <PaginationClient totalPages={totalPages} currentPage={page} />
            </Box>
          )}
        </>
      )}
    </>
  );
}
