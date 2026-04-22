"use client";

import { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { getAllUniqueTags } from "@/app/dashboard/listings/actions";

export default function TagsSelect({ value, onChange }) {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const result = await getAllUniqueTags();
        if (result.success && result.data) {
          setTags(result.data);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  return (
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
      <InputLabel>Tags</InputLabel>
      <Select value={value} label="Tags" onChange={onChange}>
        <MenuItem value="">All Tags</MenuItem>
        {tags.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
