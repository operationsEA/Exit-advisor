"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { FiMessageCircle, FiMinimize2, FiX } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import ChatConversationView from "./ChatConversationView";
import ChatListView from "./ChatListView";
import {
  createChat,
  getUserChats,
  markAsSeen,
  readMessages,
  sendMessage,
  subscribeToChatMessages,
  subscribeToUserChats,
} from "./chatClient";

function sortChats(chats) {
  return [...chats].sort((left, right) => {
    const rightTime = right.last_message_at || right.created_at;
    const leftTime = left.last_message_at || left.created_at;
    return new Date(rightTime) - new Date(leftTime);
  });
}

export default function ChatWidget({ listing, seller }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuth, isLoading: isAuthLoading } = useAuth();
  const fileInputRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("list");
  const [chats, setChats] = useState([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [widgetError, setWidgetError] = useState("");

  const handleRequireAuth = useCallback(() => {
    const next = pathname || "/business-for-sale";
    router.push(`/auth/login?next=${encodeURIComponent(next)}`);
  }, [pathname, router]);

  const fetchChats = useCallback(async () => {
    if (!user?.id) return;

    setChatsLoading(true);
    const result = await getUserChats();

    if (result?.success) {
      setChats(sortChats(result.data || []));
      setWidgetError("");
    } else if (result?.error) {
      setWidgetError(result.error);
    }

    setChatsLoading(false);
  }, [user?.id]);

  const loadMessages = useCallback(async (chatId) => {
    if (!chatId) return;

    setMessagesLoading(true);
    const result = await readMessages(chatId);

    if (result?.success) {
      setMessages(result.data || []);
      setWidgetError("");
      await markAsSeen(chatId);
    } else if (result?.error) {
      setWidgetError(result.error);
    }

    setMessagesLoading(false);
  }, []);

  const upsertChat = useCallback((chat) => {
    setChats((prev) => {
      const next = prev.filter((item) => item.id !== chat.id);
      return sortChats([chat, ...next]);
    });
  }, []);

  const openChatForListing = useCallback(
    async (presetMessage = "") => {
      if (isAuthLoading) return;
      if (!isAuth) {
        handleRequireAuth();
        return;
      }

      setIsOpen(true);

      if (!listing?.id || !seller?.id || seller.id === user?.id) {
        setView("list");
        fetchChats();
        if (presetMessage) {
          setDraft(presetMessage);
        }
        return;
      }

      setWidgetError("");
      const result = await createChat({
        listingId: listing.id,
        sellerId: seller.id,
      });

      if (!result?.success) {
        setWidgetError(result?.error || "Failed to open chat");
        setView("list");
        fetchChats();
        return;
      }

      upsertChat(result.data);
      setActiveChat(result.data);
      setView("chat");
      setDraft(presetMessage);
      await loadMessages(result.data.id);
      fetchChats();
    },
    [
      fetchChats,
      handleRequireAuth,
      isAuth,
      isAuthLoading,
      listing?.id,
      loadMessages,
      seller?.id,
      upsertChat,
      user?.id,
    ],
  );

  const handleSelectChat = useCallback(
    async (chat) => {
      setActiveChat(chat);
      setView("chat");
      setWidgetError("");
      await loadMessages(chat.id);
      fetchChats();
    },
    [fetchChats, loadMessages],
  );

  const handleSend = useCallback(async () => {
    if (!activeChat?.id || sending) return;

    setSending(true);
    const result = await sendMessage({
      chatId: activeChat.id,
      message: draft,
      attachments: pendingAttachments,
    });

    if (!result?.success) {
      setWidgetError(result?.error || "Failed to send message");
      setSending(false);
      return;
    }

    setMessages((prev) => [...prev, result.data]);
    setDraft("");
    setPendingAttachments([]);
    setWidgetError("");
    setSending(false);
    fetchChats();
  }, [activeChat?.id, draft, fetchChats, pendingAttachments, sending]);

  const handleAttachmentSelect = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    setPendingAttachments((prev) => [...prev, ...files]);
  };

  const handleRemoveAttachment = (index) => {
    setPendingAttachments((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  useEffect(() => {
    if (!isOpen || !user?.id) return;

    fetchChats();
    const unsubscribe = subscribeToUserChats(user.id, () => {
      fetchChats();
    });

    return unsubscribe;
  }, [fetchChats, isOpen, user?.id]);

  useEffect(() => {
    if (!isOpen || !activeChat?.id) return;

    const unsubscribe = subscribeToChatMessages(activeChat.id, async () => {
      await loadMessages(activeChat.id);
      fetchChats();
    });

    return unsubscribe;
  }, [activeChat?.id, fetchChats, isOpen, loadMessages]);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => openChatForListing("")}
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
            openChatForListing(
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

      {isOpen && (
        <Paper
          elevation={16}
          sx={{
            position: "fixed",
            right: { xs: 12, sm: 24 },
            bottom: { xs: 12, sm: 24 },
            width: { xs: "calc(100vw - 24px)", sm: 400 },
            height: { xs: "calc(100vh - 24px)", sm: 640 },
            zIndex: 1400,
            borderRadius: 4,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "1px solid #dbeafe",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
              background: "linear-gradient(135deg, #0884ff 0%, #0ea5e9 100%)",
              color: "#ffffff",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Badge color="error" variant="dot" overlap="circular">
                <FiMessageCircle size={18} />
              </Badge>
              <Box>
                <Typography sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                  Messages
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85 }}>
                  {view === "chat" && activeChat
                    ? activeChat.listing?.title || "Conversation"
                    : "Your conversations"}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {view === "chat" && (
                <IconButton
                  size="small"
                  onClick={() => setView("list")}
                  sx={{ color: "#ffffff" }}
                >
                  <FiMinimize2 size={16} />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
                sx={{ color: "#ffffff" }}
              >
                <FiX size={16} />
              </IconButton>
            </Box>
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleAttachmentSelect}
            style={{ display: "none" }}
          />

          <Box sx={{ flex: 1, p: 2, overflow: "hidden" }}>
            {view === "chat" && activeChat ? (
              <ChatConversationView
                chat={activeChat}
                currentUserId={user?.id}
                messages={messages}
                loading={messagesLoading}
                draft={draft}
                onDraftChange={setDraft}
                pendingAttachments={pendingAttachments}
                onOpenFilePicker={() => fileInputRef.current?.click()}
                onRemoveAttachment={handleRemoveAttachment}
                onSend={handleSend}
                onBack={() => setView("list")}
                sending={sending}
                error={widgetError}
              />
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {widgetError && (
                  <Typography
                    variant="caption"
                    sx={{ color: "#dc2626", mb: 1 }}
                  >
                    {widgetError}
                  </Typography>
                )}
                <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 1.5 }}>
                  Conversations
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                <Box sx={{ flex: 1, overflowY: "auto" }}>
                  <ChatListView
                    chats={chats}
                    currentUserId={user?.id}
                    loading={chatsLoading}
                    selectedChatId={activeChat?.id}
                    onSelectChat={handleSelectChat}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </>
  );
}
