import { supabaseBrowser } from "@/lib/supabase/client";
import type { AdminOrder } from "@/lib/supabase/types";

export async function searchOrderHistory(params: {
  date?: string;
  query?: string;
}): Promise<AdminOrder[]> {
  let q = supabaseBrowser
    .from("orders")
    .select(
      "id, siparis_no, musteri_adi, telefon, eposta, tur, sokak, numara, posta_kodu, sehir, kapi_kat_notu, alma_saati, odeme_yontemi, odeme_durumu, siparis_durumu, tahmini_hazir_saat, ara_toplam, teslimat_ucreti, toplam, not_metni, red_sebebi, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (params.date) {
    q = q
      .gte("created_at", `${params.date}T00:00:00`)
      .lte("created_at", `${params.date}T23:59:59`);
  }
  if (params.query) {
    const like = `%${params.query}%`;
    q = q.or(
      `siparis_no.ilike.${like},musteri_adi.ilike.${like},sokak.ilike.${like},sehir.ilike.${like}`
    );
  }

  const { data, error } = await q;
  if (error) throw error;
  return data as AdminOrder[];
}
