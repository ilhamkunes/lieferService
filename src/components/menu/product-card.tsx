"use client";

import { formatPrice } from "@/lib/config";
import { useCart } from "@/lib/cart/cart-context";
import type { Product } from "@/lib/supabase/types";
import { FoodPlaceholderIcon } from "@/components/ui/food-placeholder-icon";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const available = product.mevcut_mu;

  return (
    <div
      className={`flex items-start justify-between gap-3 border-b border-neutral-100 py-3 ${
        available ? "" : "opacity-50"
      }`}
    >
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-neutral-900">{product.isim}</h3>
        {product.aciklama && (
          <p className="mt-0.5 line-clamp-2 text-sm text-neutral-500">
            {product.aciklama}
          </p>
        )}
        {product.alerjenler.length > 0 && (
          <p className="mt-0.5 text-xs text-neutral-400">
            {product.alerjenler.join(", ")}
          </p>
        )}
        <p className="mt-1 font-semibold text-neutral-900">
          {formatPrice(product.fiyat)}
        </p>
      </div>

      <div className="relative shrink-0">
        <div className="h-16 w-16 overflow-hidden rounded-lg bg-orange-50">
          {product.fotograf_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.fotograf_url}
              alt={product.isim}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <FoodPlaceholderIcon className="h-7 w-7 text-orange-200" />
            </div>
          )}
        </div>

        {available ? (
          <button
            type="button"
            onClick={() => addItem(product)}
            aria-label={`${product.isim} hinzufügen`}
            className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-white text-lg font-bold text-orange-500 shadow"
          >
            +
          </button>
        ) : (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-neutral-700 px-2 py-0.5 text-[10px] font-medium text-white">
            Ausverkauft
          </span>
        )}
      </div>
    </div>
  );
}
