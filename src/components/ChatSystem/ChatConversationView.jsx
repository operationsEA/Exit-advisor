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
import {
  FiArrowLeft,
  FiDownload,
  FiPaperclip,
  FiSend,
  FiX,
} from "react-icons/fi";

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
  const scrollRef = useRef(null);
  const prevCountRef = useRef(0);

  async function downloadFile(url, fileName) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = fileName || "attachment";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, "_blank", "noreferrer");
    }
  }

  const otherUser = chat
    ? chat.buyer_id === currentUserId
      ? chat.seller
      : chat.buyer
    : null;

  // Reset on chat switch so next load snaps instantly.
  useEffect(() => {
    prevCountRef.current = 0;
  }, [chat?.id]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !messages.length) return;
    const isFirst = prevCountRef.current === 0;
    prevCountRef.current = messages.length;
    // Instant jump on first load, smooth scroll for new messages.
    el.scrollTop = isFirst ? el.scrollHeight : el.scrollHeight;
    if (!isFirst) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        background:
          "radial-gradient(circle at top, #f8fbff 0%, #f1f5f9 45%, #eef2ff 100%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.25,
          py: 1,
          borderBottom: "1px solid #dbe5f2",
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(8px)",
        }}
      >
        <IconButton
          size="small"
          onClick={onBack}
          sx={{ border: "1px solid #dbe5f2", backgroundColor: "#ffffff" }}
        >
          <FiArrowLeft size={16} />
        </IconButton>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: "#0884ff",
            boxShadow: "0 6px 18px rgba(8,132,255,0.35)",
          }}
        >
          {otherUser?.full_name?.charAt(0)?.toUpperCase() || "U"}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
            {otherUser?.full_name || "Conversation"}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#64748b", display: "block", lineHeight: 1.2 }}
          >
            {chat?.listing?.title || "Listing chat"}
          </Typography>
        </Box>
        <Chip
          size="small"
          label="Live"
          sx={{
            fontWeight: 700,
            backgroundColor: "#dcfce7",
            color: "#166534",
            border: "1px solid #86efac",
          }}
        />
      </Box>

      <Box ref={scrollRef} sx={{ flex: 1, overflowY: "auto", px: 1, py: 1.25 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress size={28} />
          </Box>
        ) : !messages.length ? (
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.9)",
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
          <Stack spacing={1}>
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
                      maxWidth: "85%",
                      px: 1.35,
                      py: 1,
                      borderRadius: isMine
                        ? "16px 16px 6px 16px"
                        : "16px 16px 16px 6px",
                      background: isMine
                        ? "linear-gradient(135deg, #0884ff 0%, #0ea5e9 100%)"
                        : "#ffffff",
                      color: isMine ? "#ffffff" : "#0f172a",
                      border: isMine ? "none" : "1px solid #dbe5f2",
                      boxShadow: isMine
                        ? "0 10px 20px rgba(14,165,233,0.28)"
                        : "0 6px 16px rgba(15,23,42,0.08)",
                    }}
                  >
                    {message.message && (
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          color: isMine ? "#ffffff" : "#0f172a",
                        }}
                      >
                        {message.message}
                      </Typography>
                    )}

                    {message.attachments?.length > 0 && (
                      <Stack spacing={1} sx={{ mt: message.message ? 1 : 0 }}>
                        {message.attachments.map((attachment) => (
                          <Box
                            key={attachment.id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              borderRadius: 2.5,
                              border: "1px solid",
                              borderColor: isMine
                                ? "rgba(255,255,255,0.35)"
                                : "#bfdbfe",
                              backgroundColor: isMine
                                ? "rgba(255,255,255,0.08)"
                                : "#eff6ff",
                              overflow: "hidden",
                            }}
                          >
                            <Button
                              component="a"
                              href={attachment.file_url}
                              target="_blank"
                              rel="noreferrer"
                              variant="text"
                              size="small"
                              sx={{
                                flex: 1,
                                justifyContent: "flex-start",
                                textTransform: "none",
                                borderRadius: 0,
                                color: isMine ? "#ffffff" : "#0f172a",
                                px: 1.25,
                                py: 0.75,
                                minWidth: 0,
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {attachment.file_name || "Attachment"}
                            </Button>
                            <IconButton
                              onClick={() =>
                                downloadFile(
                                  attachment.file_url,
                                  attachment.file_name,
                                )
                              }
                              size="small"
                              sx={{
                                color: isMine
                                  ? "rgba(255,255,255,0.85)"
                                  : "#0884ff",
                                borderRadius: 0,
                                px: 1,
                                py: 0.75,
                                borderLeft: "1px solid",
                                borderColor: isMine
                                  ? "rgba(255,255,255,0.2)"
                                  : "#bfdbfe",
                                "&:hover": {
                                  backgroundColor: isMine
                                    ? "rgba(255,255,255,0.15)"
                                    : "#dbeafe",
                                },
                              }}
                            >
                              <FiDownload size={13} />
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>
                    )}

                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        opacity: 0.78,
                        textAlign: "right",
                        fontSize: "0.525rem",
                      }}
                    >
                      {formatMessageTime(message.created_at)}
                    </Typography>
                  </Paper>
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>

      <Box
        sx={{
          p: 1,
          borderTop: "1px solid #dbe5f2",
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
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

        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end", pt: 1 }}>
          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            placeholder="Type your message..."
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSend();
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                padding: 1,
                backgroundColor: "#ffffff",
              },
            }}
          />
          <IconButton
            onClick={onOpenFilePicker}
            sx={{
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              borderRadius: 2.5,
            }}
          >
            <FiPaperclip size={18} />
          </IconButton>
          <IconButton
            onClick={onSend}
            disabled={sending}
            sx={{
              background: "linear-gradient(135deg, #0884ff 0%, #0ea5e9 100%)",
              color: "#ffffff",
              borderRadius: 2.5,
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
