"use client";

import { useState } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { FiCopy, FiCheck } from "react-icons/fi";

export default function CopyableId({ formatted, original }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(original);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = original;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Box sx={{ pb: 1.5 }}>
      <Typography variant="caption" sx={{ fontWeight: 600, color: "#6b7280" }}>
        Listing ID
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
        <Typography
          sx={{
            fontWeight: 700,
            color: "#0884ff",
            fontSize: "0.9rem",
            letterSpacing: 0.5,
          }}
        >
          {formatted}
        </Typography>
        <Tooltip title={copied ? "Copied!" : "Copy full ID"} placement="top">
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={{
              p: 0.25,
              color: copied ? "#059669" : "#9ca3af",
              "&:hover": { color: copied ? "#059669" : "#0884ff" },
              transition: "color 0.2s",
            }}
          >
            {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
