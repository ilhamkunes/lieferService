"use client";

import { useState } from "react";
import { useEffect } from "react";
import { getMyOrders, getMyOrderItems } from "@/lib/supabase/account";
import type { AdminOrderItem, CustomerOrder } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/config";

const DURUM_LABEL: Record<string, string> = {
  yeni: "Neu",
  hazirlaniyor: "In Zubereitung",
  teslime_hazir: "Bereit",
  tamamlandi: "Abgeschlossen",
  reddedildi: "Abgelehnt",
};

const ZAHLUNG_LABEL: Record<string, string> = {
  paypal: "PayPal",
  nakit_veya_kart: "Vor Ort (bar oder Karte)",
};

function OrderRow({ order }: { order: CustomerOrder }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AdminOrderItem[] | null>(null);

  function toggle() {
    setOpen((o) => !o);
    if (!items) getMyOrderItems(order.id).then(setItems);
  }

  return (
    <div className="rounded-lg border border-neutral-200 text-sm">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between p-3 text-left"
      >
        <div>
          <p className="font-medium text-neutral-900">#{order.siparis_no}</p>
          <p className="text-neutral-500">
            {new Date(order.created_at).toLocaleDateString("de-DE")} ·{" "}
            {order.tur === "teslimat" ? "Lieferung" : "Abholung"} ·{" "}
            {DURUM_LABEL[order.siparis_durumu] ?? order.siparis_durumu}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-neutral-900">{formatPrice(order.toplam)}</p>
          <span className={`text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}>
            ▾
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-neutral-100 px-3 py-3">
          {items === null ? (
            <p className="text-neutral-400">Wird geladen…</p>
          ) : (
            <>
              <div className="space-y-1.5">
                {items.map((it) => (
                  <div key={it.id} className="flex justify-between text-neutral-700">
                    <span>
                      {it.adet}× {it.urun_adi}
                    </span>
                    <span>{formatPrice(it.adet * it.birim_fiyat)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 space-y-1 border-t border-neutral-100 pt-2 text-neutral-700">
                <div className="flex justify-between">
                  <span>Zwischensumme</span>
                  <span>{formatPrice(order.ara_toplam)}</span>
                </div>
                {order.tur === "teslimat" && (
                  <div className="flex justify-between">
                    <span>Liefergebühr</span>
                    <span>{formatPrice(order.teslimat_ucreti)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-neutral-900">
                  <span>Gesamt</span>
                  <span>{formatPrice(order.toplam)}</span>
                </div>
                <div className="flex justify-between pt-1 text-neutral-500">
                  <span>Bezahlt mit</span>
                  <span>{ZAHLUNG_LABEL[order.odeme_yontemi] ?? order.odeme_yontemi}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function OrderHistory() {
  const [orders, setOrders] = useState<CustomerOrder[] | null>(null);

  useEffect(() => {
    getMyOrders().then(setOrders);
  }, []);

  return (
    <section>
      <h2 className="mb-2 font-semibold text-neutral-900">Meine Bestellungen</h2>
      {orders === null && <p className="text-sm text-neutral-400">Wird geladen…</p>}
      {orders?.length === 0 && (
        <p className="text-sm text-neutral-500">Noch keine Bestellung.</p>
      )}
      <div className="space-y-2">
        {orders?.map((o) => (
          <OrderRow key={o.id} order={o} />
        ))}
      </div>
    </section>
  );
}
