import { supabaseBrowser } from "@/lib/supabase/client";
import type { Category, OpeningHour, Product } from "@/lib/supabase/types";

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabaseBrowser
    .from("categories")
    .select("id, isim, sira")
    .order("sira", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabaseBrowser
    .from("products")
    .select(
      "id, kategori_id, isim, aciklama, fiyat, fotograf_url, alerjenler, katki_maddeleri, mevcut_mu, sira, one_cikan"
    )
    .order("sira", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getOpeningHours(): Promise<OpeningHour[]> {
  const { data, error } = await supabaseBrowser
    .from("opening_hours")
    .select("gun, acilis, kapanis, kapali");
  if (error) throw error;
  return data;
}
