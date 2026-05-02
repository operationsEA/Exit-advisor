"use client";

import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  LinearProgress,
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

function formatRole(value) {
  if (!value) return "Buyer";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getOtherUser(chat, currentUserId) {
  return chat.buyer_id === currentUserId ? chat.seller : chat.buyer;
}

function getLastMessagePrefix(chat) {
  const message = chat.last_message;
  if (!message) return "";
  if (message.is_admin) return "Admin: ";
  if (message.sender_id === chat.buyer_id) {
    return `${chat?.buyer?.full_name || "Buyer"}: `;
  }
  if (message.sender_id === chat.seller_id) {
    return `${chat?.seller?.full_name || "Seller"}: `;
  }
  return message?.sender?.full_name ? `${message.sender.full_name}: ` : "";
}

export default function AdminChatListView({
  chats,
  loading,
  currentUserId,
  selectedChatId,
  viewerRole,
  onSelectChat,
}) {
  const isAdmin = viewerRole === "admin";

  // if (loading) {
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         py: 5,
  //       }}
  //     >
  //       <CircularProgress size={26} sx={{ color: "#0ea5e9" }} />
  //     </Box>
  //   );
  // }

  if (!chats.length && !loading) {
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
        }}
      >
        <Typography sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
          No chats available
        </Typography>
        <Typography variant="body2" sx={{ color: "#475569" }}>
          All buyer and seller conversations will appear here.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Box sx={{ my: 2, height: 2 }}>{loading && <LinearProgress />}</Box>

      <List
        disablePadding
        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
      >
        {chats.map((chat) => {
          const isActive = chat.id === selectedChatId;
          const otherUser = getOtherUser(chat, currentUserId);
          const badgeContent =
            chat.unread_count > 99 ? "99+" : chat.unread_count;

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
                px: 1.25,
                py: 1,
                boxShadow: isActive
                  ? "0 10px 22px rgba(14,165,233,0.18)"
                  : "0 4px 12px rgba(15,23,42,0.06)",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: isActive ? "#38bdf8" : "#bfdbfe",
                  background: isActive
                    ? "linear-gradient(135deg, #e0f2fe 0%, #ecfeff 100%)"
                    : "#f8fafc",
                },
              }}
            >
              <Badge
                badgeContent={chat.unread_count > 0 ? badgeContent : 0}
                color="error"
                overlap="circular"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                sx={{
                  mr: 1.1,
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
                    width: 40,
                    height: 40,
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    bgcolor: isAdmin ? "#0284c7" : "#0ea5e9",
                    border: "2px solid #e0f2fe",
                  }}
                >
                  {(isAdmin
                    ? chat?.listing?.title?.charAt(0)
                    : otherUser?.full_name?.charAt(0)
                  )?.toUpperCase() || "C"}
                </Avatar>
              </Badge>

              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#0f172a",
                        lineHeight: 1.2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 230,
                      }}
                    >
                      {isAdmin
                        ? chat?.listing?.title || "Listing conversation"
                        : otherUser?.full_name || "Conversation"}
                    </Typography>

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
                  <Box sx={{ mt: 0.45 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        fontWeight: 600,
                        color: "#0369a1",
                        textTransform: "capitalize",
                        mb: 0.2,
                      }}
                    >
                      {isAdmin
                        ? `Buyer: ${chat?.buyer?.full_name || "Unknown"} | Seller: ${chat?.seller?.full_name || "Unknown"}`
                        : `${formatRole(otherUser?.role)} | ${chat?.listing?.title || "Listing conversation"}`}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: "#475569",
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 320,
                      }}
                    >
                      {`${getLastMessagePrefix(chat)}${
                        chat.last_message?.message ||
                        (chat.last_message?.message_type === "attachment"
                          ? "Attachment sent"
                          : "No messages yet")
                      }`}
                    </Typography>
                  </Box>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
    </>
  );
}
