// Default browser client (for backwards compatibility and direct imports)
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

/**
 * Creates a plain anon Supabase client with no cookie handling.
 * Use this in server actions/components that fetch PUBLIC data so
 * that Next.js can statically render the route without triggering
 * the dynamic-server-usage error from `cookies()`.
 */
export function createPublicSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

// Export SSR clients and helpers for structured imports
export { createServerSupabaseClient } from "./server";
export { createBrowserSupabaseClient } from "./client";
export {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
} from "./auth-helpers";
