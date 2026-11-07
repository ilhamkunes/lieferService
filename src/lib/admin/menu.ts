import { supabaseBrowser } from "@/lib/supabase/client";
import type { DeliveryZoneAdmin, OpeningHour } from "@/lib/supabase/types";

export async function addCategory(isim: string, sira: number): Promise<void> {
  const { error } = await supabaseBrowser.from("categories").insert({ isim, sira });
  if (error) throw error;
}

export async function updateCategorySira(id: string, sira: number): Promise<void> {
  const { error } = await supabaseBrowser
    .from("categories")
    .update({ sira })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabaseBrowser.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleProductAvailability(
  id: string,
  mevcut_mu: boolean
): Promise<void> {
  const { error } = await supabaseBrowser
    .from("products")
    .update({ mevcut_mu })
    .eq("id", id);
  if (error) throw error;
}

export type ProductInput = {
  isim: string;
  aciklama: string;
  fiyat: number;
  kategori_id: string;
  fotograf_url: string;
  alerjenler: string[];
};

function productPayload(input: ProductInput) {
  return {
    isim: input.isim.trim(),
    aciklama: input.aciklama.trim() || null,
    fiyat: input.fiyat,
    kategori_id: input.kategori_id,
    fotograf_url: input.fotograf_url.trim() || null,
    alerjenler: input.alerjenler,
  };
}

export async function createProduct(input: ProductInput): Promise<void> {
  const { error } = await supabaseBrowser
    .from("products")
    .insert(productPayload(input));
  if (error) throw error;
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<void> {
  const { error } = await supabaseBrowser
    .from("products")
    .update(productPayload(input))
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabaseBrowser.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function updateOpeningHour(
  gun: number,
  patch: Partial<OpeningHour>
): Promise<void> {
  const { error } = await supabaseBrowser
    .from("opening_hours")
    .update(patch)
    .eq("gun", gun);
  if (error) throw error;
}

export async function getDeliveryZonesAdmin(): Promise<DeliveryZoneAdmin[]> {
  const { data, error } = await supabaseBrowser
    .from("delivery_zones")
    .select("id, posta_kodu, teslimat_ucreti, minimum_siparis, aktif")
    .order("posta_kodu");
  if (error) throw error;
  return data;
}

export async function addDeliveryZone(input: {
  posta_kodu: string;
  teslimat_ucreti: number;
  minimum_siparis: number;
}): Promise<void> {
  const { error } = await supabaseBrowser.from("delivery_zones").insert(input);
  if (error) throw error;
}

export async function updateDeliveryZone(
  id: string,
  patch: Partial<DeliveryZoneAdmin>
): Promise<void> {
  const { error } = await supabaseBrowser
    .from("delivery_zones")
    .update(patch)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteDeliveryZone(id: string): Promise<void> {
  const { error } = await supabaseBrowser.from("delivery_zones").delete().eq("id", id);
  if (error) throw error;
}
