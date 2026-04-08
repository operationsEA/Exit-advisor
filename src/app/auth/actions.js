"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/supabase/server";

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
  redirect("/dashboard");
}

export async function signup(formData) {
  const supabase = await createServerSupabaseClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/auth/verify-pending");
}

export async function signout() {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/auth/login");
}
