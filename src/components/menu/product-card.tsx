"use client";

import { formatPrice } from "@/lib/config";
import { useCart } from "@/lib/cart/cart-context";
import type { Product } from "@/lib/supabase/types";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const available = product.mevcut_mu;

  return (
    <div
      className={`flex gap-3 rounded-xl border border-neutral-200 p-3 ${
        available ? "bg-white" : "bg-neutral-100 opacity-60"
      }`}
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-200">
        {product.fotograf_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.fotograf_url}
            alt={product.isim}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-neutral-400">
            {product.isim.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="truncate font-medium text-neutral-900">
            {product.isim}
          </h3>
          {product.aciklama && (
            <p className="mt-0.5 line-clamp-2 text-sm text-neutral-500">
              {product.aciklama}
            </p>
          )}
          {product.alerjenler.length > 0 && (
            <p className="mt-1 text-xs text-neutral-400">
              Allergene: {product.alerjenler.join(", ")}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold text-neutral-900">
            {formatPrice(product.fiyat)}
          </span>
          {available ? (
            <button
              type="button"
              onClick={() => addItem(product)}
              className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white active:bg-orange-600"
            >
              Hinzufügen
            </button>
          ) : (
            <span className="rounded-full bg-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-500">
              Ausverkauft
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
