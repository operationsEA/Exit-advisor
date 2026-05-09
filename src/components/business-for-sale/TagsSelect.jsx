"use client";

import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import BUSINESS_TAG_OPTIONS from "@/data/businessTags";

export default function TagsSelect({ value, onChange }) {
  return (
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
      <InputLabel>Tags</InputLabel>
      <Select value={value} label="Tags" onChange={onChange}>
        <MenuItem value="">All Tags</MenuItem>
        {BUSINESS_TAG_OPTIONS.map((tag) => (
          <MenuItem key={tag.value} value={tag.value}>
            {tag.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
