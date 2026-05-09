"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toSafeNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatCurrencyPreset(value) {
  return `$${Number(value).toLocaleString("en-US")}`;
}

export default function RangeFilterPopover({
  label,
  value,
  onApply,
  presets = [],
  minLimit = 0,
  maxLimit = 100,
  step = 1,
  formatValue = (num) => String(num),
  formatPresetValue = formatCurrencyPreset,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [draftMin, setDraftMin] = useState(value[0]);
  const [draftMax, setDraftMax] = useState(value[1]);

  const isOpen = Boolean(anchorEl);

  const minPresetValues = useMemo(
    () => [...new Set(presets.map((preset) => preset.min))],
    [presets],
  );
  const maxPresetValues = useMemo(
    () => [...new Set(presets.map((preset) => preset.max))],
    [presets],
  );

  const summary = useMemo(() => {
    const [min, max] = value;
    if (min === minLimit && max === maxLimit) {
      return "Any";
    }
    return `${formatValue(min)} - ${formatValue(max)}`;
  }, [value, minLimit, maxLimit, formatValue]);

  const normalizeRange = (nextMin, nextMax) => {
    const min = clamp(toSafeNumber(nextMin, minLimit), minLimit, maxLimit);
    const max = clamp(toSafeNumber(nextMax, maxLimit), minLimit, maxLimit);

    if (min <= max) {
      return [min, max];
    }

    return [max, min];
  };

  const openPopover = (event) => {
    setDraftMin(value[0]);
    setDraftMax(value[1]);
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  const applyRange = () => {
    onApply(normalizeRange(draftMin, draftMax));
    closePopover();
  };

  const resetRange = () => {
    onApply([minLimit, maxLimit]);
    closePopover();
  };

  return (
    <>
      <Button
        variant="outlined"
        fullWidth
        onClick={openPopover}
        sx={{
          mb: 2,
          justifyContent: "space-between",
          textTransform: "none",
          borderColor: "#d1d5db",
          color: "#111827",
          fontWeight: 500,
          "&:hover": {
            borderColor: "#9ca3af",
            backgroundColor: "#f9fafb",
          },
        }}
      >
        <span>{label}</span>
        <span style={{ color: "#6b7280", fontSize: 12 }}>{summary}</span>
      </Button>

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              width: 340,
              p: 2,
              borderRadius: 2,
            },
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
          {label}
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
          <TextField
            type="number"
            label="Min"
            size="small"
            value={draftMin}
            onChange={(event) => setDraftMin(event.target.value)}
            inputProps={{ min: minLimit, max: maxLimit, step }}
            fullWidth
          />
          <TextField
            type="number"
            label="Max"
            size="small"
            value={draftMax}
            onChange={(event) => setDraftMax(event.target.value)}
            inputProps={{ min: minLimit, max: maxLimit, step }}
            fullWidth
          />
        </Stack>

        {presets.length > 0 && (
          <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: "#6b7280", mb: 0.5, display: "block" }}
              >
                Min options
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                {minPresetValues.map((minValue) => (
                  <Button
                    key={`min-${minValue}`}
                    size="small"
                    variant="text"
                    onClick={() => setDraftMin(minValue)}
                    sx={{
                      textTransform: "none",
                      justifyContent: "flex-start",
                      minHeight: 24,
                      py: 0.25,
                      px: 0,
                      fontSize: "0.8rem",
                      fontWeight: 500,
                    }}
                  >
                    {formatPresetValue(minValue)}
                  </Button>
                ))}
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: "#6b7280", mb: 0.5, display: "block" }}
              >
                Max options
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                {maxPresetValues.map((maxValue) => (
                  <Button
                    key={`max-${maxValue}`}
                    size="small"
                    variant="text"
                    onClick={() => setDraftMax(maxValue)}
                    sx={{
                      textTransform: "none",
                      justifyContent: "flex-start",
                      minHeight: 24,
                      py: 0.25,
                      px: 0,
                      fontSize: "0.8rem",
                      fontWeight: 500,
                    }}
                  >
                    {formatPresetValue(maxValue)}
                  </Button>
                ))}
              </Box>
            </Box>
          </Stack>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Button
            onClick={resetRange}
            size="small"
            sx={{ textTransform: "none" }}
          >
            Reset
          </Button>
          <Button
            onClick={applyRange}
            size="small"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Apply
          </Button>
        </Box>
      </Popover>
    </>
  );
}
