import { supabaseAdmin } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { sendPushToAdmins } from "@/lib/push";
import {
  customerConfirmationEmail,
  restaurantNotificationEmail,
} from "@/lib/email-templates";
import { formatPrice } from "@/lib/config";

export async function notifyNewOrder(orderId: string): Promise<void> {
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select(
      "siparis_no, musteri_adi, telefon, eposta, tur, sokak, numara, posta_kodu, sehir, alma_saati, odeme_yontemi, ara_toplam, teslimat_ucreti, toplam, not_metni"
    )
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return;

  const { data: items } = await supabaseAdmin
    .from("order_items")
    .select("urun_adi, adet, birim_fiyat")
    .eq("siparis_id", orderId);

  const almaSaatiLabel = order.alma_saati
    ? new Date(order.alma_saati).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : undefined;

  const emailOrder = {
    siparisNo: order.siparis_no,
    musteriAdi: order.musteri_adi,
    telefon: order.telefon,
    tur: order.tur as "teslimat" | "gelal",
    adres:
      order.tur === "teslimat"
        ? `${order.sokak} ${order.numara}, ${order.posta_kodu} ${order.sehir}`
        : undefined,
    almaSaatiLabel,
    odemeYontemi: order.odeme_yontemi as "paypal" | "nakit_veya_kart",
    araToplam: order.ara_toplam,
    teslimatUcreti: order.teslimat_ucreti,
    toplam: order.toplam,
    notMetni: order.not_metni,
    urunler: (items ?? []).map((it) => ({
      isim: it.urun_adi,
      adet: it.adet,
      birimFiyat: it.birim_fiyat,
    })),
  };

  await sendEmail({ to: order.eposta, ...customerConfirmationEmail(emailOrder) });
  if (process.env.RESTAURANT_NOTIFY_EMAIL) {
    await sendEmail({
      to: process.env.RESTAURANT_NOTIFY_EMAIL,
      ...restaurantNotificationEmail(emailOrder),
    });
  }

  await sendPushToAdmins({
    title: `Neue Bestellung #${order.siparis_no}`,
    body: `${order.tur === "gelal" ? "Abholung" : "Lieferung"} · ${formatPrice(order.toplam)}`,
    url: "/admin/bestellungen",
  });
}
