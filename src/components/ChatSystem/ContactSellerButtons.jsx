"use client";

import { Box, Button } from "@mui/material";

const OPEN_LISTING_CHAT_EVENT = "chat-widget:open-listing";

export default function ContactSellerButtons({ listing, seller }) {
  const dispatchOpenChat = (presetMessage = "") => {
    window.dispatchEvent(
      new CustomEvent(OPEN_LISTING_CHAT_EVENT, {
        detail: {
          listing,
          seller,
          presetMessage,
        },
      }),
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Button
        fullWidth
        variant="contained"
        onClick={() => dispatchOpenChat("")}
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
        onClick={() =>
          dispatchOpenChat(
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
