"use client";

import { formatPrice } from "@/lib/config";
import { useCart } from "@/lib/cart/cart-context";

export function OrderSummary({
  deliveryFee,
}: {
  deliveryFee?: number;
}) {
  const { items, total } = useCart();
  const grandTotal = total + (deliveryFee ?? 0);

  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <h2 className="mb-2 font-semibold text-neutral-900">Bestellung</h2>
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between text-sm text-neutral-700"
          >
            <span>
              {item.adet}× {item.isim}
            </span>
            <span>{formatPrice(item.fiyat * item.adet)}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-1 border-t border-neutral-100 pt-3 text-sm">
        <div className="flex justify-between text-neutral-600">
          <span>Zwischensumme</span>
          <span>{formatPrice(total)}</span>
        </div>
        {deliveryFee !== undefined && (
          <div className="flex justify-between text-neutral-600">
            <span>Liefergebühr</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-semibold text-neutral-900">
          <span>Gesamt</span>
          <span>{formatPrice(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
