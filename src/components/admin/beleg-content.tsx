"use client";

import { useEffect, useState } from "react";
import { getOrderById, getOrderItems } from "@/lib/admin/orders";
import type { AdminOrder, AdminOrderItem } from "@/lib/supabase/types";
import { formatPrice, RESTAURANT_NAME } from "@/lib/config";

export function BelegContent({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [items, setItems] = useState<AdminOrderItem[]>([]);

  useEffect(() => {
    getOrderById(orderId).then(setOrder);
    getOrderItems(orderId).then(setItems);
  }, [orderId]);

  if (!order) {
    return <p className="p-4 text-sm text-neutral-400">Wird geladen…</p>;
  }

  const orderTimeLabel =
    order.tur === "gelal" && order.alma_saati
      ? new Date(order.alma_saati).toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "ASAP";

  return (
    <div className="mx-auto max-w-sm p-6 text-sm text-black">
      <div className="mb-4 flex justify-end print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Drucken
        </button>
      </div>

      <h1 className="text-center text-lg font-bold">{RESTAURANT_NAME}</h1>
      <p className="text-center text-xs text-neutral-500">Küchenbeleg</p>
      <hr className="my-3 border-dashed" />

      <p className="font-semibold">#{order.siparis_no}</p>
      <p>
        {order.tur === "gelal"
          ? `Abholung · ${orderTimeLabel} Uhr`
          : "Lieferung · ASAP"}
      </p>
      {order.tur === "teslimat" && (
        <p>
          {order.sokak} {order.numara}, {order.posta_kodu} {order.sehir}
        </p>
      )}
      {order.kapi_kat_notu && <p>Hinweis: {order.kapi_kat_notu}</p>}
      <p>
        {order.musteri_adi} · {order.telefon}
      </p>

      <hr className="my-3 border-dashed" />

      <table className="w-full">
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td className="py-0.5">
                {it.adet}× {it.urun_adi}
              </td>
              <td className="py-0.5 text-right">
                {formatPrice(it.birim_fiyat * it.adet)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="my-3 border-dashed" />
      <div className="flex justify-between font-semibold">
        <span>Gesamt</span>
        <span>{formatPrice(order.toplam)}</span>
      </div>
      <p className="mt-1">
        {order.odeme_durumu === "odendi" ? "PayPal bezahlt" : "Zahlung im Laden"}
      </p>

      {order.not_metni && (
        <>
          <hr className="my-3 border-dashed" />
          <p>Notiz: {order.not_metni}</p>
        </>
      )}
    </div>
  );
}
