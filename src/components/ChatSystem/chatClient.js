"use client";

import { createBrowserSupabaseClient } from "@/supabase/client";

let browserSupabase;

function getSupabase() {
  if (!browserSupabase) {
    browserSupabase = createBrowserSupabaseClient();
  }

  return browserSupabase;
}

async function getAuthenticatedUser() {
  const supabase = getSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { error: "Not authenticated", success: false, user: null };
  }

  return { success: true, user };
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

export async function createChat({ listingId, sellerId, buyerId } = {}) {
  const supabase = getSupabase();
  const auth = await getAuthenticatedUser();

  if (!auth.success) {
    return { error: auth.error, success: false };
  }

  const currentUserId = auth.user.id;
  const resolvedBuyerId = buyerId || currentUserId;

  if (!listingId || !sellerId) {
    return { error: "listingId and sellerId are required", success: false };
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

  const { data, error } = await supabase
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
    return { error: error.message || "Failed to create chat", success: false };
  }

  return { success: true, data };
}

export async function getUserChats() {
  const supabase = getSupabase();
  const auth = await getAuthenticatedUser();

  if (!auth.success) {
    return { error: auth.error, success: false };
  }

  const userId = auth.user.id;

  const { data, error } = await supabase
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
    return { error: error.message || "Failed to fetch chats", success: false };
  }

  const chats = (data || []).map((chat) => {
    const sortedMessages = [...(chat.messages || [])].sort(
      (left, right) => new Date(right.created_at) - new Date(left.created_at),
    );
    const unread_count = (chat.messages || []).filter(
      (message) => !message.is_seen && message.sender_id !== userId,
    ).length;

    return {
      ...chat,
      last_message: sortedMessages[0] || null,
      unread_count,
      messages: undefined,
    };
  });

  const orderedChats = [...chats].sort((left, right) => {
    const rightTime = right.last_message_at || right.created_at;
    const leftTime = left.last_message_at || left.created_at;
    return new Date(rightTime) - new Date(leftTime);
  });

  return { success: true, data: orderedChats };
}

