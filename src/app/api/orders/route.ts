import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAvailability } from "@/lib/availability";
import { isValidPickupTime } from "@/lib/pickup";
import { isValidEmail } from "@/lib/validation";
import { sendOrderEmails } from "@/lib/order-emails";
import type { OpeningHour, RestaurantSettings } from "@/lib/supabase/types";

type OrderItemInput = { productId: string; adet: number };

type OrderRequestBody = {
  tur: "teslimat" | "gelal";
  musteri: { isim: string; telefon: string; eposta: string };
  items: OrderItemInput[];
  not?: string;
  teslimat?: {
    sokak: string;
    numara: string;
    posta_kodu: string;
    sehir: string;
    kapi_kat_notu?: string;
  };
  alma_saati?: string;
};

export async function POST(request: Request) {
  let body: OrderRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!body || (body.tur !== "teslimat" && body.tur !== "gelal")) {
    return NextResponse.json({ error: "Ungültiger Bestelltyp." }, { status: 400 });
  }

  const musteri = body.musteri;
  if (
    !musteri?.isim?.trim() ||
    !musteri?.telefon?.trim() ||
    !isValidEmail(musteri?.eposta ?? "")
  ) {
    return NextResponse.json(
      { error: "Bitte Name, Telefon und eine gültige E-Mail angeben." },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Warenkorb ist leer." }, { status: 400 });
  }

  // Giris yapmis musteriyi dogrula (varsa). Token sadece sunucuda
  // dogrulanir - istemciden gelen bir musteriId asla dogrudan guvenilmez.
  let musteriId: string | null = null;
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length);
    const { data: userData } = await supabaseAdmin.auth.getUser(token);
    musteriId = userData.user?.id ?? null;
  }

  const { data: hoursData, error: hoursErr } = await supabaseAdmin
    .from("opening_hours")
    .select("gun, acilis, kapanis, kapali");
  const { data: settingsData, error: settingsErr } = await supabaseAdmin
    .from("restaurant_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (hoursErr || !hoursData || settingsErr || !settingsData) {
    return NextResponse.json(
      { error: "Serverfehler (Öffnungszeiten/Einstellungen)." },
      { status: 500 }
    );
  }
  const hours = hoursData as OpeningHour[];
  const settings = settingsData as RestaurantSettings;
  const now = new Date();
  const availability = getAvailability(hours, settings, now);
  if (!availability.isOpen) {
    return NextResponse.json(
      { error: "Wir sind aktuell geschlossen und nehmen keine Bestellungen an." },
      { status: 409 }
    );
  }
  if (body.tur === "teslimat" && !availability.deliveryAvailable) {
    return NextResponse.json(
      { error: "Lieferung ist aktuell pausiert." },
      { status: 409 }
    );
  }
  if (body.tur === "gelal" && !availability.pickupAvailable) {
    return NextResponse.json(
      { error: "Abholung ist aktuell pausiert." },
      { status: 409 }
    );
  }

  const productIds = [...new Set(body.items.map((i) => i.productId))];
  const { data: products, error: productsErr } = await supabaseAdmin
    .from("products")
    .select("id, isim, fiyat, mevcut_mu")
    .in("id", productIds);
  if (productsErr || !products) {
    return NextResponse.json({ error: "Serverfehler (Produkte)." }, { status: 500 });
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  const orderItems: {
    urun_id: string;
    urun_adi: string;
    adet: number;
    birim_fiyat: number;
  }[] = [];
  let araToplam = 0;

  for (const item of body.items) {
    const product = productMap.get(item.productId);
    const adet = Number(item.adet);
    if (!product || !Number.isInteger(adet) || adet <= 0) {
      return NextResponse.json(
        { error: "Ungültiger Artikel im Warenkorb." },
        { status: 400 }
      );
    }
    if (!product.mevcut_mu) {
      return NextResponse.json(
        {
          error: `"${product.isim}" ist aktuell nicht verfügbar. Bitte aus dem Warenkorb entfernen.`,
        },
        { status: 409 }
      );
    }
    araToplam += product.fiyat * adet;
    orderItems.push({
      urun_id: product.id,
      urun_adi: product.isim,
      adet,
      birim_fiyat: product.fiyat,
    });
  }

  let teslimatUcreti = 0;
  let orderFields: Record<string, unknown> = {};

  if (body.tur === "teslimat") {
    const teslimat = body.teslimat;
    if (
      !teslimat?.sokak?.trim() ||
      !teslimat?.numara?.trim() ||
      !teslimat?.posta_kodu?.trim() ||
      !teslimat?.sehir?.trim()
    ) {
      return NextResponse.json(
        { error: "Bitte alle Adressfelder ausfüllen." },
        { status: 400 }
      );
    }

    const { data: zone, error: zoneErr } = await supabaseAdmin
      .from("delivery_zones")
      .select("posta_kodu, teslimat_ucreti, minimum_siparis")
      .eq("posta_kodu", teslimat.posta_kodu.trim())
      .eq("aktif", true)
      .maybeSingle();
    if (zoneErr) {
      return NextResponse.json(
        { error: "Serverfehler (Liefergebiet)." },
        { status: 500 }
      );
    }
    if (!zone) {
      return NextResponse.json(
        { error: "Leider liefern wir nicht in dieses Gebiet." },
        { status: 409 }
      );
    }
    if (araToplam < zone.minimum_siparis) {
      return NextResponse.json(
        {
          error: `Mindestbestellwert für dieses Gebiet ist ${zone.minimum_siparis.toFixed(
            2
          )} €.`,
        },
        { status: 409 }
      );
    }

    teslimatUcreti = zone.teslimat_ucreti;
    orderFields = {
      sokak: teslimat.sokak.trim(),
      numara: teslimat.numara.trim(),
      posta_kodu: teslimat.posta_kodu.trim(),
      sehir: teslimat.sehir.trim(),
      kapi_kat_notu: teslimat.kapi_kat_notu?.trim() || null,
      odeme_yontemi: "paypal",
    };
  } else {
    if (!body.alma_saati) {
      return NextResponse.json(
        { error: "Bitte eine Abholzeit wählen." },
        { status: 400 }
      );
    }
    const almaSaati = new Date(body.alma_saati);
    if (!isValidPickupTime(hours, almaSaati, now)) {
      return NextResponse.json(
        {
          error: "Die gewählte Abholzeit ist nicht mehr gültig. Bitte neu wählen.",
        },
        { status: 409 }
      );
    }
    orderFields = {
      alma_saati: almaSaati.toISOString(),
      odeme_yontemi: "nakit_veya_kart",
    };
  }

  const toplam = araToplam + teslimatUcreti;

  const { data: order, error: orderErr } = await supabaseAdmin
    .from("orders")
    .insert({
      musteri_adi: musteri.isim.trim(),
      telefon: musteri.telefon.trim(),
      eposta: musteri.eposta.trim(),
      musteri_id: musteriId,
      tur: body.tur,
      ara_toplam: araToplam,
      teslimat_ucreti: teslimatUcreti,
      toplam,
      not_metni: body.not?.trim() || null,
      ...orderFields,
    })
    .select("id, siparis_no, alma_saati, toplam")
    .single();

  if (orderErr || !order) {
    return NextResponse.json(
      { error: "Bestellung konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }

  const { error: itemsErr } = await supabaseAdmin
    .from("order_items")
    .insert(orderItems.map((it) => ({ ...it, siparis_id: order.id })));

  if (itemsErr) {
    await supabaseAdmin.from("orders").delete().eq("id", order.id);
    return NextResponse.json(
      { error: "Bestellung konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }

  // Gel-al siparisi direkt onaylanir, odeme dukkanda yapilacagi icin
  // e-postalari hemen gonderiyoruz. Teslimat siparisleri odeme
  // tamamlaninca (PayPal capture) e-posta alir.
  if (body.tur === "gelal") {
    await sendOrderEmails(order.id);
  }

  return NextResponse.json({
    id: order.id,
    siparisNo: order.siparis_no,
    tur: body.tur,
    toplam: order.toplam,
    almaSaati: order.alma_saati,
  });
}
