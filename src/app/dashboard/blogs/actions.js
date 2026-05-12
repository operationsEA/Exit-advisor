"use server";

import { createServerSupabaseClient } from "@/supabase";

export async function getAllBlogs() {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    // Only admins can view all blogs
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return { error: "Unauthorized - Admin access required" };
    }

    const { data: blogs, error } = await supabase
      .from("blogs")
      .select(
        `
        id,
        user_id,
        title,
        slug,
        excerpt,
        featured_image_url,
        status,
        published_at,
        created_at,
        updated_at,
        profiles:user_id(full_name, email)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      return { error: error.message };
    }

    return { success: true, data: blogs || [] };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { error: error.message || "Failed to fetch blogs" };
  }
}

export async function getBlogById(blogId) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    const { data: blog, error } = await supabase
      .from("blogs")
      .select(
        `
        id,
        user_id,
        title,
        slug,
        excerpt,
        content,
        featured_image_url,
        category_id,
        status,
        published_at,
        created_at,
        updated_at
      `,
      )
      .eq("id", blogId)
      .single();

    if (error) {
      return { error: error.message };
    }

    // Check if published or if user is admin/owner
    if (blog.status === "published") {
      return { success: true, data: blog };
    }

    // For draft, only admin/owner can view
    if (blog.user_id !== user.id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        return { error: "Unauthorized" };
      }
    }

    return { success: true, data: blog };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return { error: error.message || "Failed to fetch blog" };
  }
}

export async function createBlog(blogData) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return { error: "Unauthorized - Admin access required" };
    }

    const { data, error } = await supabase
      .from("blogs")
      .insert({
        user_id: user.id,
        title: blogData.title,
        slug: blogData.slug,
        excerpt: blogData.excerpt,
        content: blogData.content,
        featured_image_url: blogData.featured_image_url || null,
        category_id: blogData.category_id || null,
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error creating blog:", error);
    return { error: error.message || "Failed to create blog" };
  }
}

export async function updateBlog(blogId, blogData) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return { error: "Unauthorized - Admin access required" };
    }

    const { data, error } = await supabase
      .from("blogs")
      .update({
        title: blogData.title,
        slug: blogData.slug,
        excerpt: blogData.excerpt,
        content: blogData.content,
        featured_image_url: blogData.featured_image_url,
        category_id: blogData.category_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", blogId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error updating blog:", error);
    return { error: error.message || "Failed to update blog" };
  }
}

export async function publishBlog(blogId) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return { error: "Unauthorized - Admin access required" };
    }

    const { data, error } = await supabase
      .from("blogs")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", blogId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error publishing blog:", error);
    return { error: error.message || "Failed to publish blog" };
  }
}

export async function deleteBlog(blogId) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return { error: "Unauthorized - Admin access required" };
    }

    const { error } = await supabase.from("blogs").delete().eq("id", blogId);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting blog:", error);
    return { error: error.message || "Failed to delete blog" };
  }
}

export async function uploadBlogImage(
  blogId,
  oldImageUrl,
  fileBlob,
  fileName,
  slug = "blog-image",
) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { error: "Unauthorized" };
    }

    // Delete old image if exists
    if (oldImageUrl) {
      try {
        const urlParts = oldImageUrl.split(
          "/storage/v1/object/public/biz-bucket/",
        );
        if (urlParts.length > 1) {
          const filePath = decodeURIComponent(urlParts[1]);
          await supabase.storage.from("biz-bucket").remove([filePath]);
        }
      } catch (err) {
        console.error("Error deleting old image:", err);
      }
    }

    // Upload new image
    const timestamp = Date.now();
    const fileExt = (fileName.split(".").pop() || "jpg").toLowerCase();
    const sanitizedSlug = slug
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const filePath = `blogs/${sanitizedSlug}/${blogId}/${timestamp}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("biz-bucket")
      .upload(filePath, fileBlob, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      return { error: uploadError.message || "Upload failed" };
    }

    const { data: publicUrlData } = supabase.storage
      .from("biz-bucket")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    // Update blog table
    const { data, error } = await supabase
      .from("blogs")
      .update({
        featured_image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", blogId)
      .select()
      .single();

    if (error) {
      return { error: error.message || "Failed to save image URL" };
    }

    return { success: true, imageUrl };
  } catch (error) {
    console.error("Error uploading blog image:", error);
    return { error: error.message || "Failed to upload image" };
  }
}

// Public blog functions (no auth required)
export async function getPublishedBlogs(limit = 10, offset = 0) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: blogs, error } = await supabase
      .from("blogs")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        featured_image_url,
        status,
        category_id,
        published_at,
        created_at,
        profiles:user_id(full_name)
      `,
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return { error: error.message };
    }

    // Get total count
    const { count } = await supabase
      .from("blogs")
      .select("id", { count: "exact", head: true })
      .eq("status", "published");

    return { success: true, data: blogs || [], total: count || 0 };
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    return { error: error.message || "Failed to fetch blogs" };
  }
}

export async function getPublishedBlogBySlug(slug) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: blog, error } = await supabase
      .from("blogs")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        content,
        featured_image_url,
        category_id,
        status,
        published_at,
        created_at,
        profiles:user_id(full_name, email)
      `,
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error) {
      return { error: "Blog not found" };
    }

    return { success: true, data: blog };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return { error: error.message || "Failed to fetch blog" };
  }
}
