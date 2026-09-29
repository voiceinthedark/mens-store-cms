// filepath: packages/api/src/utils/supabase.ts

import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

/**
 * Server-side Supabase client using the service role key. This bypasses
 * Row Level Security, which is required for the API to upload/delete
 * files on behalf of authenticated CMS admins.
 *
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the client/browser.
 */
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
