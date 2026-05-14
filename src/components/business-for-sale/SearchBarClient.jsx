"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField } from "@mui/material";
import { FiSearch } from "react-icons/fi";

/**
 * Client Component - Search Bar
 * Handles search input with URL sync
 */
export default function SearchBarClient({ initialSearch }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);

  const handleSearch = (value) => {
    setSearch(value);

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1");

    router.push(`/business-for-sale?${params.toString()}`);
  };

  return (
    <TextField
      fullWidth
      placeholder="Search by title, description..."
      value={search}
      onChange={(e) => handleSearch(e.target.value)}
      InputProps={{
        startAdornment: <FiSearch size={20} style={{ marginRight: 12 }} />,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: 48,
        },
      }}
    />
  );
}
