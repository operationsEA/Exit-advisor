"use server";

import { createServerSupabaseClient } from "@/supabase";

export async function createListing(formData) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    // Insert listing
    const { data, error } = await supabase
      .from("listings")
      .insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        business_category: formData.business_category,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);

      if (error.code === "PGRST301" || error.message?.includes("policy")) {
        return {
          error:
            "Only sellers and brokers can create listings. Make sure your account has the 'seller' or 'broker' role.",
        };
      }

      return { error: error.message || "Failed to create listing" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error creating listing:", error);
    return { error: error.message || "Failed to create listing" };
  }
}

export async function getListings() {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    // Fetch user's listings
    const { data: listings, error } = await supabase
      .from("listings")
      .select(
        `
        id,
        title,
        description,
        business_category,
        status,
        created_at,
        updated_at,
        image_url,
        min_price,
        max_price,
        is_approved,
        is_featured
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching listings:", error);
      return { error: error.message || "Failed to fetch listings" };
    }

    return { success: true, data: listings || [] };
  } catch (error) {
    console.error("Error in getListings:", error);
    return { error: error.message || "Failed to fetch listings" };
  }
}

export async function updateListingStatus(listingId, status) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    const { data, error } = await supabase
      .from("listings")
      .update({ status })
      .eq("id", listingId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return { error: error.message || "Failed to update listing" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error updating listing:", error);
    return { error: error.message || "Failed to update listing" };
  }
}

export async function deleteListing(listingId) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", listingId)
      .eq("user_id", user.id);

    if (error) {
      return { error: error.message || "Failed to delete listing" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting listing:", error);
    return { error: error.message || "Failed to delete listing" };
  }
}
