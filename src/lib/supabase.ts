import "server-only";

import { createClient } from "@supabase/supabase-js";
import { env, hasSupabase } from "@/lib/env";

export function getSupabaseClient() {
  if (!hasSupabase()) {
    throw new Error("Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY as string, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}
