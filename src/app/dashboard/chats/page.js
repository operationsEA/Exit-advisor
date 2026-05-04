"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import AdminChatConversationView from "@/components/ChatComponents/ChatConversationView";
import AdminChatListView from "@/components/ChatComponents/ChatListView";
import {
  getAllChatsForAdmin,
  getUserChats,
  markAsSeen,
  readMessages,
  sendMessage,
  sendAdminMessage,
  subscribeToAdminChats,
  subscribeToChatMessages,
  subscribeToUserChats,
} from "@/components/ChatSystem/chatClient";

function sortChats(chats) {
  return [...chats].sort((left, right) => {
    const rightTime = right.last_message_at || right.created_at;
    const leftTime = left.last_message_at || left.created_at;
    return new Date(rightTime) - new Date(leftTime);
  });
}

function dedupeMessages(messages = []) {
  const uniqueById = new Map();

  for (const message of messages) {
    if (!message?.id) continue;

    // Keep the richer/latest shape when the same message arrives from
    // optimistic update + realtime/list refresh around the same time.
    uniqueById.set(message.id, {
      ...uniqueById.get(message.id),
      ...message,
    });
  }

  return Array.from(uniqueById.values()).sort(
    (left, right) => new Date(left.created_at) - new Date(right.created_at),
  );
}

