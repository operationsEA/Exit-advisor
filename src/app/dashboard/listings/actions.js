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
        status: formData.status || "available",
        min_price: formData.min_price || null,
        max_price: formData.max_price || null,
        min_revenue: formData.min_revenue || null,
        max_revenue: formData.max_revenue || null,
        min_cashflow: formData.min_cashflow || null,
        max_cashflow: formData.max_cashflow || null,
        no_of_employees: formData.no_of_employees || null,
        reference_no: formData.reference_no || null,
        country: formData.country || null,
        state: formData.state || null,
        is_sba_approved: formData.is_sba_approved || false,
        has_seller_financing: formData.has_seller_financing || false,
        is_distressed: formData.is_distressed || false,
        is_remote: formData.is_remote || false,
        is_featured: formData.is_featured || false,
        tags: formData.tags?.length > 0 ? formData.tags : undefined,
        links: formData.links?.length > 0 ? formData.links : undefined,
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
        user_id,
        description,
        business_category,
        status,
        min_price,
        max_price,
        min_revenue,
        max_revenue,
        min_cashflow,
        max_cashflow,
        no_of_employees,
        reference_no,
        country,
        state,
        is_sba_approved,
        has_seller_financing,
        is_distressed,
        is_remote,
        is_featured,
        is_approved,
        image_url,
        created_at,
        updated_at,
        tags,
        links
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

export async function updateListing(listingId, listingData) {
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

    // Update listing with all fields
    const { data, error } = await supabase
      .from("listings")
      .update({
        title: listingData.title,
        description: listingData.description,
        business_category: listingData.business_category,
        status: listingData.status,
        min_price: listingData.min_price,
        max_price: listingData.max_price,
        min_revenue: listingData.min_revenue,
        max_revenue: listingData.max_revenue,
        min_cashflow: listingData.min_cashflow,
        max_cashflow: listingData.max_cashflow,
        no_of_employees: listingData.no_of_employees,
        reference_no: listingData.reference_no,
        country: listingData.country,
        state: listingData.state,
        is_sba_approved: listingData.is_sba_approved,
        has_seller_financing: listingData.has_seller_financing,
        is_distressed: listingData.is_distressed,
        is_remote: listingData.is_remote,
        is_featured: listingData.is_featured,
        image_url: listingData.image_url,
        updated_at: new Date().toISOString(),
        tags: listingData.tags?.length > 0 ? listingData.tags : undefined,
        links: listingData.links?.length > 0 ? listingData.links : undefined,
      })
      .eq("id", listingId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return { error: error.message || "Failed to update listing" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error updating listing:", error);
    return { error: error.message || "Failed to update listing" };
  }
}

export async function uploadAndUpdateListingImage(
  listingId,
  oldImageUrl,
  fileBlob,
  fileName,
  businessCategory = "uncategorized",
  title = "business-listing-image",
) {
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

    // Delete old image if it exists
    if (oldImageUrl) {
      try {
        const urlParts = oldImageUrl.split(
          "/storage/v1/object/public/biz-bucket/",
        );
        if (urlParts.length > 1) {
          const oldFilePath = decodeURIComponent(urlParts[1]);
          await supabase.storage.from("biz-bucket").remove([oldFilePath]);
        }
        console.log("✅ Old image deleted successfully");
      } catch (deleteError) {
        console.error("Error deleting old image:", deleteError);
      }
    }

    // Create a unique file path
    const timestamp = Date.now();
    const fileExt = (fileName.split(".").pop() || "jpg").toLowerCase();
    const sanitizedCategory = businessCategory
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const sanitizedTitle = title
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const filePath = `business-for-sale/${sanitizedCategory}/${sanitizedTitle}/${listingId}/${timestamp}.${fileExt}`;

    // Upload new image
    const { error: uploadError } = await supabase.storage
      .from("biz-bucket")
      .upload(filePath, fileBlob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { error: uploadError.message || "Failed to upload image" };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("biz-bucket")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    // Update listings table with new image_url
    const { data, error } = await supabase
      .from("listings")
      .update({
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return { error: error.message || "Failed to save image URL" };
    }

    return { success: true, imageUrl };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { error: error.message || "Failed to upload image" };
  }
}

export async function getListingDocuments(listingId) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    // Fetch documents for this listing
    const { data: documents, error } = await supabase
      .from("listing_documents")
      .select("*")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      return { error: error.message || "Failed to fetch documents" };
    }

    return { success: true, data: documents || [] };
  } catch (error) {
    console.error("Error in getListingDocuments:", error);
    return { error: error.message || "Failed to fetch documents" };
  }
}

