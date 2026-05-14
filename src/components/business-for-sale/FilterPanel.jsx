"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";
import RangeFilterPopover from "@/components/business-for-sale/RangeFilterPopover";
import TagsSelect from "@/components/business-for-sale/TagsSelect";
import CATEGORIES from "@/data/categories.json";
import COUNTRIES_LIST from "@/data/countries.json";
import {
  PRICE_LIMITS,
  REVENUE_LIMITS,
  CASHFLOW_LIMITS,
  EMPLOYEE_LIMITS,
  PRICE_PRESETS,
  REVENUE_PRESETS,
  CASHFLOW_PRESETS,
  EMPLOYEE_PRESETS,
} from "@/data/listingFilterRanges";

function parseIntegerOrDefault(rawValue, fallback) {
  const parsed = Number.parseInt(rawValue || "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const formatCurrency = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

/**
 * Client Component - Filter Panel
 * Handles all filter interactions and URL updates
 */
export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter state
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [country, setCountry] = useState(searchParams.get("country") || "");
  const [state, setState] = useState(searchParams.get("state") || "");
  const [priceRange, setPriceRange] = useState([
    parseIntegerOrDefault(searchParams.get("minPrice"), PRICE_LIMITS[0]),
    parseIntegerOrDefault(searchParams.get("maxPrice"), PRICE_LIMITS[1]),
  ]);
  const [revenueRange, setRevenueRange] = useState([
    parseIntegerOrDefault(searchParams.get("minRevenue"), REVENUE_LIMITS[0]),
    parseIntegerOrDefault(searchParams.get("maxRevenue"), REVENUE_LIMITS[1]),
  ]);
  const [cashflowRange, setCashflowRange] = useState([
    parseIntegerOrDefault(searchParams.get("minCashflow"), CASHFLOW_LIMITS[0]),
    parseIntegerOrDefault(searchParams.get("maxCashflow"), CASHFLOW_LIMITS[1]),
  ]);
  const [employeeRange, setEmployeeRange] = useState([
    parseIntegerOrDefault(searchParams.get("minEmployees"), EMPLOYEE_LIMITS[0]),
    parseIntegerOrDefault(searchParams.get("maxEmployees"), EMPLOYEE_LIMITS[1]),
  ]);
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
  const [tag, setTag] = useState(searchParams.get("tag") || "");

  // Build and push query string
  const updateFilters = useCallback(
    (filterUpdates) => {
      const params = new URLSearchParams();

      const searchVal = filterUpdates.search ?? search;
      const categoryVal = filterUpdates.category ?? category;
      const statusVal = filterUpdates.status ?? status;
      const countryVal = filterUpdates.country ?? country;
      const stateVal = filterUpdates.state ?? state;
      const priceVal = filterUpdates.priceRange ?? priceRange;
      const revenueVal = filterUpdates.revenueRange ?? revenueRange;
      const cashflowVal = filterUpdates.cashflowRange ?? cashflowRange;
      const employeeVal = filterUpdates.employeeRange ?? employeeRange;
      const featuredVal = filterUpdates.featured ?? featured;
      const sbaVal = filterUpdates.sbaApproved ?? sbaApproved;
      const sellerFinVal = filterUpdates.sellerFinancing ?? sellerFinancing;
      const distressedVal = filterUpdates.distressed ?? distressed;
      const remoteVal = filterUpdates.remote ?? remote;
      const tagVal = filterUpdates.tag ?? tag;
      const pageVal = filterUpdates.page ?? 1;

      if (searchVal) params.set("search", searchVal);
      if (categoryVal !== "") params.set("category", categoryVal);
      if (statusVal !== "") params.set("status", statusVal);
      if (countryVal !== "") params.set("country", countryVal);
      if (stateVal) params.set("state", stateVal);
      if (priceVal[0] > PRICE_LIMITS[0]) params.set("minPrice", priceVal[0]);
      if (priceVal[1] < PRICE_LIMITS[1]) params.set("maxPrice", priceVal[1]);
      if (revenueVal[0] > REVENUE_LIMITS[0])
        params.set("minRevenue", revenueVal[0]);
      if (revenueVal[1] < REVENUE_LIMITS[1])
        params.set("maxRevenue", revenueVal[1]);
      if (cashflowVal[0] > CASHFLOW_LIMITS[0])
        params.set("minCashflow", cashflowVal[0]);
      if (cashflowVal[1] < CASHFLOW_LIMITS[1])
        params.set("maxCashflow", cashflowVal[1]);
      if (employeeVal[0] > EMPLOYEE_LIMITS[0])
        params.set("minEmployees", employeeVal[0]);
      if (employeeVal[1] < EMPLOYEE_LIMITS[1])
        params.set("maxEmployees", employeeVal[1]);
      if (featuredVal) params.set("featured", "true");
      if (sbaVal) params.set("sbaApproved", "true");
      if (sellerFinVal) params.set("sellerFinancing", "true");
      if (distressedVal) params.set("distressed", "true");
      if (remoteVal) params.set("remote", "true");
      if (tagVal) params.set("tag", tagVal);
      if (pageVal > 1) params.set("page", pageVal);

      router.push(`/business-for-sale?${params.toString()}`);
    },
    [
      search,
      category,
      status,
      country,
      state,
      priceRange,
      revenueRange,
      cashflowRange,
      employeeRange,
      featured,
      sbaApproved,
      sellerFinancing,
      distressed,
      remote,
      tag,
      router,
    ],
  );

  const handleResetFilters = () => {
    router.push("/business-for-sale");
    setSearch("");
    setCategory("");
    setStatus("");
    setCountry("");
    setState("");
    setPriceRange(PRICE_LIMITS);
    setRevenueRange(REVENUE_LIMITS);
    setCashflowRange(CASHFLOW_LIMITS);
    setEmployeeRange(EMPLOYEE_LIMITS);
    setFeatured(false);
    setSbaApproved(false);
    setSellerFinancing(false);
    setDistressed(false);
    setRemote(false);
    setTag("");
  };

  return (
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
            updateFilters({ category: e.target.value, page: 1 });
          }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {CATEGORIES?.map((cat) => (
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
            updateFilters({ status: e.target.value, page: 1 });
          }}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="available">Available</MenuItem>
          <MenuItem value="loi">LOI</MenuItem>
          <MenuItem value="sold">Sold</MenuItem>
        </Select>
      </FormControl>

      {/* Tags Filter */}
      <TagsSelect
        value={tag}
        onChange={(e) => {
          setTag(e.target.value);
          updateFilters({ tag: e.target.value, page: 1 });
        }}
      />

      {/* Country Filter */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Country</InputLabel>
        <Select
          value={country}
          label="Country"
          onChange={(e) => {
            setCountry(e.target.value);
            setState("");
            updateFilters({ country: e.target.value, state: "", page: 1 });
          }}
        >
          <MenuItem value="">All Countries</MenuItem>
          {COUNTRIES_LIST?.map((c) => (
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
            updateFilters({ state: e.target.value, page: 1 });
          }}
          sx={{ mb: 2 }}
        />
      )}

      {/* Range Filters */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
        Financial Ranges
      </Typography>
      <RangeFilterPopover
        label="Price"
        value={priceRange}
        onApply={(nextRange) => {
          setPriceRange(nextRange);
          updateFilters({ priceRange: nextRange, page: 1 });
        }}
        presets={PRICE_PRESETS}
        minLimit={PRICE_LIMITS[0]}
        maxLimit={PRICE_LIMITS[1]}
        step={100000}
        formatValue={formatCurrency}
      />
      <RangeFilterPopover
        label="Revenue"
        value={revenueRange}
        onApply={(nextRange) => {
          setRevenueRange(nextRange);
          updateFilters({ revenueRange: nextRange, page: 1 });
        }}
        presets={REVENUE_PRESETS}
        minLimit={REVENUE_LIMITS[0]}
        maxLimit={REVENUE_LIMITS[1]}
        step={500000}
        formatValue={formatCurrency}
      />
      <RangeFilterPopover
        label="Cashflow"
        value={cashflowRange}
        onApply={(nextRange) => {
          setCashflowRange(nextRange);
          updateFilters({ cashflowRange: nextRange, page: 1 });
        }}
        presets={CASHFLOW_PRESETS}
        minLimit={CASHFLOW_LIMITS[0]}
        maxLimit={CASHFLOW_LIMITS[1]}
        step={500000}
        formatValue={formatCurrency}
      />
      <RangeFilterPopover
        label="No. of Employees"
        value={employeeRange}
        onApply={(nextRange) => {
          setEmployeeRange(nextRange);
          updateFilters({ employeeRange: nextRange, page: 1 });
        }}
        presets={EMPLOYEE_PRESETS}
        minLimit={EMPLOYEE_LIMITS[0]}
        maxLimit={EMPLOYEE_LIMITS[1]}
        step={1}
        formatValue={(value) => String(value)}
        formatPresetValue={(value) => Number(value).toLocaleString("en-US")}
      />

      {/* Special Features */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
        Special Features
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={featured}
            onChange={(e) => {
              setFeatured(e.target.checked);
              updateFilters({ featured: e.target.checked, page: 1 });
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
              updateFilters({ sbaApproved: e.target.checked, page: 1 });
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
              updateFilters({ sellerFinancing: e.target.checked, page: 1 });
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
              updateFilters({ distressed: e.target.checked, page: 1 });
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
              updateFilters({ remote: e.target.checked, page: 1 });
            }}
          />
        }
        label="Remote Business"
        sx={{ display: "block" }}
      />
    </Paper>
  );
}
