import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("🔧 Supabase config:", {
  url: supabaseUrl ? "✅ Loaded" : "❌ Missing",
  keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0,
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase credentials in .env file");
  console.error(
    "Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
