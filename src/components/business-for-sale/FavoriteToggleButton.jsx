"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toggleFavorite } from "@/app/business-for-sale/actions";
import { useAuth } from "@/contexts/AuthContext";

export default function FavoriteToggleButton({
  listingId,
  initialFavorited = false,
  onChange,
  size = "medium",
  sx = {},
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isFavorite, setIsFavorite] = useState(Boolean(initialFavorited));
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (isAuthLoading || isLoading) return;

    if (!user?.id) {
      const next = pathname || "/business-for-sale";
      router.push(`/auth/login?next=${encodeURIComponent(next)}`);
      return;
    }

    const previous = isFavorite;
    setIsFavorite(!previous);
    setIsLoading(true);

    try {
      const result = await toggleFavorite(listingId, user.id);

      if (!result?.success) {
        setIsFavorite(previous);
        return;
      }

      const finalValue = Boolean(result.favorited);
      setIsFavorite(finalValue);
      onChange?.(finalValue);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      setIsFavorite(previous);
    } finally {
      setIsLoading(false);
    }
  };

  const label = isFavorite ? "Remove from favorites" : "Add to favorites";

  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          size={size}
          onClick={handleToggle}
          disabled={isAuthLoading || isLoading}
          aria-label={isFavorite ? "Unfavorite listing" : "Favorite listing"}
          sx={{
            color: isFavorite ? "#ef4444" : "#6b7280",
            backgroundColor: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(229, 231, 235, 0.9)",
            "&:hover": {
              backgroundColor: "#ffffff",
              color: isFavorite ? "#dc2626" : "#111827",
            },
            ...sx,
          }}
        >
          {isLoading ? (
            <CircularProgress size={16} color="inherit" />
          ) : isFavorite ? (
            <FaHeart size={16} />
          ) : (
            <FaRegHeart size={16} />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
}
