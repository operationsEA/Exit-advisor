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
      .from("Profiles")
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
      .from("Profiles")
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
    const { data, error } = await supabase
      .from("Profiles")
      .update(updates)
      .eq("id", userId)
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data?.[0] };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