export default function AdminChatsPage({
  initialChatId = "",
  initialPresetMessage = "",
}) {
  const router = useRouter();
  const { user, isAuth, isLoading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const fileInputRef = useRef(null);

  const [view, setView] = useState("list");
  const [chats, setChats] = useState([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [pageError, setPageError] = useState("");
  const [hasLoadedChatsOnce, setHasLoadedChatsOnce] = useState(false);
  const [hasLoadedMessagesOnce, setHasLoadedMessagesOnce] = useState(false);

  const initialChatHandledRef = useRef(false);

  const role = user?.user_metadata?.role || "buyer";
  const isAdmin = role === "admin";

  const fetchChats = useCallback(async () => {
    if (!hasLoadedChatsOnce) {
      setChatsLoading(true);
    }

    const result = isAdmin ? await getAllChatsForAdmin() : await getUserChats();

    if (result?.success) {
      const ordered = sortChats(result.data || []);
      setChats(ordered);
      setPageError("");

      setActiveChat((prev) => {
        if (!prev?.id) return prev;
        return ordered.find((item) => item.id === prev.id) || null;
      });
      setMessages((prev) => prev);
    } else if (result?.error) {
      setPageError(result.error);
    }

    setChatsLoading(false);
    if (!hasLoadedChatsOnce) {
      setHasLoadedChatsOnce(true);
    }
  }, [hasLoadedChatsOnce, isAdmin]);

  const loadMessages = useCallback(
    async (chat) => {
      if (!chat?.id) return;

      if (chat.all_messages?.length) {
        setMessages(dedupeMessages(chat.all_messages));
      }

      if (!hasLoadedMessagesOnce) {
        setMessagesLoading(true);
      }
      const result = await readMessages(chat.id);

      if (result?.success) {
        setMessages(dedupeMessages(result.data || []));
        setPageError("");

        if (!isAdmin && chat.unread_count > 0) {
          await markAsSeen(chat.id);
          loadMessages(chat);
        }
      } else if (result?.error) {
        setPageError(result.error);
      }

      setMessagesLoading(false);
      if (!hasLoadedMessagesOnce) {
        setHasLoadedMessagesOnce(true);
      }
    },
    [hasLoadedMessagesOnce, isAdmin],
  );

  const handleSelectChat = useCallback(
    async (chat) => {
      setActiveChat(chat);
      setDraft("");
      setPendingAttachments([]);

      if (chat?.id) {
        router.replace(`/dashboard/chats/${chat.id}`);
      }

      if (isMobile) {
        setView("chat");
      }
      await loadMessages(chat);
    },
    [isMobile, loadMessages, router],
  );

  const handleBackToList = useCallback(() => {
    setView("list");
    router.replace("/dashboard/chats");
  }, [router]);

  const handleSend = useCallback(async () => {
    if (!activeChat?.id || sending) return;

    setSending(true);
    const result = isAdmin
      ? await sendAdminMessage({
          chatId: activeChat.id,
          message: draft,
          attachments: pendingAttachments,
        })
      : await sendMessage({
          chatId: activeChat.id,
          message: draft,
          attachments: pendingAttachments,
        });

    if (!result?.success) {
      setPageError(result?.error || "Failed to send message");
      setSending(false);
      return;
    }

    setMessages((prev) => dedupeMessages([...prev, result.data]));
    setDraft("");
    setPendingAttachments([]);
    setPageError("");
    setSending(false);
    fetchChats();
  }, [activeChat?.id, draft, fetchChats, isAdmin, pendingAttachments, sending]);

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
    if (!isAuth || !user?.id) return;

    fetchChats();
    const unsubscribe = isAdmin
      ? subscribeToAdminChats(() => {
          fetchChats();
        })
      : subscribeToUserChats(user.id, () => {
          fetchChats();
        });

    return unsubscribe;
  }, [fetchChats, isAdmin, isAuth, user?.id]);

  useEffect(() => {
    if (!activeChat?.id || !isAuth) return;

    const unsubscribe = subscribeToChatMessages(activeChat.id, async () => {
      await loadMessages(activeChat);
      fetchChats();
    });

    return unsubscribe;
  }, [activeChat, fetchChats, isAuth, loadMessages]);

  useEffect(() => {
    if (!initialChatId) {
      initialChatHandledRef.current = true;
      return;
    }

    initialChatHandledRef.current = false;
  }, [initialChatId]);

  useEffect(() => {
    if (!initialChatId || initialChatHandledRef.current || !chats.length) {
      return;
    }

    const matchedChat = chats.find(
      (chat) => String(chat.id) === String(initialChatId),
    );

    if (!matchedChat) return;

    initialChatHandledRef.current = true;
    setActiveChat(matchedChat);

    if (isMobile) {
      setView("chat");
    }

    if (initialPresetMessage) {
      setDraft(initialPresetMessage);
    }

    loadMessages(matchedChat);
  }, [chats, initialChatId, initialPresetMessage, isMobile, loadMessages]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (!isAuth) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
        }}
      >
        <Typography sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
          Sign In Required
        </Typography>
        <Typography variant="body2" sx={{ color: "#475569" }}>
          Please sign in to view your chats.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box
      sx={{ height: { xs: "calc(100vh - 170px)", md: "calc(100vh - 100px)" } }}
    >
      {pageError && (
        <Alert severity="error" sx={{ mb: 1.5 }}>
          {pageError}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: 3,
          border: "1px solid #dbe5f2",
          backgroundColor: "rgba(255,255,255,0.85)",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {(!isMobile || view === "list") && (
          <Box
            sx={{
              width: { xs: "100%", md: 360 },
              minWidth: { md: 360 },
              borderRight: { md: "1px solid #dbe5f2" },
              p: 1,
              overflowY: "auto",
              background:
                "linear-gradient(165deg, rgba(248,250,252,0.9), rgba(239,246,255,0.9))",
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                mb: 1,
                px: 0.4,
              }}
            >
              {isAdmin ? "Admin Chats" : "Your Chats"}
            </Typography>

            <AdminChatListView
              chats={chats}
              loading={chatsLoading}
              currentUserId={user?.id}
              selectedChatId={activeChat?.id}
              viewerRole={role}
              onSelectChat={handleSelectChat}
            />
          </Box>
        )}

        {(!isMobile || view === "chat") && (
          <Box sx={{ flex: 1, minWidth: 0, p: 1 }}>
            {activeChat ? (
              <AdminChatConversationView
                chat={activeChat}
                currentUserId={user?.id}
                viewerRole={role}
                messages={messages}
                loading={messagesLoading}
                draft={draft}
                onDraftChange={setDraft}
                pendingAttachments={pendingAttachments}
                onOpenFilePicker={() => fileInputRef.current?.click()}
                onRemoveAttachment={handleRemoveAttachment}
                onSend={handleSend}
                onBack={handleBackToList}
                sending={sending}
                error={pageError}
                canGoBack={isMobile}
              />
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "#64748b", fontWeight: 600 }}>
                  Select a chat from the list to view messages.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        onChange={handleAttachmentSelect}
      />
    </Box>
  );
}
