import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getPaypalAccessToken, paypalFetch } from "@/lib/paypal";

export async function POST(request: Request) {
  let body: { orderId?: string; paypalOrderId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!body.orderId || !body.paypalOrderId) {
    return NextResponse.json({ error: "Angaben fehlen." }, { status: 400 });
  }

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("id, odeme_durumu, toplam")
    .eq("id", body.orderId)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json({ error: "Bestellung nicht gefunden." }, { status: 404 });
  }

  if (order.odeme_durumu === "odendi") {
    return NextResponse.json({ success: true });
  }

  const accessToken = await getPaypalAccessToken();
  const { ok, data } = await paypalFetch(
    `/v2/checkout/orders/${body.paypalOrderId}/capture`,
    { method: "POST", accessToken }
  );

  const capture = data?.purchase_units?.[0]?.payments?.captures?.[0];

  if (!ok || data?.status !== "COMPLETED" || !capture) {
    return NextResponse.json(
      {
        success: false,
        error: "Zahlung konnte nicht abgeschlossen werden. Bitte erneut versuchen.",
      },
      { status: 402 }
    );
  }

  const paidAmount = Number(capture.amount?.value);
  const currencyOk = capture.amount?.currency_code === "EUR";
  const amountOk = Math.abs(paidAmount - order.toplam) < 0.01;

  if (!currencyOk || !amountOk) {
    return NextResponse.json(
      { success: false, error: "Zahlbetrag stimmt nicht überein." },
      { status: 409 }
    );
  }

  await supabaseAdmin
    .from("orders")
    .update({ odeme_durumu: "odendi", paypal_islem_no: capture.id })
    .eq("id", order.id);

  return NextResponse.json({ success: true });
}
