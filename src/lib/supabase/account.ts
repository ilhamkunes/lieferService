import { supabaseBrowser } from "@/lib/supabase/client";
import type {
  AdminOrderItem,
  CustomerAddress,
  CustomerOrder,
} from "@/lib/supabase/types";

export async function getMyAddresses(): Promise<CustomerAddress[]> {
  const { data, error } = await supabaseBrowser
    .from("customer_addresses")
    .select("id, musteri_id, etiket, sokak, numara, posta_kodu, sehir, kapi_kat_notu")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

function normalizeAddressPart(s: string): string {
  return s.trim().toLowerCase();
}

export async function addMyAddress(input: {
  etiket: string;
  sokak: string;
  numara: string;
  posta_kodu: string;
  sehir: string;
  kapi_kat_notu: string;
}): Promise<void> {
  const { data: userData } = await supabaseBrowser.auth.getUser();
  if (!userData.user) throw new Error("Nicht angemeldet.");

  // Ayni adres (sokak+numara+PLZ) zaten kayitliysa tekrar eklemeden onu
  // kullan - her siparişte ayni adresin kopyalanmasini onler.
  const existing = await getMyAddresses();
  const duplicate = existing.find(
    (a) =>
      normalizeAddressPart(a.sokak) === normalizeAddressPart(input.sokak) &&
      normalizeAddressPart(a.numara) === normalizeAddressPart(input.numara) &&
      normalizeAddressPart(a.posta_kodu) === normalizeAddressPart(input.posta_kodu)
  );
  if (duplicate) return;

  const { error } = await supabaseBrowser.from("customer_addresses").insert({
    musteri_id: userData.user.id,
    etiket: input.etiket.trim() || "Zuhause",
    sokak: input.sokak.trim(),
    numara: input.numara.trim(),
    posta_kodu: input.posta_kodu.trim(),
    sehir: input.sehir.trim(),
    kapi_kat_notu: input.kapi_kat_notu.trim() || null,
  });
  if (error) throw error;
}

export async function deleteMyAddress(id: string): Promise<void> {
  const { error } = await supabaseBrowser.from("customer_addresses").delete().eq("id", id);
  if (error) throw error;
}

export async function getMyOrders(): Promise<CustomerOrder[]> {
  const { data, error } = await supabaseBrowser
    .from("orders")
    .select(
      "id, siparis_no, tur, odeme_durumu, odeme_yontemi, siparis_durumu, ara_toplam, teslimat_ucreti, toplam, created_at"
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getMyOrderItems(orderId: string): Promise<AdminOrderItem[]> {
  const { data, error } = await supabaseBrowser
    .from("order_items")
    .select("id, urun_adi, adet, birim_fiyat")
    .eq("siparis_id", orderId);
  if (error) throw error;
  return data;
}

export async function updateMyProfile(input: {
  isim: string;
  telefon: string;
}): Promise<void> {
  const { error } = await supabaseBrowser.auth.updateUser({
    data: { isim: input.isim.trim(), telefon: input.telefon.trim() },
  });
  if (error) throw error;
}
