"use client";

import { useState } from "react";
import { Typography, Button, Box } from "@mui/material";

export default function DescriptionToggle({ description }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxChars = 400;
  const isTruncated = description.length > maxChars;
  const displayText = isExpanded
    ? description
    : description.substring(0, maxChars);

  return (
    <Box>
      <Typography
        sx={{
          lineHeight: 1.8,
          color: "#4b5563",
          whiteSpace: "pre-wrap",
          mb: 1.5,
        }}
      >
        {displayText}
        {isTruncated && !isExpanded ? "..." : ""}
      </Typography>
      {isTruncated && (
        <Button
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{
            textTransform: "none",
            color: "#0884ff",
            padding: 0,
            minWidth: "auto",
            "&:hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
            },
          }}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
      )}
    </Box>
  );
}
