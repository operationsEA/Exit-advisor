"use server";

import { createServerSupabaseClient } from "@/supabase/server";
import CATEGORIES from "@/data/categories.json";
import COUNTRIES from "@/data/countries.json";

/**
 * Fetch public listings with advanced filtering
 * All filters are applied server-side on Supabase
 */
export async function getPublicListings(filters = {}) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query = supabase
      .from("listings")
      .select(
        `
        id,
        title,
        description,
        business_category,
        min_price,
        max_price,
        min_revenue,
        max_revenue,
        min_cashflow,
        max_cashflow,
        no_of_employees,
        country,
        state,
        is_sba_approved,
        has_seller_financing,
        is_distressed,
        is_remote,
        is_featured,
        status,
        is_approved,
        image_url,
        created_at,
        user_id,
        tags,
        profiles:user_id(id, full_name, email, role)
      `,
        { count: "exact" },
      )
      // Only show approved listings
      .eq("is_approved", true)
      // Exclude draft status
      .neq("status", "draft");

    // Search filter (searches title and description)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      query = query.or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`,
      );
    }

    // Category filter
    if (filters.category) {
      query = query.eq("business_category", filters.category);
    }

    // Tag filter (JSONB contains)
    if (filters.tag) {
      query = query.filter("tags", "cs", JSON.stringify([filters.tag]));
    }

    // Status filter
    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    // Location filters
    if (filters.country) {
      query = query.eq("country", filters.country);
    }

    if (filters.state) {
      query = query.eq("state", filters.state);
    }

    // Price range filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      if (filters.minPrice && filters.maxPrice) {
        // Price range between min and max
        query = query
          .gte("min_price", filters.minPrice)
          .lte("max_price", filters.maxPrice);
      } else if (filters.minPrice) {
        query = query.gte("max_price", filters.minPrice);
      } else if (filters.maxPrice) {
        query = query.lte("min_price", filters.maxPrice);
      }
    }

    // Revenue range filter
    if (filters.minRevenue !== undefined || filters.maxRevenue !== undefined) {
      if (filters.minRevenue && filters.maxRevenue) {
        query = query
          .gte("min_revenue", filters.minRevenue)
          .lte("max_revenue", filters.maxRevenue);
      } else if (filters.minRevenue) {
        query = query.gte("max_revenue", filters.minRevenue);
      } else if (filters.maxRevenue) {
        query = query.lte("min_revenue", filters.maxRevenue);
      }
    }

    // Cashflow range filter
    if (
      filters.minCashflow !== undefined ||
      filters.maxCashflow !== undefined
    ) {
      if (filters.minCashflow && filters.maxCashflow) {
        query = query
          .gte("min_cashflow", filters.minCashflow)
          .lte("max_cashflow", filters.maxCashflow);
      } else if (filters.minCashflow) {
        query = query.gte("max_cashflow", filters.minCashflow);
      } else if (filters.maxCashflow) {
        query = query.lte("min_cashflow", filters.maxCashflow);
      }
    }

    // Employee range filter — null rows are excluded intentionally
    if (
      filters.minNoOfEmployees !== undefined ||
      filters.maxNoOfEmployees !== undefined
    ) {
      if (filters.minNoOfEmployees !== undefined) {
        query = query.gte("no_of_employees", filters.minNoOfEmployees);
      }
      if (filters.maxNoOfEmployees !== undefined) {
        query = query.lte("no_of_employees", filters.maxNoOfEmployees);
      }
    }

    // Feature filter
    if (filters.featured === true) {
      query = query.eq("is_featured", true);
    }

    // Special features filters (booleans)
    if (filters.sbaApproved === true) {
      query = query.eq("is_sba_approved", true);
    }

    if (filters.sellerFinancing === true) {
      query = query.eq("has_seller_financing", true);
    }

    if (filters.distressed === true) {
      query = query.eq("is_distressed", true);
    }

    if (filters.remote === true) {
      query = query.eq("is_remote", true);
    }

    // Sorting (default: newest first)
    const sortBy = filters.sortBy || "created_at";
    const sortOrder = filters.sortOrder || "desc";
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Pagination
    const pageSize = filters.pageSize || 12;
    const page = filters.page || 1;
    const offset = (page - 1) * pageSize;

    query = query.range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return { error: error.message, success: false };
    }

    const listings = data || [];
    let favoriteIds = new Set();

    if (user?.id && listings.length > 0) {
      const listingIds = listings.map((listing) => listing.id);

      const { data: favorites, error: favoriteError } = await supabase
        .from("favorites_listings")
        .select("listing_id")
        .eq("user_id", user.id)
        .in("listing_id", listingIds);

      if (favoriteError) {
        console.error("Error fetching favorites for listings:", favoriteError);
      } else {
        favoriteIds = new Set((favorites || []).map((fav) => fav.listing_id));
      }
    }

    const listingsWithFavoriteFlag = listings.map((listing) => ({
      ...listing,
      is_favourite: favoriteIds.has(listing.id),
    }));

    return {
      success: true,
      data: listingsWithFavoriteFlag,
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  } catch (err) {
    console.error("Error fetching listings:", err);
    return {
      error: "Failed to fetch listings",
      success: false,
    };
  }
}

