"use client";

const PUSH_EVENT_NAME = "app:push-notification";

export function createPushPayload({
  title,
  body,
  icon,
  image,
  data,
  actions,
  tag,
  requireInteraction = false,
  silent = false,
} = {}) {
  return {
    title: title || "Notification",
    body: body || "",
    icon,
    image,
    data: data || {},
    actions: actions || [],
    tag,
    requireInteraction,
    silent,
  };
}

export function emitPushTrigger(payload) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(PUSH_EVENT_NAME, {
      detail: payload,
    }),
  );
}

export function onPushTrigger(handler) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const listener = (event) => {
    handler?.(event?.detail || null);
  };

  window.addEventListener(PUSH_EVENT_NAME, listener);

  return () => {
    window.removeEventListener(PUSH_EVENT_NAME, listener);
  };
}

export async function showLocalNotification(payload = {}) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return { success: false, error: "Notifications are not supported" };
  }

  const permission =
    Notification.permission === "granted"
      ? "granted"
      : await Notification.requestPermission();

  if (permission !== "granted") {
    return { success: false, error: "Notification permission not granted" };
  }

  const registration = await navigator.serviceWorker.getRegistration();
  const normalized = createPushPayload(payload);

  if (registration) {
    await registration.showNotification(normalized.title, {
      body: normalized.body,
      icon: normalized.icon,
      image: normalized.image,
      data: normalized.data,
      actions: normalized.actions,
      tag: normalized.tag,
      requireInteraction: normalized.requireInteraction,
      silent: normalized.silent,
    });

    return { success: true };
  }

  new Notification(normalized.title, {
    body: normalized.body,
    icon: normalized.icon,
    image: normalized.image,
    data: normalized.data,
    tag: normalized.tag,
    requireInteraction: normalized.requireInteraction,
    silent: normalized.silent,
  });

  return { success: true };
}
