"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/config";
import { useCart } from "@/lib/cart/cart-context";

export function CartSheet({ onClose }: { onClose: () => void }) {
  const { items, not, increment, decrement, removeItem, setNote, total } =
    useCart();

  return (
    <div className="fixed inset-0 z-30 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Schließen"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative z-10 flex max-h-[85vh] flex-col rounded-t-2xl bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h2 className="text-base font-semibold text-neutral-900">
            Warenkorb
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-neutral-500"
          >
            Schließen
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">
              Dein Warenkorb ist leer.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 border-b border-neutral-100 pb-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-neutral-900">
                      {item.isim}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {formatPrice(item.fiyat)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => decrement(item.productId)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-lg font-semibold text-neutral-700"
                      aria-label="Menge verringern"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-medium">
                      {item.adet}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment(item.productId)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-lg font-semibold text-neutral-700"
                      aria-label="Menge erhöhen"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-neutral-400"
                    aria-label="Entfernen"
                  >
                    Entfernen
                  </button>
                </div>
              ))}

              <div>
                <label
                  htmlFor="sepet-notu"
                  className="mb-1 block text-sm font-medium text-neutral-700"
                >
                  Anmerkung zur Bestellung
                </label>
                <textarea
                  id="sepet-notu"
                  value={not}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="z. B. ohne Zwiebeln"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-200 px-4 py-3">
            <div className="mb-3 flex items-center justify-between text-base font-semibold text-neutral-900">
              <span>Zwischensumme</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full rounded-full bg-orange-500 py-3 text-center text-base font-semibold text-white active:bg-orange-600"
            >
              Zur Kasse
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
