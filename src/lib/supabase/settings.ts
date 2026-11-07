import { supabaseBrowser } from "@/lib/supabase/client";
import type { RestaurantSettings } from "@/lib/supabase/types";

export async function getRestaurantSettings(): Promise<RestaurantSettings> {
  const { data, error } = await supabaseBrowser
    .from("restaurant_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data;
}
