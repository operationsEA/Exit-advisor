"use server";

import admin from "firebase-admin";

import { createServerSupabaseClient } from "@/supabase/server";
import { createAdminSupabaseClient } from "@/supabase/index";

async function getAuthenticatedUser(supabase) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      error: "Not authenticated",
      success: false,
      user: null,
    };
  }

  return { success: true, user };
}

async function getAccessibleChat(supabase, chatId, userId) {
  const { data: chat, error } = await supabase
    .from("chat")
    .select("id, listing_id, buyer_id, seller_id")
    .eq("id", chatId)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .maybeSingle();

  if (error) {
    return {
      error: error.message || "Failed to access chat",
      success: false,
      chat: null,
    };
  }

  if (!chat) {
    return {
      error: "Chat not found or access denied",
      success: false,
      chat: null,
    };
  }

  return { success: true, chat };
}

function sanitizePathSegment(value, fallback = "unknown") {
  return (
    value
      ?.toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || fallback
  );
}

async function uploadChatAttachment({ supabase, chatId, senderId, file }) {
  const timestamp = Date.now();
  const originalName = file?.name || "attachment";
  const extension = (originalName.split(".").pop() || "bin").toLowerCase();
  const safeName = sanitizePathSegment(
    originalName.replace(/\.[^.]+$/, ""),
    "file",
  );
  const filePath = `chat-files/${chatId}/${senderId}/${timestamp}-${safeName}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("biz-bucket")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file?.type || undefined,
    });

  if (uploadError) {
    return {
      error: uploadError.message || "Failed to upload attachment",
      success: false,
    };
  }

  const { data: publicUrlData } = supabase.storage
    .from("biz-bucket")
    .getPublicUrl(filePath);

  return {
    success: true,
    data: {
      file_url: publicUrlData.publicUrl,
      file_type: extension,
      file_name: originalName,
      file_size: file?.size || null,
      mime_type: file?.type || null,
    },
  };
}

export async function createChat({ listingId, sellerId, buyerId } = {}) {
  try {
    const supabase = await createServerSupabaseClient();
    const auth = await getAuthenticatedUser(supabase);

    if (!auth.success) {
      return { error: auth.error, success: false };
    }

    const currentUserId = auth.user.id;
    const resolvedBuyerId = buyerId || currentUserId;

    if (!listingId || !sellerId) {
      return {
        error: "listingId and sellerId are required",
        success: false,
      };
    }

    if (resolvedBuyerId === sellerId) {
      return {
        error: "Buyer and seller cannot be the same user",
        success: false,
      };
    }

    if (currentUserId !== resolvedBuyerId && currentUserId !== sellerId) {
      return {
        error: "Unauthorized to create this chat",
        success: false,
      };
    }

    const { data: existingChat, error: existingError } = await supabase
      .from("chat")
      .select(
        `
        id,
        listing_id,
        buyer_id,
        seller_id,
        last_message_at,
        created_at,
        buyer:buyer_id(id, full_name, email, role, avatar_url),
        seller:seller_id(id, full_name, email, role, avatar_url),
        listing:listing_id(id, title, business_category, image_url, status)
      `,
      )
      .eq("listing_id", listingId)
      .eq("buyer_id", resolvedBuyerId)
      .eq("seller_id", sellerId)
      .maybeSingle();

    if (existingError) {
      return {
        error: existingError.message || "Failed to check existing chat",
        success: false,
      };
    }

    if (existingChat) {
      return { success: true, data: existingChat };
    }

    const { data: chat, error } = await supabase
      .from("chat")
      .insert({
        listing_id: listingId,
        buyer_id: resolvedBuyerId,
        seller_id: sellerId,
      })
      .select(
        `
        id,
        listing_id,
        buyer_id,
        seller_id,
        last_message_at,
        created_at,
        buyer:buyer_id(id, full_name, email, role, avatar_url),
        seller:seller_id(id, full_name, email, role, avatar_url),
        listing:listing_id(id, title, business_category, image_url, status)
      `,
      )
      .single();

    if (error) {
      return {
        error: error.message || "Failed to create chat",
        success: false,
      };
    }

    return { success: true, data: chat };
  } catch (error) {
    console.error("Error in createChat:", error);
    return { error: error.message || "Failed to create chat", success: false };
  }
}

export async function getUserChats() {
  try {
    const supabase = await createServerSupabaseClient();
    const auth = await getAuthenticatedUser(supabase);

    if (!auth.success) {
      return { error: auth.error, success: false };
    }

    const userId = auth.user.id;

    const { data: chats, error } = await supabase
      .from("chat")
      .select(
        `
        id,
        listing_id,
        buyer_id,
        seller_id,
        last_message_at,
        created_at,
        buyer:buyer_id(id, full_name, email, role, avatar_url),
        seller:seller_id(id, full_name, email, role, avatar_url),
        listing:listing_id(id, title, business_category, image_url, status),
        messages(
          id,
          message,
          message_type,
          sender_id,
          is_seen,
          created_at
        )
      `,
      )
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      return {
        error: error.message || "Failed to fetch chats",
        success: false,
      };
    }

    const data = (chats || []).map((chatItem) => {
      const messages = [...(chatItem.messages || [])].sort(
        (left, right) => new Date(right.created_at) - new Date(left.created_at),
      );

      return {
        ...chatItem,
        last_message: messages[0] || null,
        messages: undefined,
      };
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error in getUserChats:", error);
    return { error: error.message || "Failed to fetch chats", success: false };
  }
}

export async function sendMessage({
  chatId,
  message = "",
  attachment,
  attachments = [],
  messageType,
  isAdmin = false,
} = {}) {
  try {
    const supabase = await createServerSupabaseClient();
    const auth = await getAuthenticatedUser(supabase);

    if (!auth.success) {
      return { error: auth.error, success: false };
    }

    if (!chatId) {
      return { error: "chatId is required", success: false };
    }

    const access = await getAccessibleChat(supabase, chatId, auth.user.id);
    if (!access.success) {
      return { error: access.error, success: false };
    }

    const text = message?.trim() || "";
    const fileList = [attachment, ...attachments].filter(Boolean);

    if (!text && fileList.length === 0) {
      return {
        error: "Message text or at least one attachment is required",
        success: false,
      };
    }

    const resolvedMessageType =
      messageType ||
      (fileList.length > 0 ? (text ? "mixed" : "attachment") : "text");

    const now = new Date().toISOString();

    const { data: createdMessage, error: messageError } = await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        sender_id: auth.user.id,
        message: text || null,
        is_admin: Boolean(isAdmin),
        message_type: resolvedMessageType,
      })
      .select(
        `
        id,
        chat_id,
        sender_id,
        message,
        is_admin,
        is_seen,
        message_type,
        created_at,
        sender:sender_id(id, full_name, email, role, avatar_url)
      `,
      )
      .single();

    if (messageError) {
      return {
        error: messageError.message || "Failed to send message",
        success: false,
      };
    }

    const uploadedAttachments = [];

    for (const file of fileList) {
      const uploadResult = await uploadChatAttachment({
        supabase,
        chatId,
        senderId: auth.user.id,
        file,
      });

      if (!uploadResult.success) {
        return { error: uploadResult.error, success: false };
      }

      uploadedAttachments.push(uploadResult.data);
    }

    if (uploadedAttachments.length > 0) {
      const payload = uploadedAttachments.map((item) => ({
        message_id: createdMessage.id,
        ...item,
      }));

      const { error: attachmentError } = await supabase
        .from("message_attachments")
        .insert(payload);

      if (attachmentError) {
        return {
          error: attachmentError.message || "Failed to save attachments",
          success: false,
        };
      }
    }

    const { error: chatUpdateError } = await supabase
      .from("chat")
      .update({ last_message_at: now })
      .eq("id", chatId);

    if (chatUpdateError) {
      return {
        error: chatUpdateError.message || "Failed to update chat state",
        success: false,
      };
    }

    const { data: fullMessage, error: fullMessageError } = await supabase
      .from("messages")
      .select(
        `
        id,
        chat_id,
        sender_id,
        message,
        is_admin,
        is_seen,
        message_type,
        created_at,
        sender:sender_id(id, full_name, email, role, avatar_url),
        attachments:message_attachments(
          id,
          file_url,
          file_type,
          file_name,
          file_size,
          mime_type,
          created_at
        )
      `,
      )
      .eq("id", createdMessage.id)
      .single();

    if (fullMessageError) {
      return {
        error:
          fullMessageError.message || "Message sent but failed to read back",
        success: false,
      };
    }

    return { success: true, data: fullMessage };
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return { error: error.message || "Failed to send message", success: false };
  }
}

export async function readMessages(chatId) {
  try {
    const supabase = await createServerSupabaseClient();
    const auth = await getAuthenticatedUser(supabase);

    if (!auth.success) {
      return { error: auth.error, success: false };
    }

    if (!chatId) {
      return { error: "chatId is required", success: false };
    }

    const access = await getAccessibleChat(supabase, chatId, auth.user.id);
    if (!access.success) {
      return { error: access.error, success: false };
    }

    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        id,
        chat_id,
        sender_id,
        message,
        is_admin,
        is_seen,
        message_type,
        created_at,
        sender:sender_id(id, full_name, email, role, avatar_url),
        attachments:message_attachments(
          id,
          file_url,
          file_type,
          file_name,
          file_size,
          mime_type,
          created_at
        )
      `,
      )
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      return {
        error: error.message || "Failed to read messages",
        success: false,
      };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in readMessages:", error);
    return {
      error: error.message || "Failed to read messages",
      success: false,
    };
  }
}