export async function uploadAndUpdateFile(
  listingId,
  fileBlob,
  fileName,
  fileSize,
) {
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

    // Validate file size (limit to 10MB)
    if (fileSize > 10 * 1024 * 1024) {
      return { error: "File size must be less than 10MB" };
    }

    // Create a unique file path
    const timestamp = Date.now();
    const fileExt = fileName.split(".").pop();
    const sanitizedFileName = fileName.replace(/[^a-z0-9.]/gi, "_");
    const filePath = `listings/${listingId}/documents/${timestamp}-${sanitizedFileName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from("biz-bucket")
      .upload(filePath, fileBlob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { error: uploadError.message || "Failed to upload file" };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("biz-bucket")
      .getPublicUrl(filePath);

    const fileUrl = publicUrlData.publicUrl;

    // Determine file type from extension
    const fileType = fileExt.toLowerCase();

    // Insert record into listing_documents
    const { data, error: dbError } = await supabase
      .from("listing_documents")
      .insert({
        listing_id: listingId,
        file_url: fileUrl,
        file_type: fileType,
      });

    if (dbError) {
      // Try to delete the uploaded file if database insert fails
      try {
        await supabase.storage.from("biz-bucket").remove([filePath]);
      } catch (deleteErr) {
        console.error("Error deleting file after DB failure:", deleteErr);
      }
      return { error: dbError.message || "Failed to save document record" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error: error.message || "Failed to upload file" };
  }
}

export async function deleteListingDocument(documentId, fileUrl) {
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

    // Delete file from storage
    if (fileUrl) {
      try {
        const urlParts = fileUrl.split("/storage/v1/object/public/biz-bucket/");
        if (urlParts.length > 1) {
          const filePath = decodeURIComponent(urlParts[1]);
          await supabase.storage.from("biz-bucket").remove([filePath]);
        }
        console.log("✅ Document file deleted successfully");
      } catch (deleteError) {
        console.error("Error deleting file from storage:", deleteError);
      }
    }

    // Delete record from listing_documents
    const { error: dbError } = await supabase
      .from("listing_documents")
      .delete()
      .eq("id", documentId);

    if (dbError) {
      return { error: dbError.message || "Failed to delete document record" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { error: error.message || "Failed to delete document" };
  }
}

export async function getAllListingsWithUsers() {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user to verify they're an admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    // TODO: Add admin role check if needed
    if (user?.user_metadata?.role !== "admin") {
      return { error: "Unauthorized - Admin access required" };
    }

    // Fetch all listings with user details (excluding draft status)
    const { data: listings, error } = await supabase
      .from("listings")
      .select(
        `
        id,
        title,
        description,
        business_category,
        status,
        min_price,
        max_price,
        min_revenue,
        max_revenue,
        min_cashflow,
        max_cashflow,
        no_of_employees,
        reference_no,
        country,
        state,
        is_sba_approved,
        has_seller_financing,
        is_distressed,
        is_remote,
        is_featured,
        is_approved,
        image_url,
        created_at,
        updated_at,
        user_id,
        tags,
        links,
        profiles:user_id (
          id,
          email,
          full_name,
          role,
          avatar_url
        )
      `,
      )
      .neq("status", "draft")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all listings:", error);
      return { error: error.message || "Failed to fetch listings" };
    }

    return { success: true, data: listings || [] };
  } catch (error) {
    console.error("Error in getAllListingsWithUsers:", error);
    return { error: error.message || "Failed to fetch listings" };
  }
}

export async function updateListingApprovalStatus(listingId, isApproved) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user to verify they're an admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    const { data, error } = await supabase
      .from("listings")
      .update({
        is_approved: isApproved,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId)
      .select()
      .single();

    if (error) {
      return { error: error.message || "Failed to update listing approval" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error updating listing approval:", error);
    return {
      error: error.message || "Failed to update listing approval",
    };
  }
}

export async function adminUpdateListingStatus(listingId, status) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user to verify they're an admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    if (user?.user_metadata?.role !== "admin") {
      return { error: "Unauthorized - Admin access required" };
    }

    const { data, error } = await supabase
      .from("listings")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId)
      .select()
      .single();

    if (error) {
      return { error: error.message || "Failed to update listing status" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error updating listing status:", error);
    return { error: error.message || "Failed to update listing status" };
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

export async function getBuyerFavoriteListings() {
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

    // Fetch user's favorite listings with all listing details
    const { data: favorites, error } = await supabase
      .from("favorites_listings")
      .select(
        `
        id,
        listing_id,
        created_at,
        listings (
          id,
          title,
          user_id,
          description,
          business_category,
          status,
          min_price,
          max_price,
          min_revenue,
          max_revenue,
          country,
          state,
          is_sba_approved,
          has_seller_financing,
          is_distressed,
          is_remote,
          is_featured,
          is_approved,
          image_url,
          created_at,
          updated_at,
          tags,
          profiles:user_id (id, full_name, email, role)
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching favorite listings:", error);
      return { error: error.message || "Failed to fetch favorites" };
    }

    // Map favorites to listing objects with is_favourite flag
    const favoritedListings = (favorites || [])
      .filter((fav) => fav.listings) // Ensure listing exists
      .map((fav) => ({
        ...fav.listings,
        is_favourite: true,
      }));

    return { success: true, data: favoritedListings };
  } catch (error) {
    console.error("Error in getBuyerFavoriteListings:", error);
    return { error: error.message || "Failed to fetch favorite listings" };
  }
}
