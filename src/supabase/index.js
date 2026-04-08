// Default browser client (for backwards compatibility and direct imports)
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

// Export SSR clients and helpers for structured imports
export { createServerSupabaseClient } from "./server";
export { createBrowserSupabaseClient } from "./client";
export {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
} from "./auth-helpers";
