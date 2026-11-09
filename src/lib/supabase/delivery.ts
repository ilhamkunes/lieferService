import { supabaseBrowser } from "@/lib/supabase/client";

export type DeliveryZone = {
  posta_kodu: string;
  teslimat_ucreti: number;
  minimum_siparis: number;
  ucretsiz_esik: number | null;
};

// Sepet tutari ucretsiz-esigi karsiliyorsa teslimat ucretini 0 yapar.
export function effectiveDeliveryFee(zone: DeliveryZone, cartTotal: number): number {
  if (zone.ucretsiz_esik != null && cartTotal >= zone.ucretsiz_esik) {
    return 0;
  }
  return zone.teslimat_ucreti;
}

export async function findDeliveryZone(
  postalCode: string
): Promise<DeliveryZone | null> {
  const { data, error } = await supabaseBrowser
    .from("delivery_zones")
    .select("posta_kodu, teslimat_ucreti, minimum_siparis, ucretsiz_esik")
    .eq("posta_kodu", postalCode.trim())
    .eq("aktif", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}
