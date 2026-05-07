export { app, firebaseConfig, getFirebaseApp } from "./config";
export {
  clearStoredPushToken,
  createFcmPushPayload,
  getMessagingInstance,
  getOrCreatePushToken,
  initializeWebPush,
  isPushMessagingSupported,
  onForegroundMessage,
  readStoredPushToken,
  registerMessagingServiceWorker,
  requestNotificationPermission,
  sendPushNotification,
} from "./messaging";
