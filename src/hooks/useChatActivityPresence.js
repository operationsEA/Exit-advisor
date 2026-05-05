"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  getUserActiveChat,
  updateUserChatActivity,
} from "@/components/ChatSystem/chatClient";

const HEARTBEAT_MS = 45000;
const CHAT_ROUTE_PREFIX = "/dashboard/chats";
const LOG_PREFIX = "[chat-presence]";

export default function useChatActivityPresence({
  isAuth,
  userId,
  activeChatId,
}) {
  const pathname = usePathname();
  const activeChatIdRef = useRef(activeChatId || null);
  const lastSyncRef = useRef(null);

  const log = useCallback((message, data) => {
    if (data !== undefined) {
      console.log(`${LOG_PREFIX} ${message}`, data);
      return;
    }

    console.log(`${LOG_PREFIX} ${message}`);
  }, []);

  useEffect(() => {
    activeChatIdRef.current = activeChatId || null;
  }, [activeChatId]);

  const syncActivity = useCallback(
    async ({ chatId, isActive, force = false, reason = "unknown" }) => {
      if (!isAuth || !userId) return;

      const signature = `${chatId || "none"}:${isActive ? "1" : "0"}`;
      if (!force && lastSyncRef.current === signature) {
        log("sync skipped (same state)", { chatId, isActive, reason });
        return;
      }

      if (chatId) {
        const result = await updateUserChatActivity({ chatId, isActive });

        if (result?.success) {
          lastSyncRef.current = signature;
          log("chat activity synced", { chatId, isActive, reason });
        } else {
          log("failed to sync chat activity", {
            chatId,
            isActive,
            reason,
            error: result?.error || "unknown",
          });
        }
        return;
      }

      const activeResult = await getUserActiveChat();
      if (!activeResult?.success || !activeResult.data?.chat_id) {
        lastSyncRef.current = signature;
        log("no active chat found to deactivate", { reason });
        return;
      }

      const result = await updateUserChatActivity({
        chatId: activeResult.data.chat_id,
        isActive: false,
      });

      if (result?.success) {
        lastSyncRef.current = signature;
        log("active chat deactivated", {
          chatId: activeResult.data.chat_id,
          reason,
        });
      } else {
        log("failed to deactivate active chat", {
          chatId: activeResult.data.chat_id,
          reason,
          error: result?.error || "unknown",
        });
      }
    },
    [isAuth, log, userId],
  );

  const syncFromWindowState = useCallback(
    async ({ force = false, reason = "window-state" } = {}) => {
      const chatId = activeChatIdRef.current;

      if (!chatId) {
        await syncActivity({
          chatId: null,
          isActive: false,
          force,
          reason,
        });
        return;
      }

      const isActive =
        typeof document !== "undefined" &&
        !document.hidden &&
        document.hasFocus();

      await syncActivity({ chatId, isActive, force, reason });
    },
    [syncActivity],
  );

  useEffect(() => {
    if (!isAuth || !userId) return;

    syncFromWindowState({ force: true, reason: "active-chat-changed" });
  }, [activeChatId, isAuth, syncFromWindowState, userId]);

  useEffect(() => {
    if (!isAuth || !userId) return;

    if (!pathname?.startsWith(CHAT_ROUTE_PREFIX)) {
      const chatId = activeChatIdRef.current;
      syncActivity({
        chatId,
        isActive: false,
        force: true,
        reason: "route-left-chat-module",
      });
    }
  }, [isAuth, pathname, syncActivity, userId]);

  useEffect(() => {
    if (!isAuth || !userId) return;

    const intervalId = window.setInterval(() => {
      const chatId = activeChatIdRef.current;
      const isFocused =
        typeof document !== "undefined" &&
        !document.hidden &&
        document.hasFocus();

      if (!chatId || !isFocused) {
        return;
      }

      syncFromWindowState({ force: true, reason: "heartbeat" });
    }, HEARTBEAT_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAuth, syncFromWindowState, userId]);

  useEffect(() => {
    if (!isAuth || !userId) return;

    const handleVisibilityChange = () => {
      syncFromWindowState({ reason: "visibilitychange" });
    };

    const handleFocus = () => {
      syncFromWindowState({ reason: "focus" });
    };

    const handleBlur = () => {
      syncFromWindowState({ reason: "blur" });
    };

    const handlePageHide = () => {
      const chatId = activeChatIdRef.current;
      syncActivity({
        chatId,
        isActive: false,
        force: true,
        reason: "pagehide-or-unload",
      });
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);

    return () => {
      const chatId = activeChatIdRef.current;
      syncActivity({
        chatId,
        isActive: false,
        force: true,
        reason: "hook-unmount",
      });

      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
    };
  }, [isAuth, syncActivity, syncFromWindowState, userId]);
}
