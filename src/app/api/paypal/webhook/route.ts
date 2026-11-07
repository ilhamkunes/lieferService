import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getPaypalAccessToken, paypalFetch } from "@/lib/paypal";
import { notifyNewOrder } from "@/lib/order-emails";

export async function POST(request: Request) {
  const event = await request.json().catch(() => null);
  if (!event) {
    return NextResponse.json({ error: "Ungültiger Webhook-Body." }, { status: 400 });
  }

  const headers = request.headers;
  const accessToken = await getPaypalAccessToken();
  const { data: verification } = await paypalFetch(
    "/v1/notifications/verify-webhook-signature",
    {
      method: "POST",
      accessToken,
      body: {
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_time: headers.get("paypal-transmission-time"),
        cert_url: headers.get("paypal-cert-url"),
        auth_algo: headers.get("paypal-auth-algo"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: event,
      },
    }
  );

  if (verification?.verification_status !== "SUCCESS") {
    return NextResponse.json({ error: "Signatur ungültig." }, { status: 400 });
  }

  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const resource = event.resource;
    const orderId: string | undefined = resource?.custom_id;
    if (orderId) {
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("id, odeme_durumu")
        .eq("id", orderId)
        .maybeSingle();

      if (order && order.odeme_durumu !== "odendi") {
        await supabaseAdmin
          .from("orders")
          .update({ odeme_durumu: "odendi", paypal_islem_no: resource.id })
          .eq("id", order.id);
        await notifyNewOrder(order.id);
      }
    }
  }

  return NextResponse.json({ received: true });
}
