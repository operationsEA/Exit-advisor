"use client";

import {
  Avatar,
  Badge,
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
          py: 5,
        }}
      >
        <CircularProgress size={26} sx={{ color: "#0ea5e9" }} />
      </Box>
    );
  }

  if (!chats.length) {
    return (
      <Paper
        elevation={0}
        sx={{
          py: 5,
          px: 3,
          textAlign: "center",
          background:
            "linear-gradient(145deg, rgba(239,246,255,0.95), rgba(248,250,252,0.95))",
          border: "1px dashed #b6cced",
          borderRadius: 3.5,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <Typography sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
          No conversations yet
        </Typography>
        <Typography variant="body2" sx={{ color: "#475569" }}>
          Start a chat from a listing page to message a seller instantly.
        </Typography>
      </Paper>
    );
  }

  return (
    <List
      disablePadding
      sx={{ display: "flex", flexDirection: "column", gap: 1.1 }}
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
              borderRadius: 1,
              border: isActive ? "1px solid #7dd3fc" : "1px solid #dbe5f2",
              background: isActive
                ? "linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)"
                : "rgba(255,255,255,0.88)",
              px: 1.35,
              py: 1.15,
              backdropFilter: "blur(6px)",
              boxShadow: isActive
                ? "0 12px 24px rgba(14,165,233,0.18)"
                : "0 4px 12px rgba(15,23,42,0.06)",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: isActive ? "#38bdf8" : "#bfdbfe",
                background: isActive
                  ? "linear-gradient(135deg, #e0f2fe 0%, #ecfeff 100%)"
                  : "#f8fafc",
                transform: "translateY(-1px)",
                boxShadow: "0 10px 22px rgba(15,23,42,0.10)",
              },
            }}
          >
            <Badge
              badgeContent={
                chat.unread_count > 0
                  ? chat.unread_count > 99
                    ? "99+"
                    : chat.unread_count
                  : 0
              }
              color="error"
              overlap="circular"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{
                mr: 1.35,
                "& .MuiBadge-badge": {
                  fontWeight: 700,
                  minWidth: 18,
                  height: 18,
                  fontSize: "0.65rem",
                  borderRadius: 9,
                  backgroundColor: "#ef4444",
                  border: "2px solid #fff",
                  boxShadow: "0 2px 6px rgba(239,68,68,0.5)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  fontWeight: 700,
                  bgcolor: "#0284c7",
                  border: "2px solid #e0f2fe",
                  boxShadow: "0 6px 18px rgba(2,132,199,0.25)",
                }}
              >
                {otherUser?.full_name?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
            </Badge>
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: "#0f172a",
                          lineHeight: 1.2,
                        }}
                      >
                        {otherUser?.full_name || "Unknown user"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#0ea5e9",
                          textTransform: "capitalize",
                          fontWeight: 600,
                        }}
                      >
                        {otherUser?.role || "user"}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#64748b",
                      whiteSpace: "nowrap",
                      fontWeight: 600,
                    }}
                  >
                    {formatTimestamp(chat.last_message_at || chat.created_at)}
                  </Typography>
                </Box>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#334155", fontWeight: 700, mb: 0.45 }}
                  >
                    {chat.listing?.title || "Listing conversation"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#475569",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 240,
                      fontWeight: 500,
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
