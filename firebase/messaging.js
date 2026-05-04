"use client";

import { getToken, isSupported, onMessage } from "firebase/messaging";
import { getFirebaseApp } from "./config";

const DEFAULT_SW_PATH = "/firebase-messaging-sw.js";
const DEFAULT_TOKEN_KEY = "fcm_device_token";

let cachedSupportCheck;
let cachedMessaging;

function isBrowser() {
  return typeof window !== "undefined";
}

export async function isPushMessagingSupported() {
  if (!isBrowser()) return false;

  if (!cachedSupportCheck) {
    cachedSupportCheck = isSupported().catch(() => false);
  }

  return cachedSupportCheck;
}

export async function getMessagingInstance() {
  const supported = await isPushMessagingSupported();

  if (!supported) {
    throw new Error("Firebase messaging is not supported in this browser");
  }

  if (!cachedMessaging) {
    const { getMessaging } = await import("firebase/messaging");
    cachedMessaging = getMessaging(getFirebaseApp());
  }

  return cachedMessaging;
}

export async function registerMessagingServiceWorker(swPath = DEFAULT_SW_PATH) {
  if (!isBrowser() || !("serviceWorker" in navigator)) {
    return null;
  }

  return navigator.serviceWorker.register(swPath);
}

export async function requestNotificationPermission() {
  if (!isBrowser() || !("Notification" in window)) {
    return "unsupported";
  }

  return Notification.requestPermission();
}

export async function getOrCreatePushToken({
  vapidKey,
  serviceWorkerRegistration,
  tokenStorageKey = DEFAULT_TOKEN_KEY,
} = {}) {
  if (!vapidKey) {
    throw new Error(
      "Missing VAPID key. Pass vapidKey to getOrCreatePushToken().",
    );
  }

  const permission = await requestNotificationPermission();

  if (permission !== "granted") {
    return {
      success: false,
      error: "Notification permission was not granted",
      permission,
      token: null,
    };
  }

  const messaging = await getMessagingInstance();
  const registration =
    serviceWorkerRegistration || (await registerMessagingServiceWorker());

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration || undefined,
  });

  if (!token) {
    return {
      success: false,
      error: "No FCM token returned",
      permission,
      token: null,
    };
  }

  if (isBrowser() && tokenStorageKey) {
    window.localStorage.setItem(tokenStorageKey, token);
  }

  return {
    success: true,
    permission,
    token,
  };
}

export async function onForegroundMessage(callback) {
  if (typeof callback !== "function") {
    throw new Error(
      "onForegroundMessage(callback): callback must be a function",
    );
  }

  const messaging = await getMessagingInstance();

  return onMessage(messaging, (payload) => {
    callback(payload);
  });
}

export function readStoredPushToken(tokenStorageKey = DEFAULT_TOKEN_KEY) {
  if (!isBrowser() || !tokenStorageKey) {
    return null;
  }

  return window.localStorage.getItem(tokenStorageKey);
}

export function clearStoredPushToken(tokenStorageKey = DEFAULT_TOKEN_KEY) {
  if (!isBrowser() || !tokenStorageKey) {
    return;
  }

  window.localStorage.removeItem(tokenStorageKey);
}

export async function initializeWebPush({
  vapidKey,
  tokenStorageKey,
  onMessageReceived,
} = {}) {
  const supported = await isPushMessagingSupported();

  if (!supported) {
    return {
      success: false,
      supported: false,
      token: null,
      unsubscribe: null,
      error: "Push messaging is not supported",
    };
  }

  const registration = await registerMessagingServiceWorker();
  const tokenResult = await getOrCreatePushToken({
    vapidKey,
    serviceWorkerRegistration: registration,
    tokenStorageKey,
  });

  let unsubscribe = null;

  if (typeof onMessageReceived === "function") {
    unsubscribe = await onForegroundMessage(onMessageReceived);
  }

  return {
    ...tokenResult,
    supported: true,
    unsubscribe,
    registration,
  };
}
