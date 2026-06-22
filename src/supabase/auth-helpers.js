/**
 * Profile management utilities for Supabase
 */

export const createUserProfile = async (
  supabase,
  userId,
  email,
  fullName,
  role,
) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          id: userId,
          email: email,
          full_name: fullName,
          role: role,
        },
      ])
      .select();

    await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        role: role,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data?.[0] };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const getUserProfile = async (supabase, userId) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const updateUserProfile = async (supabase, userId, updates) => {
  try {
    console.log({ updates });
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    // Sync relevant fields to auth metadata
    const authMetadata = {};
    if (updates.full_name) authMetadata.full_name = updates.full_name;
    if (updates.role) authMetadata.role = updates.role;
    if (updates.avatar_url) authMetadata.avatar_url = updates.avatar_url;

    if (Object.keys(authMetadata).length > 0) {
      await supabase.auth.updateUser({ data: authMetadata });
    }

    return { success: true, user: data?.[0] };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
