"use client";

import { useState } from "react";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import { FiCopy, FiCheck } from "react-icons/fi";

export default function ExternalLinkItem({ text, link }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy external link", error);
    }
  };

  return (
    <Box
      onClick={handleCopy}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1.5,
        backgroundColor: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: 1,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "#dbeafe",
          borderColor: "#93c5fd",
        },
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            color: "#1d4ed8",
            fontWeight: 600,
            fontSize: "0.95rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "#6b7280",
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {link}
        </Typography>
      </Box>
      <Tooltip title={copied ? "Copied" : "Copy link"}>
        <IconButton
          size="small"
          sx={{
            ml: 1,
            color: copied ? "#059669" : "#1d4ed8",
            "&:hover": {
              backgroundColor: "rgba(29, 78, 216, 0.1)",
            },
          }}
          onClick={(event) => {
            event.stopPropagation();
            handleCopy();
          }}
        >
          {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