export async function markAsSean(chatId) {
  try {
    const supabase = await createServerSupabaseClient();
    const auth = await getAuthenticatedUser(supabase);

    if (!auth.success) {
      return { error: auth.error, success: false };
    }

    if (!chatId) {
      return { error: "chatId is required", success: false };
    }

    const access = await getAccessibleChat(supabase, chatId, auth.user.id);
    if (!access.success) {
      return { error: access.error, success: false };
    }

    const { error } = await supabase
      .from("messages")
      .update({ is_seen: true })
      .eq("chat_id", chatId)
      .eq("is_seen", false)
      .neq("sender_id", auth.user.id);

    if (error) {
      return {
        error: error.message || "Failed to mark messages as seen",
        success: false,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in markAsSean:", error);
    return {
      error: error.message || "Failed to mark messages as seen",
      success: false,
    };
  }
}

function getFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error("Firebase Admin env vars are not set");
  }

  return admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

export async function sendFcmNotification({ token, payload } = {}) {
  const resolvedToken = token?.toString().trim();
  if (!resolvedToken) {
    return { success: false, error: "token is required" };
  }

  try {
    getFirebaseAdmin();

    const message = {
      token: resolvedToken,
      data: payload,
    };

    const messageId = await admin.messaging().send(message);

    return { success: true, messageId };
  } catch (error) {
    console.error("[sendFcmNotification] Error:", error.message);

    if (
      error.code === "messaging/registration-token-not-registered" ||
      error.code === "messaging/invalid-registration-token"
    ) {
      return {
        success: false,
        error: "Token expired or invalid",
        code: error.code,
        tokenExpired: true,
      };
    }

    return { success: false, error: error.message || "Unknown error" };
  }
}

/**
 * Queue an email notification for the message recipient if they are not
 * currently active in the chat. Called fire-and-forget from sendMessage /
 * sendAdminMessage so it never blocks the sender's UI.
 *
 * The Postgres trigger (trg_queue_chat_email) also handles this for direct DB
 * inserts, so this call is an additional safety net from the app layer.
 */
export async function queueEmailNotification({
  chatId,
  senderId,
  messageId,
} = {}) {
  if (!chatId || !senderId || !messageId) return { success: false };

  try {
    const supabase = createAdminSupabaseClient();

    // Resolve the chat so we can find the recipient
    const { data: chat, error: chatError } = await supabase
      .from("chat")
      .select("buyer_id, seller_id")
      .eq("id", chatId)
      .maybeSingle();

    if (chatError || !chat) return { success: false };

    const recipientId =
      senderId === chat.buyer_id ? chat.seller_id : chat.buyer_id;

    // Check whether the recipient is actively viewing this exact chat right now
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000).toISOString();
    const { data: activity } = await supabase
      .from("active_chats")
      .select("is_active, updated_at")
      .eq("user_id", recipientId)
      .eq("chat_id", chatId)
      .eq("is_active", true)
      .gte("updated_at", threeMinutesAgo)
      .maybeSingle();

    if (activity?.is_active) {
      // Recipient is online in this chat — no email needed
      return { success: true, skipped: true };
    }

    // Schedule the notification. The partial unique index on
    // (recipient_id, chat_id) WHERE sent=false prevents duplicates —
    // we just ignore the 23505 duplicate-key error if one already exists.
    const sendAfter = new Date(Date.now() + 2 * 60 * 1000).toISOString();
    const { error: insertError } = await supabase
      .from("pending_email_notifications")
      .insert({
        recipient_id: recipientId,
        chat_id: chatId,
        message_id: messageId,
        send_after: sendAfter,
      });

    // 23505 = unique_violation — means an unsent notification already exists, which is fine
    if (insertError && insertError.code !== "23505") {
      console.warn(
        "[queueEmailNotification] insert error:",
        insertError.message,
      );
    }

    return { success: true };
  } catch (err) {
    console.warn("[queueEmailNotification] unexpected error:", err);
    return { success: false };
  }
}
