import { supabaseBrowser } from "@/lib/supabase/client";
import type { RestaurantSettings } from "@/lib/supabase/types";

export async function getSettings(): Promise<RestaurantSettings> {
  const { data, error } = await supabaseBrowser
    .from("restaurant_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data;
}

export async function updateSettings(
  patch: Partial<RestaurantSettings>
): Promise<void> {
  const { error } = await supabaseBrowser
    .from("restaurant_settings")
    .update(patch)
    .eq("id", 1);
  if (error) throw error;
}
