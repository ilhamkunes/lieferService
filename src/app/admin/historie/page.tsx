"use client";

import { useEffect, useState } from "react";
import { searchOrderHistory } from "@/lib/admin/history";
import type { AdminOrder } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/config";

export default function HistoriePage() {
  const [date, setDate] = useState("");
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    searchOrderHistory({ date: date || undefined, query: query || undefined }).then(
      setOrders
    );
  }, [date, query]);

  const onlineTotal = orders
    .filter((o) => o.odeme_yontemi === "paypal")
    .reduce((sum, o) => sum + o.toplam, 0);
  const ladenTotal = orders
    .filter((o) => o.odeme_yontemi === "nakit_veya_kart")
    .reduce((sum, o) => sum + o.toplam, 0);

  return (
    <main className="px-4 py-4 pb-24">
      <div className="mb-4 flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
        <input
          placeholder="Bestellnr., Name oder Adresse"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        {orders.map((o) => (
          <div
            key={o.id}
            className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 text-sm"
          >
            <div>
              <p className="font-medium text-neutral-900">
                {new Date(o.created_at).toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                · #{o.siparis_no}
              </p>
              <p className="text-neutral-500">
                {o.tur === "gelal"
                  ? "Abholung"
                  : `${o.sokak} ${o.numara}, ${o.sehir}`}
              </p>
            </div>
            <p className="font-semibold text-neutral-900">{formatPrice(o.toplam)}</p>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="py-8 text-center text-sm text-neutral-400">
            Keine Bestellungen gefunden.
          </p>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-white px-4 py-3 text-sm">
        <div className="flex justify-between font-semibold text-neutral-900">
          <span>{orders.length} Bestellungen</span>
          <span>{formatPrice(onlineTotal + ladenTotal)}</span>
        </div>
        <div className="flex justify-between text-neutral-500">
          <span>Online (PayPal): {formatPrice(onlineTotal)}</span>
          <span>Im Laden: {formatPrice(ladenTotal)}</span>
        </div>
      </div>
    </main>
  );
}
