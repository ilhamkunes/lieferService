import { supabaseBrowser } from "@/lib/supabase/client";
import type { AdminOrder, AdminOrderItem, SiparisDurumu } from "@/lib/supabase/types";

const ORDER_COLUMNS =
  "id, siparis_no, musteri_adi, telefon, eposta, tur, sokak, numara, posta_kodu, sehir, kapi_kat_notu, alma_saati, odeme_yontemi, odeme_durumu, siparis_durumu, tahmini_hazir_saat, ara_toplam, teslimat_ucreti, toplam, not_metni, red_sebebi, created_at";

// Odenmemis teslimat siparisleri panelde gorunmesin (PayPal tamamlanmamis
// olabilir) - gel-al siparisleri her zaman gorunur, odemesi dukkanda.
export async function getActiveOrders(): Promise<AdminOrder[]> {
  const { data, error } = await supabaseBrowser
    .from("orders")
    .select(ORDER_COLUMNS)
    .in("siparis_durumu", ["yeni", "hazirlaniyor", "teslime_hazir", "tamamlandi"])
    .or("tur.eq.gelal,odeme_durumu.eq.odendi")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as AdminOrder[];
}

export async function getOrderItems(orderId: string): Promise<AdminOrderItem[]> {
  const { data, error } = await supabaseBrowser
    .from("order_items")
    .select("id, urun_adi, adet, birim_fiyat")
    .eq("siparis_id", orderId);
  if (error) throw error;
  return data;
}

export async function acceptOrder(orderId: string, minutes: number): Promise<void> {
  const tahminiHazir = new Date(Date.now() + minutes * 60_000).toISOString();
  const { error } = await supabaseBrowser
    .from("orders")
    .update({ siparis_durumu: "hazirlaniyor", tahmini_hazir_saat: tahminiHazir })
    .eq("id", orderId);
  if (error) throw error;
}

export async function advanceOrder(
  orderId: string,
  next: SiparisDurumu
): Promise<void> {
  const { error } = await supabaseBrowser
    .from("orders")
    .update({ siparis_durumu: next })
    .eq("id", orderId);
  if (error) throw error;
}

export async function rejectOrder(orderId: string, reason: string): Promise<void> {
  const { error } = await supabaseBrowser
    .from("orders")
    .update({ siparis_durumu: "reddedildi", red_sebebi: reason })
    .eq("id", orderId);
  if (error) throw error;
}
