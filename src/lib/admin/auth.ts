import { supabaseBrowser } from "@/lib/supabase/client";

export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await supabaseBrowser.rpc("is_admin");
  if (error) return false;
  return !!data;
}
