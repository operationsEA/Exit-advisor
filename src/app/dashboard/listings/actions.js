"use server";

import * as XLSX from "xlsx";
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
        currency: formData.currency || "USD",
        min_price: formData.min_price || null,
        max_price: null,
        min_revenue: formData.min_revenue || null,
        max_revenue: null,
        min_cashflow: formData.min_cashflow || null,
        max_cashflow: null,
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
        currency,
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
        currency: listingData.currency || "USD",
        min_price: listingData.min_price,
        max_price: null,
        min_revenue: listingData.min_revenue,
        max_revenue: null,
        min_cashflow: listingData.min_cashflow,
        max_cashflow: null,
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
        currency,
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
          currency,
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
const BULK_VALID_CATEGORIES = [
  "Retail Store",
  "Restaurant & Café",
  "Technology Startup",
  "Consulting Firm",
  "E-commerce Business",
  "Fitness & Wellness",
  "Real Estate Agency",
  "Marketing Agency",
  "Manufacturing",
  "Professional Services",
];

const BULK_VALID_STATUSES = ["draft", "available", "loi", "sold"];
const BULK_VALID_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "AED",
  "SAR",
  "INR",
  "CAD",
  "AUD",
  "JPY",
  "SGD",
];

export async function bulkUploadListings(formData) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Not authenticated" };

    const role = user.user_metadata?.role;
    if (!["broker", "admin"].includes(role)) {
      return { error: "Only brokers and admins can use bulk upload" };
    }

    const file = formData.get("file");
    if (!file || typeof file === "string") return { error: "No file provided" };

    const fileName = file.name || "";
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls"].includes(ext)) {
      return {
        error: "Invalid file type. Please upload an .xlsx or .xls file",
      };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { error: "File too large. Maximum file size is 5MB" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return { error: "Excel file has no sheets" };

    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: false,
      defval: "",
    });

    if (rows.length < 2) {
      return { error: "File is empty or contains only a header row" };
    }

    const rawHeaders = rows[0];
    const headers = rawHeaders.map((h) =>
      String(h).trim().toLowerCase().replace(/\s+/g, "_"),
    );

    const dataRows = rows
      .slice(1)
      .filter(
        (row) => Array.isArray(row) && row.some((c) => String(c).trim() !== ""),
      );

    if (dataRows.length === 0) {
      return { error: "No data rows found in the file" };
    }
    if (dataRows.length > 100) {
      return {
        error: `Too many rows (${dataRows.length}). Maximum 100 listings per upload`,
      };
    }

    const findCol = (...names) => {
      for (const name of names) {
        const idx = headers.indexOf(name.toLowerCase().replace(/\s+/g, "_"));
        if (idx >= 0) return idx;
      }
      return -1;
    };

    const colMap = {
      title: findCol("title"),
      description: findCol("description"),
      business_category: findCol(
        "category",
        "business_category",
        "business_category",
      ),
      status: findCol("status"),
      currency: findCol("currency"),
      min_price: findCol("price", "min_price", "asking_price"),
      min_revenue: findCol("revenue", "min_revenue", "annual_revenue"),
      min_cashflow: findCol("cashflow", "cash_flow", "min_cashflow"),
      no_of_employees: findCol(
        "employees",
        "no_of_employees",
        "number_of_employees",
      ),
      reference_no: findCol("reference_no", "ref_no", "ref"),
      country: findCol("country"),
      state: findCol("state"),
      is_sba_approved: findCol("sba_approved", "is_sba_approved", "sba"),
      has_seller_financing: findCol(
        "seller_financing",
        "has_seller_financing",
        "financing",
      ),
      is_distressed: findCol("distressed", "is_distressed"),
      is_remote: findCol("remote", "is_remote"),
      tags: findCol("tags"),
      links: findCol("links"),
    };

    const results = [];
    const toInsert = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNum = i + 2;
      const errors = [];

      const get = (key) => {
        const idx = colMap[key];
        return idx >= 0 ? String(row[idx] ?? "").trim() : "";
      };

      const getBool = (key) => {
        const val = get(key).toLowerCase();
        return ["true", "yes", "1", "y"].includes(val);
      };

      const getNum = (key) => {
        const val = get(key).replace(/,/g, "").trim();
        if (!val) return null;
        const n = parseFloat(val);
        return isNaN(n) ? null : n;
      };

      const title = get("title");
      const description = get("description");
      const category = get("business_category");
      const country = get("country");
      const status = (get("status") || "draft").toLowerCase();
      const currency = (get("currency") || "USD").toUpperCase();
      const refNo = get("reference_no");

      if (!title) {
        errors.push("Title is required");
      } else if (title.length < 5) {
        errors.push("Title must be at least 5 characters");
      } else if (title.length > 80) {
        errors.push("Title must not exceed 80 characters");
      }

      if (!description) {
        errors.push("Description is required");
      } else if (description.length < 500) {
        errors.push(
          `Description too short (${description.length} chars, minimum 500 required)`,
        );
      } else if (description.length > 5000) {
        errors.push("Description too long (max 5000 chars)");
      }

      if (!category) {
        errors.push("Category is required");
      } else if (!BULK_VALID_CATEGORIES.includes(category)) {
        errors.push(
          `Invalid category: "${category}". Valid values: ${BULK_VALID_CATEGORIES.join(", ")}`,
        );
      }

      if (!country) errors.push("Country is required");

      if (!BULK_VALID_STATUSES.includes(status)) {
        errors.push(
          `Invalid status "${status}". Use: draft, available, loi, sold`,
        );
      }

      if (!BULK_VALID_CURRENCIES.includes(currency)) {
        errors.push(
          `Invalid currency "${currency}". Use: ${BULK_VALID_CURRENCIES.join(", ")}`,
        );
      }

      if (refNo && refNo.length > 6) {
        errors.push("Reference No must be max 6 characters");
      }

      const tagsRaw = get("tags");
      const tags = tagsRaw
        ? tagsRaw
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
      if (tags.length > 8) errors.push("Maximum 8 tags allowed");

      const linksRaw = get("links");
      const links = [];
      if (linksRaw) {
        for (const pair of linksRaw.split(",")) {
          const [text, link] = pair.split("|").map((s) => s?.trim());
          if (text && link) {
            try {
              new URL(link);
              links.push({ text, link });
            } catch {
              errors.push(`Invalid URL in links column: "${link}"`);
            }
          }
        }
        if (links.length > 10) errors.push("Maximum 10 links allowed");
      }

      if (errors.length > 0) {
        results.push({
          row: rowNum,
          title: title || "(empty)",
          status: "error",
          errors,
        });
        continue;
      }

      const noOfEmp = getNum("no_of_employees");

      toInsert.push({
        rowNum,
        title,
        listing: {
          user_id: user.id,
          title,
          description,
          business_category: category,
          status,
          currency,
          min_price: getNum("min_price"),
          max_price: null,
          min_revenue: getNum("min_revenue"),
          max_revenue: null,
          min_cashflow: getNum("min_cashflow"),
          max_cashflow: null,
          no_of_employees: noOfEmp !== null ? Math.round(noOfEmp) : null,
          reference_no: refNo || null,
          country,
          state: get("state") || null,
          is_sba_approved: getBool("is_sba_approved"),
          has_seller_financing: getBool("has_seller_financing"),
          is_distressed: getBool("is_distressed"),
          is_remote: getBool("is_remote"),
          is_featured: false,
          tags: tags.length > 0 ? tags : null,
          links: links.length > 0 ? links : null,
        },
      });
    }

    if (toInsert.length > 0) {
      const { data: inserted, error: batchError } = await supabase
        .from("listings")
        .insert(toInsert.map((r) => r.listing))
        .select("id, title");

      if (!batchError && inserted) {
        for (let i = 0; i < toInsert.length; i++) {
          results.push({
            row: toInsert[i].rowNum,
            title: toInsert[i].title,
            status: "success",
            id: inserted[i]?.id,
          });
        }
      } else {
        // Batch failed — fall back to individual inserts for granular error reporting
        for (const item of toInsert) {
          const { data, error } = await supabase
            .from("listings")
            .insert(item.listing)
            .select("id")
            .single();

          if (error) {
            results.push({
              row: item.rowNum,
              title: item.title,
              status: "error",
              errors: [error.message],
            });
          } else {
            results.push({
              row: item.rowNum,
              title: item.title,
              status: "success",
              id: data.id,
            });
          }
        }
      }
    }

    results.sort((a, b) => a.row - b.row);

    const succeeded = results.filter((r) => r.status === "success").length;
    const failed = results.filter((r) => r.status === "error").length;

    return {
      success: true,
      results,
      summary: { total: dataRows.length, succeeded, failed },
    };
  } catch (error) {
    console.error("Bulk upload error:", error);
    return { error: error.message || "Bulk upload failed" };
  }
}
