"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  clearStoredPushToken,
  initializeWebPush,
  isPushMessagingSupported,
  requestNotificationPermission,
} from "../../firebase/messaging";
import { showLocalNotification } from "../../firebase/triggers";

const PUSH_SETTINGS_PREFIX = "chat_push_notifications_enabled";
const PUSH_PROMPT_PREFIX = "chat_push_notifications_prompted";

function readBooleanSetting(key, fallback = true) {
  if (typeof window === "undefined") return fallback;
  const value = window.localStorage.getItem(key);
  if (value === null) return fallback;
  return value === "true";
}

function writeBooleanSetting(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, String(Boolean(value)));
}

export default function useChatPushNotifications({ isAuth, userId }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [pushSupported, setPushSupported] = useState(true);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushStatusText, setPushStatusText] = useState(
    "Checking notification support...",
  );

  const pushUnsubscribeRef = useRef(null);
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  const pushSettingsKey = useMemo(
    () => (userId ? `${PUSH_SETTINGS_PREFIX}:${userId}` : PUSH_SETTINGS_PREFIX),
    [userId],
  );

  const pushPromptedKey = useMemo(
    () => (userId ? `${PUSH_PROMPT_PREFIX}:${userId}` : PUSH_PROMPT_PREFIX),
    [userId],
  );

  const cleanupPushListener = useCallback(() => {
    if (typeof pushUnsubscribeRef.current === "function") {
      pushUnsubscribeRef.current();
    }

    pushUnsubscribeRef.current = null;
  }, []);

  const disablePush = useCallback(
    (statusMessage = "Notifications are turned off") => {
      cleanupPushListener();
      clearStoredPushToken();
      setPushEnabled(false);
      writeBooleanSetting(pushSettingsKey, false);
      setPushStatusText(statusMessage);
    },
    [cleanupPushListener, pushSettingsKey],
  );

  const enablePush = useCallback(
    async ({ skipPermissionPrompt = false } = {}) => {
      setPushBusy(true);

      try {
        const supported = await isPushMessagingSupported();

        if (!supported) {
          setPushSupported(false);
          disablePush("This browser does not support web push notifications");
          return;
        }

        const permission = skipPermissionPrompt
          ? Notification.permission
          : await requestNotificationPermission();

        if (permission !== "granted") {
          disablePush("Notification permission is blocked or not granted");
          return;
        }

        cleanupPushListener();

        const result = await initializeWebPush({
          vapidKey,
          onMessageReceived: (payload) => {
            const title = payload?.notification?.title || "New Message";
            const body =
              payload?.notification?.body ||
              payload?.data?.body ||
              "You have a new update.";

            showLocalNotification({
              title,
              body,
              data: payload?.data || {},
            });
          },
        });

        if (!result.success) {
          if (!vapidKey) {
            setPushStatusText(
              "Permission granted. Add NEXT_PUBLIC_FIREBASE_VAPID_KEY to activate device tokens.",
            );
            setPushEnabled(true);
            writeBooleanSetting(pushSettingsKey, true);
            return;
          }

          disablePush(
            result.error || "Failed to initialize push notifications",
          );
          return;
        }

        pushUnsubscribeRef.current = result.unsubscribe || null;
        setPushEnabled(true);
        writeBooleanSetting(pushSettingsKey, true);
        setPushStatusText("Notifications are on");
      } finally {
        setPushBusy(false);
      }
    },
    [cleanupPushListener, disablePush, pushSettingsKey, vapidKey],
  );

  useEffect(() => {
    if (!isAuth || !userId) return;

    let isCancelled = false;

    const setupPushPreference = async () => {
      setPushBusy(true);

      try {
        const supported = await isPushMessagingSupported();

        if (!supported) {
          if (!isCancelled) {
            setPushSupported(false);
            setPushEnabled(false);
            setPushStatusText(
              "This browser does not support web push notifications",
            );
          }
          return;
        }

        if (isCancelled) return;

        setPushSupported(true);

        const isEnabled = readBooleanSetting(pushSettingsKey, true);
        setPushEnabled(isEnabled);

        const alreadyPrompted =
          typeof window !== "undefined" &&
          window.localStorage.getItem(pushPromptedKey) === "true";

        if (!alreadyPrompted) {
          const permission = await requestNotificationPermission();

          if (typeof window !== "undefined") {
            window.localStorage.setItem(pushPromptedKey, "true");
          }

          if (permission !== "granted") {
            if (!isCancelled) {
              disablePush("Notification permission is blocked or not granted");
            }
            return;
          }
        }

        if (isEnabled) {
          await enablePush({ skipPermissionPrompt: true });
        } else if (!isCancelled) {
          setPushStatusText("Notifications are turned off");
        }
      } finally {
        if (!isCancelled) {
          setPushBusy(false);
        }
      }
    };

    setupPushPreference();

    return () => {
      isCancelled = true;
      cleanupPushListener();
    };
  }, [
    cleanupPushListener,
    disablePush,
    enablePush,
    isAuth,
    pushPromptedKey,
    pushSettingsKey,
    userId,
  ]);

  const handleTogglePush = useCallback(
    async (event) => {
      const enabled = event.target.checked;

      if (enabled) {
        await enablePush();
        return;
      }

      disablePush("Notifications are turned off");
    },
    [disablePush, enablePush],
  );

  return {
    pushEnabled,
    pushSupported,
    pushBusy,
    pushStatusText,
    handleTogglePush,
  };
}
