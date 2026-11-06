import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Tarayicida ve client component'lerde kullanilacak Supabase istemcisi.
// Sadece "anon" anahtari kullanir; RLS kurallarina tabidir.
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);
