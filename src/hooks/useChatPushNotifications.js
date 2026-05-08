"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  clearStoredPushToken,
  initializeWebPush,
  isPushMessagingSupported,
  readStoredPushToken,
  requestNotificationPermission,
} from "../../firebase/messaging";
import {
  getUserPushTokenByDevice,
  setUserPushTokenActivityByDevice,
  syncUserPushTokenForDevice,
  updateUserPushTokenActivity,
} from "@/components/ChatSystem/chatClient";

const PUSH_SETTINGS_PREFIX = "chat_push_notifications_enabled";
const PUSH_PROMPT_PREFIX = "chat_push_notifications_prompted";
const PUSH_DEVICE_KEY_PREFIX = "chat_push_device_name";

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

function getStableDeviceName(userId) {
  if (typeof window === "undefined") return null;

  const key = userId
    ? `${PUSH_DEVICE_KEY_PREFIX}:${userId}`
    : PUSH_DEVICE_KEY_PREFIX;
  const existing = window.localStorage.getItem(key);

  if (existing) {
    return existing;
  }

  const platform = navigator?.platform || "unknown-platform";
  const language = navigator?.language || "unknown-language";
  const ua = navigator?.userAgent || "browser";
  const generated = `web-${platform}-${language}-${ua.slice(0, 80)}`.slice(
    0,
    200,
  );

  window.localStorage.setItem(key, generated);
  return generated;
}

export default function useChatPushNotifications({ isAuth, userId }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [pushSupported, setPushSupported] = useState(true);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushStatusText, setPushStatusText] = useState(
    "Checking notification support...",
  );

  const deviceNameRef = useRef(null);
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  const pushSettingsKey = useMemo(
    () => (userId ? `${PUSH_SETTINGS_PREFIX}:${userId}` : PUSH_SETTINGS_PREFIX),
    [userId],
  );

  const pushPromptedKey = useMemo(
    () => (userId ? `${PUSH_PROMPT_PREFIX}:${userId}` : PUSH_PROMPT_PREFIX),
    [userId],
  );

  const disablePush = useCallback(
    async (statusMessage = "Notifications are turned off") => {
      const currentToken = readStoredPushToken();
      if (currentToken) {
        await updateUserPushTokenActivity({
          token: currentToken,
          isActive: false,
        }).catch(() => null);
      }

      if (deviceNameRef.current) {
        await setUserPushTokenActivityByDevice({
          deviceName: deviceNameRef.current,
          isActive: false,
        }).catch(() => null);
      }

      clearStoredPushToken();
      setPushEnabled(false);
      writeBooleanSetting(pushSettingsKey, false);
      setPushStatusText(statusMessage);
    },
    [pushSettingsKey],
  );

  const enablePush = useCallback(
    async ({ skipPermissionPrompt = false } = {}) => {
      setPushBusy(true);

      try {
        const supported = await isPushMessagingSupported();

        if (!supported) {
          setPushSupported(false);
          await disablePush(
            "This browser does not support web push notifications",
          );
          return;
        }

        const permission = skipPermissionPrompt
          ? Notification.permission
          : await requestNotificationPermission();

        if (permission !== "granted") {
          await disablePush(
            "Notification permission is blocked or not granted",
          );
          return;
        }

        const result = await initializeWebPush({
          vapidKey,
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

          await disablePush(
            result.error || "Failed to initialize push notifications",
          );
          return;
        }

        if (result.token && deviceNameRef.current) {
          const syncResult = await syncUserPushTokenForDevice({
            token: result.token,
            deviceName: deviceNameRef.current,
          });

          if (!syncResult.success) {
            await disablePush(syncResult.error || "Failed to sync push token");
            return;
          }
        }

        setPushEnabled(true);
        writeBooleanSetting(pushSettingsKey, true);
        setPushStatusText("Notifications are on");
      } finally {
        setPushBusy(false);
      }
    },
    [disablePush, pushSettingsKey, vapidKey],
  );

  useEffect(() => {
    if (!isAuth || !userId) return;

    let isCancelled = false;
    deviceNameRef.current = getStableDeviceName(userId);

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

        const backendTokenResult = deviceNameRef.current
          ? await getUserPushTokenByDevice({
              deviceName: deviceNameRef.current,
            })
          : { success: true, data: null };

        if (!backendTokenResult.success) {
          if (!isCancelled) {
            setPushEnabled(false);
            setPushStatusText(
              backendTokenResult.error ||
                "Failed to read notification settings from server",
            );
          }
          return;
        }

        const backendEnabled =
          backendTokenResult.data == null
            ? true
            : Boolean(backendTokenResult.data.is_active);

        const isEnabled = readBooleanSetting(pushSettingsKey, backendEnabled);
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
              await disablePush(
                "Notification permission is blocked or not granted",
              );
            }
            return;
          }
        }

        if (isEnabled) {
          await enablePush({ skipPermissionPrompt: true });
        } else if (!isCancelled) {
          if (deviceNameRef.current) {
            await setUserPushTokenActivityByDevice({
              deviceName: deviceNameRef.current,
              isActive: false,
            });
          }
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
    };
  }, [
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

      await disablePush("Notifications are turned off");
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