/**
 * Get filter options from JSON files (no Supabase queries needed)
 */
export async function getFilterOptions() {
  return {
    success: true,
    categories: CATEGORIES,
    countries: COUNTRIES,
    states: [],
  };
}

/**
 * Get detailed information for a single listing by ID
 * Only returns approved listings
 */
export async function getListingDetail(listingId) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: listing, error } = await supabase
      .from("listings")
      .select(
        `
        id,
        title,
        description,
        business_category,
        min_price,
        max_price,
        min_revenue,
        max_revenue,
        min_cashflow,
        max_cashflow,
        no_of_employees,
        country,
        state,
        is_sba_approved,
        has_seller_financing,
        is_distressed,
        is_remote,
        is_featured,
        status,
        is_approved,
        image_url,
        ffe,
        created_at,
        updated_at,
        user_id,
        tags,
        links,
        profiles:user_id(id, full_name, email, role, avatar_url)
      `,
      )
      .eq("id", listingId)
      .eq("is_approved", true)
      .neq("status", "draft")
      .single();

    if (error) {
      console.error("Error fetching listing detail:", error);
      return { error: "Listing not found", success: false };
    }

    let isFavourite = false;

    if (user?.id && listing?.id) {
      const { data: favorite, error: favoriteError } = await supabase
        .from("favorites_listings")
        .select("id")
        .eq("listing_id", listing.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (favoriteError) {
        console.error("Error checking listing favorite:", favoriteError);
      } else {
        isFavourite = Boolean(favorite);
      }
    }

    return {
      success: true,
      data: {
        ...listing,
        is_favourite: isFavourite,
      },
    };
  } catch (err) {
    console.error("Error in getListingDetail:", err);
    return { error: "Failed to fetch listing detail", success: false };
  }
}

/**
 * Get all documents for a listing
 */
export async function getListingDocumentsPublic(listingId) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: documents, error } = await supabase
      .from("listing_documents")
      .select("*")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      return {
        error: error.message || "Failed to fetch documents",
        success: false,
      };
    }

    return { success: true, data: documents || [] };
  } catch (err) {
    console.error("Error in getListingDocumentsPublic:", err);
    return { error: "Failed to fetch documents", success: false };
  }
}

// create favorite action for listing
export async function toggleFavorite(listingId, userId) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const currentUserId = user?.id || userId;

    if (!currentUserId) {
      return {
        error: "Unauthorized user",
        success: false,
      };
    }

    // Check if already favorited
    const { data: existing, error: checkError } = await supabase
      .from("favorites_listings")
      .select("id")
      .eq("listing_id", listingId)
      .eq("user_id", currentUserId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking favorite status:", checkError);
      return {
        error: checkError.message || "Failed to check favorite status",
        success: false,
      };
    }

    if (existing) {
      // If already favorited, remove from favorites
      const { error: deleteError } = await supabase
        .from("favorites_listings")
        .delete()
        .eq("listing_id", listingId)
        .eq("user_id", currentUserId);

      if (deleteError) {
        console.error("Error removing favorite:", deleteError);
        return {
          error: deleteError.message || "Failed to remove favorite",
          success: false,
        };
      }

      return { success: true, favorited: false };
    } else {
      // If not favorited, add to favorites
      const { error: insertError } = await supabase
        .from("favorites_listings")
        .insert({ listing_id: listingId, user_id: currentUserId });

      if (insertError) {
        console.error("Error adding favorite:", insertError);
        return {
          error: insertError.message || "Failed to add favorite",
          success: false,
        };
      }

      return { success: true, favorited: true };
    }
  } catch (err) {
    console.error("Error in toggleFavorite:", err);
    return { error: "Failed to toggle favorite status", success: false };
  }
}
