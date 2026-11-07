import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getPaypalAccessToken, paypalFetch } from "@/lib/paypal";

export async function POST(request: Request) {
  let body: { orderId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!body.orderId) {
    return NextResponse.json({ error: "orderId fehlt." }, { status: 400 });
  }

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("id, siparis_no, tur, odeme_durumu, toplam")
    .eq("id", body.orderId)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json({ error: "Bestellung nicht gefunden." }, { status: 404 });
  }
  if (order.tur !== "teslimat") {
    return NextResponse.json(
      { error: "Diese Bestellung benötigt keine Online-Zahlung." },
      { status: 400 }
    );
  }
  if (order.odeme_durumu === "odendi") {
    return NextResponse.json(
      { error: "Diese Bestellung wurde bereits bezahlt." },
      { status: 409 }
    );
  }

  const accessToken = await getPaypalAccessToken();
  const { ok, data } = await paypalFetch("/v2/checkout/orders", {
    method: "POST",
    accessToken,
    body: {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order.siparis_no,
          custom_id: order.id,
          amount: {
            currency_code: "EUR",
            value: order.toplam.toFixed(2),
          },
        },
      ],
    },
  });

  if (!ok || !data?.id) {
    return NextResponse.json(
      { error: "PayPal-Bestellung konnte nicht erstellt werden." },
      { status: 502 }
    );
  }

  return NextResponse.json({ paypalOrderId: data.id });
}
