"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/supabase/server";

export async function signup(formData) {
  const supabase = await createServerSupabaseClient();

  const email = formData.get("email");
  const password = formData.get("password");
  const fullName = formData.get("fullName");
  const role = formData.get("role");

  // Check if email exists in Profiles table
  const { data: existingProfile } = await supabase
    .from("Profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (existingProfile) {
    return {
      error: "This email is already registered. Please sign in instead.",
    };
  }

  // Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify`,
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  revalidatePath("/", "layout");
  redirect("/auth/verify-pending");
  return { success: true, needsVerification: true };
}

export async function login(formData) {
  const supabase = await createServerSupabaseClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  // Get user profile/role
  const { data: userData } = await supabase.auth.getUser();
  if (userData.user) {
    const { data: profile } = await supabase
      .from("Profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    // Store role in session or cookie if needed
    if (profile?.role) {
      // This will be available in server components
    }
  }

  revalidatePath("/", "layout");
  // Don't redirect here - let client sync session and redirect
  return { success: true, message: "Login successful" };
}

export async function signout() {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  // Don't redirect here - let client refresh and redirect
  return { success: true, message: "Signed out successfully" };
}

export async function verifyAndCreateProfile(role) {
  const supabase = await createServerSupabaseClient();

  try {
    // Get current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "Authentication failed. Please try again.",
      };
    }

    // Check if user profile already exists
    const { data: existingProfile, error: profileError } = await supabase
      .from("Profiles")
      .select("id, role")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 means no rows found, which is expected for new users
      return {
        success: false,
        error: "Failed to check profile: " + profileError.message,
      };
    }

    // If profile exists, return success
    if (existingProfile) {
      revalidatePath("/", "layout");
      return {
        success: true,
        message: "Login successful",
        role: existingProfile.role,
      };
    }

    // update auth user metadata with role
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        role: role || "buyer",
      },
    });

    if (updateError) {
      return {
        success: false,
        error: "Failed to update user metadata: " + updateError.message,
      };
    }

    // Create new profile for first-time users
    const userRole = role || "buyer";
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email.split("@")[0],
        role: userRole,
        avatar_url: user.user_metadata?.avatar_url || null,
        created_at: new Date(),
      },
    ]);

    if (insertError) {
      return {
        success: false,
        error: "Failed to create profile: " + insertError.message,
      };
    }

    revalidatePath("/", "layout");
    return {
      success: true,
      message: "Profile created successfully",
      role: userRole,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Something went wrong. Please try again.",
    };
  }
}