export async function getAllChatsForAdmin() {
  const supabase = getSupabase();
  const auth = await getAuthenticatedUser();

  if (!auth.success) {
    return { error: auth.error, success: false };
  }

  const { data, error } = await supabase
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
        chat_id,
        sender_id,
        message,
        is_admin,
        is_seen,
        message_type,
        created_at,
        attachments:message_attachments(
          id,
          file_url,
          file_type,
          file_name,
          file_size,
          mime_type,
          created_at
        )
      )
    `,
    )
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    return {
      error: error.message || "Failed to fetch chats",
      success: false,
    };
  }

  const chats = (data || []).map((chat) => {
    const sortedMessages = [...(chat.messages || [])].sort(
      (left, right) => new Date(right.created_at) - new Date(left.created_at),
    );

    return {
      ...chat,
      last_message: sortedMessages[0] || null,
      all_messages: [...(chat.messages || [])].sort(
        (left, right) => new Date(left.created_at) - new Date(right.created_at),
      ),
      messages: undefined,
    };
  });

  const orderedChats = [...chats].sort((left, right) => {
    const rightTime = right.last_message_at || right.created_at;
    const leftTime = left.last_message_at || left.created_at;
    return new Date(rightTime) - new Date(leftTime);
  });

  return { success: true, data: orderedChats };
}

export async function readMessages(chatId) {
  const supabase = getSupabase();
  const auth = await getAuthenticatedUser();

  if (!auth.success) {
    return { error: auth.error, success: false };
  }

  if (!chatId) {
    return { error: "chatId is required", success: false };
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
      error: error.message || "Failed to fetch messages",
      success: false,
    };
  }

  return { success: true, data: data || [] };
}

async function uploadChatAttachment({ chatId, senderId, file }) {
  const supabase = getSupabase();
  const timestamp = Date.now();
  const originalName = file?.name || "attachment";
  const extension = (originalName.split(".").pop() || "bin").toLowerCase();
  const fileName = sanitizePathSegment(
    originalName.replace(/\.[^.]+$/, ""),
    "file",
  );
  const filePath = `chat-files/${chatId}/${senderId}/${timestamp}-${fileName}.${extension}`;

  const { error } = await supabase.storage
    .from("biz-bucket")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file?.type || undefined,
    });

  if (error) {
    return {
      error: error.message || "Failed to upload attachment",
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

export async function sendMessage({
  chatId,
  message = "",
  attachments = [],
  messageType,
} = {}) {
  const supabase = getSupabase();
  const auth = await getAuthenticatedUser();

  if (!auth.success) {
    return { error: auth.error, success: false };
  }

  if (!chatId) {
    return { error: "chatId is required", success: false };
  }

  const text = message.trim();
  const files = attachments.filter(Boolean);

  if (!text && files.length === 0) {
    return {
      error: "Message text or attachment is required",
      success: false,
    };
  }

  const resolvedMessageType =
    messageType ||
    (files.length > 0 ? (text ? "mixed" : "attachment") : "text");

  const { data: createdMessage, error: createError } = await supabase
    .from("messages")
    .insert({
      chat_id: chatId,
      sender_id: auth.user.id,
      message: text || null,
      is_admin: false,
      message_type: resolvedMessageType,
    })
    .select("id, created_at")
    .single();

  if (createError) {
    return {
      error: createError.message || "Failed to send message",
      success: false,
    };
  }

  const attachmentRows = [];

  for (const file of files) {
    const uploadResult = await uploadChatAttachment({
      chatId,
      senderId: auth.user.id,
      file,
    });

    if (!uploadResult.success) {
      return { error: uploadResult.error, success: false };
    }

    attachmentRows.push({
      message_id: createdMessage.id,
      ...uploadResult.data,
    });
  }

  if (attachmentRows.length > 0) {
    const { error: attachmentError } = await supabase
      .from("message_attachments")
      .insert(attachmentRows);

    if (attachmentError) {
      return {
        error: attachmentError.message || "Failed to save attachments",
        success: false,
      };
    }
  }

  const { error: chatError } = await supabase
    .from("chat")
    .update({ last_message_at: createdMessage.created_at })
    .eq("id", chatId);

  if (chatError) {
    return {
      error: chatError.message || "Failed to update chat",
      success: false,
    };
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
    .eq("id", createdMessage.id)
    .single();

  if (error) {
    return {
      error: error.message || "Failed to load sent message",
      success: false,
    };
  }

  return { success: true, data };
}

export async function sendAdminMessage({
  chatId,
  message = "",
  attachments = [],
  messageType,
} = {}) {
  const supabase = getSupabase();
  const auth = await getAuthenticatedUser();

  if (!auth.success) {
    return { error: auth.error, success: false };
  }

  if (!chatId) {
    return { error: "chatId is required", success: false };
  }

  const text = message.trim();
  const files = attachments.filter(Boolean);

  if (!text && files.length === 0) {
    return {
      error: "Message text or attachment is required",
      success: false,
    };
  }

  const resolvedMessageType =
    messageType ||
    (files.length > 0 ? (text ? "mixed" : "attachment") : "text");

  const { data: createdMessage, error: createError } = await supabase
    .from("messages")
    .insert({
      chat_id: chatId,
      sender_id: auth.user.id,
      message: text || null,
      is_admin: true,
      message_type: resolvedMessageType,
    })
    .select("id, created_at")
    .single();

  if (createError) {
    return {
      error: createError.message || "Failed to send message",
      success: false,
    };
  }

  const attachmentRows = [];

  for (const file of files) {
    const uploadResult = await uploadChatAttachment({
      chatId,
      senderId: auth.user.id,
      file,
    });

    if (!uploadResult.success) {
      return { error: uploadResult.error, success: false };
    }

    attachmentRows.push({
      message_id: createdMessage.id,
      ...uploadResult.data,
    });
  }

  if (attachmentRows.length > 0) {
    const { error: attachmentError } = await supabase
      .from("message_attachments")
      .insert(attachmentRows);

    if (attachmentError) {
      return {
        error: attachmentError.message || "Failed to save attachments",
        success: false,
      };
    }
  }

  const { error: chatError } = await supabase
    .from("chat")
    .update({ last_message_at: createdMessage.created_at })
    .eq("id", chatId);

  if (chatError) {
    return {
      error: chatError.message || "Failed to update chat",
      success: false,
    };
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
    .eq("id", createdMessage.id)
    .single();

  if (error) {
    return {
      error: error.message || "Failed to load sent message",
      success: false,
    };
  }

  return { success: true, data };
}

export async function markAsSeen(chatId) {
  const supabase = getSupabase();
  const auth = await getAuthenticatedUser();

  if (!auth.success) {
    return { error: auth.error, success: false };
  }

  if (!chatId) {
    return { error: "chatId is required", success: false };
  }

  const { error, count } = await supabase
    .from("messages")
    .update({ is_seen: true }, { count: "exact" })
    .eq("chat_id", chatId)
    .eq("is_seen", false)
    .neq("sender_id", auth.user.id);

  if (error) {
    return {
      error: error.message || "Failed to mark messages as seen",
      success: false,
    };
  }

  return { success: true, count };
}

export function subscribeToUserChats(userId, onChange) {
  const supabase = getSupabase();
  const buyerChannel = supabase
    .channel(`user-chats-buyer-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "chat",
        filter: `buyer_id=eq.${userId}`,
      },
      onChange,
    )
    .subscribe();

  const sellerChannel = supabase
    .channel(`user-chats-seller-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "chat",
        filter: `seller_id=eq.${userId}`,
      },
      onChange,
    )
    .subscribe();

  return () => {
    supabase.removeChannel(buyerChannel);
    supabase.removeChannel(sellerChannel);
  };
}

export function subscribeToChatMessages(chatId, onChange) {
  const supabase = getSupabase();
  const messagesChannel = supabase
    .channel(`chat-messages-${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      () => {
        window.setTimeout(() => onChange?.(), 200);
      },
    )
    .subscribe();

  const attachmentsChannel = supabase
    .channel(`chat-attachments-${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "message_attachments",
      },
      () => {
        window.setTimeout(() => onChange?.(), 200);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(messagesChannel);
    supabase.removeChannel(attachmentsChannel);
  };
}

export function subscribeToAdminChats(onChange) {
  const supabase = getSupabase();

  const chatsChannel = supabase
    .channel("admin-chats")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "chat",
      },
      () => {
        window.setTimeout(() => onChange?.(), 150);
      },
    )
    .subscribe();

  const messagesChannel = supabase
    .channel("admin-chat-messages")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
      },
      () => {
        window.setTimeout(() => onChange?.(), 150);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(chatsChannel);
    supabase.removeChannel(messagesChannel);
  };
}
