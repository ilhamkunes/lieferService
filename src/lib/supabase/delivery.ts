import { supabaseBrowser } from "@/lib/supabase/client";

export type DeliveryZone = {
  posta_kodu: string;
  teslimat_ucreti: number;
  minimum_siparis: number;
};

export async function findDeliveryZone(
  postalCode: string
): Promise<DeliveryZone | null> {
  const { data, error } = await supabaseBrowser
    .from("delivery_zones")
    .select("posta_kodu, teslimat_ucreti, minimum_siparis")
    .eq("posta_kodu", postalCode.trim())
    .eq("aktif", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}
