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
            backgroundColor: "#0D1321",
            fontSize: "1rem",
            height: 52,
            borderRadius: "12px",
            border: "1px solid #2A3447",
            "&:hover": {
              borderColor: "#D4A537",
            },
            "&.Mui-focused": {
              borderColor: "#D4A537",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FiSearch size={20} style={{ color: "#8B95A8" }} />
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        sx={{
          background: "linear-gradient(135deg, #F0C24B 0%, #D4A030 100%)",
          color: "#0A0F1C",
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 700,
          padding: "0 32px",
          whiteSpace: "nowrap",
          borderRadius: "100px",
          height: 52,
          boxShadow: "0 4px 16px rgba(212,165,55,0.25)",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(212,165,55,0.35)",
          },
        }}
      >
        Search
      </Button>
    </Box>
  );
}
