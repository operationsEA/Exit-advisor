"use server";

import { createServerSupabaseClient } from "@/supabase/server";

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
