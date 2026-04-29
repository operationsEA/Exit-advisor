"use client";

import {
  Avatar,
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

function formatTimestamp(value) {
  if (!value) return "";

  const date = new Date(value);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  return isToday
    ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString();
}

export default function ChatListView({
  chats,
  currentUserId,
  loading,
  selectedChatId,
  onSelectChat,
}) {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
        }}
      >
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (!chats.length) {
    return (
      <Paper
        elevation={0}
        sx={{
          py: 6,
          px: 3,
          textAlign: "center",
          backgroundColor: "#f8fafc",
          border: "1px dashed #cbd5e1",
          borderRadius: 3,
        }}
      >
        <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>
          No conversations yet
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          Start a chat from a listing page to message a seller instantly.
        </Typography>
      </Paper>
    );
  }

  return (
    <List
      disablePadding
      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
    >
      {chats.map((chat) => {
        const otherUser =
          chat.buyer_id === currentUserId ? chat.seller : chat.buyer;
        const isActive = chat.id === selectedChatId;

        return (
          <ListItemButton
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            sx={{
              alignItems: "flex-start",
              borderRadius: 3,
              border: isActive ? "1px solid #93c5fd" : "1px solid #e2e8f0",
              backgroundColor: isActive ? "#eff6ff" : "#ffffff",
              px: 1.5,
              py: 1.25,
            }}
          >
            <Avatar sx={{ width: 40, height: 40, mr: 1.5, bgcolor: "#0884ff" }}>
              {otherUser?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1,
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#0f172a",
                        lineHeight: 1.2,
                      }}
                    >
                      {otherUser?.full_name || "Unknown user"}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#0284c7", textTransform: "capitalize" }}
                    >
                      {otherUser?.role || "user"}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "#94a3b8", whiteSpace: "nowrap" }}
                  >
                    {formatTimestamp(chat.last_message_at || chat.created_at)}
                  </Typography>
                </Box>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#334155", fontWeight: 600, mb: 0.5 }}
                  >
                    {chat.listing?.title || "Listing conversation"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#64748b",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 240,
                    }}
                  >
                    {chat.last_message?.message ||
                      (chat.last_message?.message_type === "attachment"
                        ? "Attachment sent"
                        : "No messages yet")}
                  </Typography>
                </Box>
              }
            />
          </ListItemButton>
        );
      })}
    </List>
  );
}
