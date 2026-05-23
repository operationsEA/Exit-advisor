"use server";

import { createServerSupabaseClient } from "@/supabase";

// ─── Seller ───────────────────────────────────────────────────────────────────

export async function getSellerStats(userId) {
  const supabase = await createServerSupabaseClient();

  const [
    { count: activeListings },
    { count: pendingListings },
    { count: totalInquiries },
    { count: favoritesReceived },
    { data: recentListings },
  ] = await Promise.all([
    // Active approved listings
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_approved", true)
      .eq("status", "available"),

    // Listings pending approval
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_approved", false)
      .neq("status", "draft"),

    // Total chats (buyer inquiries) on own listings
    supabase
      .from("chat")
      .select("id", { count: "exact", head: true })
      .eq("seller_id", userId),

    // Total times own listings have been favorited
    supabase
      .from("favorites_listings")
      .select("id", { count: "exact", head: true })
      .in(
        "listing_id",
        (
          await supabase.from("listings").select("id").eq("user_id", userId)
        ).data?.map((l) => l.id) ?? [],
      ),

    // Last 5 own listings
    supabase
      .from("listings")
      .select("id, title, status, is_approved, created_at, business_category")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    activeListings: activeListings ?? 0,
    pendingListings: pendingListings ?? 0,
    totalInquiries: totalInquiries ?? 0,
    favoritesReceived: favoritesReceived ?? 0,
    recentListings: recentListings ?? [],
  };
}

// ─── Broker ───────────────────────────────────────────────────────────────────

export async function getBrokerStats(userId) {
  const supabase = await createServerSupabaseClient();

  const sellerStats = await getSellerStats(userId);

  const { data: uploadLogs } = await supabase
    .from("bulk_upload_logs")
    .select("success_count, failed_count")
    .eq("broker_id", userId);

  const totalUploaded = (uploadLogs ?? []).reduce(
    (sum, log) => sum + (log.success_count ?? 0),
    0,
  );

  return {
    ...sellerStats,
    totalUploaded,
  };
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: totalListings },
    { count: pendingApprovals },
    { count: publishedBlogs },
    { count: totalUsers },
    { data: pendingListings },
  ] = await Promise.all([
    // All listings ever
    supabase.from("listings").select("id", { count: "exact", head: true }),

    // Listings submitted but not yet approved
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("is_approved", false)
      .neq("status", "draft"),

    // Published blogs
    supabase
      .from("blogs")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),

    // Total registered users
    supabase.from("profiles").select("id", { count: "exact", head: true }),

    // Last 5 listings pending approval for quick action
    supabase
      .from("listings")
      .select(
        "id, title, status, is_approved, created_at, business_category, profiles:user_id(full_name)",
      )
      .eq("is_approved", false)
      .neq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    totalListings: totalListings ?? 0,
    pendingApprovals: pendingApprovals ?? 0,
    publishedBlogs: publishedBlogs ?? 0,
    totalUsers: totalUsers ?? 0,
    pendingListings: pendingListings ?? [],
  };
}

// ─── Buyer ────────────────────────────────────────────────────────────────────

export async function getBuyerStats(userId) {
  const supabase = await createServerSupabaseClient();

  const [
    { count: savedListings },
    { count: activeChats },
    { count: unreadMessages },
  ] = await Promise.all([
    // Favorited listings
    supabase
      .from("favorites_listings")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),

    // All chats as buyer
    supabase
      .from("chat")
      .select("id", { count: "exact", head: true })
      .eq("buyer_id", userId),

    // Unread messages in buyer's chats (sent by others)
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("is_seen", false)
      .neq("sender_id", userId)
      .in(
        "chat_id",
        (
          await supabase.from("chat").select("id").eq("buyer_id", userId)
        ).data?.map((c) => c.id) ?? [],
      ),
  ]);

  return {
    savedListings: savedListings ?? 0,
    activeChats: activeChats ?? 0,
    unreadMessages: unreadMessages ?? 0,
  };
}
