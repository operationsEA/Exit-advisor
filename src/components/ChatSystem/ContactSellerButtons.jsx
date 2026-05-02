"use client";

import { useState } from "react";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createChat } from "@/components/ChatSystem/chatClient";

export default function ContactSellerButtons({ listing, seller }) {
  const router = useRouter();
  const { isAuth, isLoading } = useAuth();
  const [opening, setOpening] = useState(false);

  const openChatInDashboard = async (presetMessage = "") => {
    if (isLoading || opening) return;

    if (!isAuth) {
      router.push(`/auth/login?next=${encodeURIComponent("/dashboard/chats")}`);
      return;
    }

    if (!listing?.id || !seller?.id) return;

    setOpening(true);
    const result = await createChat({
      listingId: listing.id,
      sellerId: seller.id,
    });

    if (!result?.success || !result?.data?.id) {
      setOpening(false);
      return;
    }

    const query = presetMessage
      ? `?preset=${encodeURIComponent(presetMessage)}`
      : "";

    router.push(`/dashboard/chats/${result.data.id}${query}`);
    setOpening(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Button
        fullWidth
        variant="contained"
        onClick={() => openChatInDashboard("")}
        disabled={opening || isLoading}
        sx={{
          backgroundColor: "#0884ff",
          textTransform: "none",
          mb: 1,
        }}
      >
        Contact Seller
      </Button>
      <Button
        fullWidth
        variant="outlined"
        disabled={opening || isLoading}
        onClick={() =>
          openChatInDashboard(
            `Hi, I would like more information about ${listing?.title || "this listing"}.`,
          )
        }
        sx={{
          borderColor: "#0884ff",
          color: "#0884ff",
          textTransform: "none",
        }}
      >
        Request More Info
      </Button>
    </Box>
  );
}
