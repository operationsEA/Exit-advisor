"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, InputAdornment, Box } from "@mui/material";
import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/business-for-sale?search=${encodeURIComponent(searchQuery)}`,
      );
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{
        display: "flex",
        gap: 1,
        maxWidth: "600px",
        mx: "auto",
        mb: 8,
      }}
    >
      <TextField
        fullWidth
        placeholder="Search businesses..."
        value={searchQuery}
        onChange={handleSearchChange}
        size="medium"
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            fontSize: "1rem",
            height: 48,
            borderRadius: "8px",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FiSearch size={20} style={{ color: "#6b7280" }} />
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        sx={{
          backgroundColor: "#0884ff",
          color: "white",
          textTransform: "none",
          fontSize: "1rem",
          padding: "0 28px",
          whiteSpace: "nowrap",
          "&:hover": { backgroundColor: "#0670d6" },
        }}
      >
        Search
      </Button>
    </Box>
  );
}
