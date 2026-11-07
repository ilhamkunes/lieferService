"use client";

import { useEffect, useState } from "react";
import { getMyOrders } from "@/lib/supabase/account";
import type { CustomerOrder } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/config";

const DURUM_LABEL: Record<string, string> = {
  yeni: "Neu",
  hazirlaniyor: "In Zubereitung",
  teslime_hazir: "Bereit",
  tamamlandi: "Abgeschlossen",
  reddedildi: "Abgelehnt",
};

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
          <div
            key={o.id}
            className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 text-sm"
          >
            <div>
              <p className="font-medium text-neutral-900">#{o.siparis_no}</p>
              <p className="text-neutral-500">
                {new Date(o.created_at).toLocaleDateString("de-DE")} ·{" "}
                {o.tur === "teslimat" ? "Lieferung" : "Abholung"} ·{" "}
                {DURUM_LABEL[o.siparis_durumu] ?? o.siparis_durumu}
              </p>
            </div>
            <p className="font-semibold text-neutral-900">{formatPrice(o.toplam)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
