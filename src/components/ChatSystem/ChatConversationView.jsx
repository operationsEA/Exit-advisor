"use client";

import { useEffect, useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FiArrowLeft, FiPaperclip, FiSend, FiX } from "react-icons/fi";

function formatMessageTime(value) {
  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ChatConversationView({
  chat,
  currentUserId,
  messages,
  loading,
  draft,
  onDraftChange,
  pendingAttachments,
  onOpenFilePicker,
  onRemoveAttachment,
  onSend,
  onBack,
  sending,
  error,
}) {
  const bottomRef = useRef(null);
  const otherUser = chat
    ? chat.buyer_id === currentUserId
      ? chat.seller
      : chat.buyer
    : null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 1.5,
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <IconButton size="small" onClick={onBack}>
          <FiArrowLeft size={16} />
        </IconButton>
        <Avatar sx={{ width: 40, height: 40, bgcolor: "#0884ff" }}>
          {otherUser?.full_name?.charAt(0)?.toUpperCase() || "U"}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
            {otherUser?.full_name || "Conversation"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            {chat?.listing?.title || "Listing chat"}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", py: 2, pr: 0.5 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : !messages.length ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "#f8fafc",
              border: "1px dashed #cbd5e1",
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>
              No messages yet
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Send the first message to start the conversation.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={1.5}>
            {messages.map((message) => {
              const isMine = message.sender_id === currentUserId;

              return (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    justifyContent: isMine ? "flex-end" : "flex-start",
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      maxWidth: "82%",
                      px: 1.5,
                      py: 1.25,
                      borderRadius: 3,
                      backgroundColor: isMine ? "#0884ff" : "#f1f5f9",
                      color: isMine ? "#ffffff" : "#0f172a",
                      border: isMine ? "none" : "1px solid #e2e8f0",
                    }}
                  >
                    {message.message && (
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                      >
                        {message.message}
                      </Typography>
                    )}

                    {message.attachments?.length > 0 && (
                      <Stack spacing={1} sx={{ mt: message.message ? 1 : 0 }}>
                        {message.attachments.map((attachment) => (
                          <Button
                            key={attachment.id}
                            href={attachment.file_url}
                            target="_blank"
                            rel="noreferrer"
                            variant="outlined"
                            sx={{
                              justifyContent: "flex-start",
                              textTransform: "none",
                              borderColor: isMine
                                ? "rgba(255,255,255,0.35)"
                                : "#cbd5e1",
                              color: isMine ? "#ffffff" : "#0f172a",
                            }}
                          >
                            {attachment.file_name || "Attachment"}
                          </Button>
                        ))}
                      </Stack>
                    )}

                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 0.75,
                        opacity: 0.8,
                        textAlign: "right",
                      }}
                    >
                      {formatMessageTime(message.created_at)}
                    </Typography>
                  </Paper>
                </Box>
              );
            })}
            <div ref={bottomRef} />
          </Stack>
        )}
      </Box>

      <Box sx={{ pt: 1.5, borderTop: "1px solid #e2e8f0" }}>
        {error && (
          <Typography
            variant="caption"
            sx={{ color: "#dc2626", display: "block", mb: 1 }}
          >
            {error}
          </Typography>
        )}

        {pendingAttachments.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={{ mb: 1.25 }}
          >
            {pendingAttachments.map((file, index) => (
              <Chip
                key={`${file.name}-${index}`}
                label={file.name}
                onDelete={() => onRemoveAttachment(index)}
                deleteIcon={<FiX size={14} />}
                sx={{ maxWidth: 220 }}
              />
            ))}
          </Stack>
        )}

        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={5}
            placeholder="Type your message..."
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
          />
          <IconButton
            onClick={onOpenFilePicker}
            sx={{ border: "1px solid #cbd5e1" }}
          >
            <FiPaperclip size={18} />
          </IconButton>
          <IconButton
            onClick={onSend}
            disabled={sending}
            sx={{
              backgroundColor: "#0884ff",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#0670d6" },
              "&.Mui-disabled": {
                backgroundColor: "#bfdbfe",
                color: "#ffffff",
              },
            }}
          >
            {sending ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <FiSend size={18} />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
