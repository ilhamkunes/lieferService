import { formatPrice, RESTAURANT_NAME } from "@/lib/config";

export type EmailOrderItem = { isim: string; adet: number; birimFiyat: number };

export type EmailOrder = {
  siparisNo: string;
  musteriAdi: string;
  telefon: string;
  tur: "teslimat" | "gelal";
  adres?: string;
  almaSaatiLabel?: string;
  odemeYontemi: "paypal" | "nakit_veya_kart";
  araToplam: number;
  teslimatUcreti: number;
  toplam: number;
  notMetni?: string | null;
  urunler: EmailOrderItem[];
};

function itemsRows(items: EmailOrderItem[]): string {
  return items
    .map(
      (it) =>
        `<tr><td style="padding:4px 0;">${it.adet}× ${it.isim}</td><td style="padding:4px 0;text-align:right;">${formatPrice(
          it.birimFiyat * it.adet
        )}</td></tr>`
    )
    .join("");
}

function wrapper(title: string, body: string): string {
  return `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#171717;">
    <h2 style="color:#f97316;margin-bottom:4px;">${RESTAURANT_NAME}</h2>
    <h3 style="margin-top:0;">${title}</h3>
    ${body}
  </div>`;
}

function totalsTable(order: EmailOrder): string {
  return `<table style="width:100%;border-collapse:collapse;margin-top:12px;">
    ${itemsRows(order.urunler)}
    <tr><td style="padding-top:8px;border-top:1px solid #e5e5e5;">Zwischensumme</td><td style="padding-top:8px;border-top:1px solid #e5e5e5;text-align:right;">${formatPrice(
      order.araToplam
    )}</td></tr>
    ${
      order.teslimatUcreti > 0
        ? `<tr><td>Liefergebühr</td><td style="text-align:right;">${formatPrice(
            order.teslimatUcreti
          )}</td></tr>`
        : ""
    }
    <tr><td style="font-weight:bold;padding-top:4px;">Gesamt</td><td style="font-weight:bold;padding-top:4px;text-align:right;">${formatPrice(
      order.toplam
    )}</td></tr>
  </table>`;
}

export function customerConfirmationEmail(order: EmailOrder): {
  subject: string;
  html: string;
} {
  const typeInfo =
    order.tur === "gelal"
      ? `<p>Abholung${order.almaSaatiLabel ? ` um ${order.almaSaatiLabel} Uhr` : ""}</p>`
      : `<p>Lieferung an: ${order.adres}</p>`;
  const paymentInfo =
    order.odemeYontemi === "paypal"
      ? "<p>Bezahlt mit PayPal.</p>"
      : "<p>Zahlung: im Laden (bar oder Karte).</p>";

  const body = `
    <p>Vielen Dank für deine Bestellung, ${order.musteriAdi}!</p>
    <p><strong>Bestellnummer: #${order.siparisNo}</strong></p>
    ${typeInfo}
    ${totalsTable(order)}
    ${paymentInfo}
    ${order.notMetni ? `<p>Anmerkung: ${order.notMetni}</p>` : ""}
  `;

  return {
    subject: `Bestellbestätigung #${order.siparisNo}`,
    html: wrapper("Bestellbestätigung", body),
  };
}

export function restaurantNotificationEmail(order: EmailOrder): {
  subject: string;
  html: string;
} {
  const typeInfo =
    order.tur === "gelal"
      ? `<p><strong>Abholung</strong>${order.almaSaatiLabel ? ` um ${order.almaSaatiLabel} Uhr` : ""}</p>`
      : `<p><strong>Lieferung</strong> an: ${order.adres}</p>`;

  const body = `
    <p><strong>Neue Bestellung #${order.siparisNo}</strong></p>
    ${typeInfo}
    <p>${order.musteriAdi} · ${order.telefon}</p>
    ${totalsTable(order)}
    <p>${order.odemeYontemi === "paypal" ? "PayPal bezahlt" : "Zahlung im Laden"}</p>
    ${order.notMetni ? `<p>Notiz: ${order.notMetni}</p>` : ""}
  `;

  return {
    subject: `Neue Bestellung #${order.siparisNo}`,
    html: wrapper("Neue Bestellung", body),
  };
}
