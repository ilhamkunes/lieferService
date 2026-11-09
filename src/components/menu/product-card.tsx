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
      className={`flex items-start justify-between gap-3.5 border-b border-border-warm py-4 last:border-b-0 ${
        available ? "" : "opacity-50"
      }`}
    >
      <div className="min-w-0 flex-1">
        <h3 className="text-[15.5px] font-semibold text-charcoal">
          {product.isim}
        </h3>
        {product.aciklama && (
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted">
            {product.aciklama}
          </p>
        )}
        {product.alerjenler.length > 0 && (
          <p className="mt-1 text-xs text-muted/80">
            {product.alerjenler.join(", ")}
          </p>
        )}
        <p className="mt-2 text-[14.5px] font-bold text-charcoal">
          {formatPrice(product.fiyat)}
        </p>
      </div>

      <div className="relative shrink-0">
        <div className="h-[76px] w-[76px] overflow-hidden rounded-2xl bg-orange-50 shadow-[0_4px_14px_rgba(36,28,22,0.12)]">
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
            className="absolute -right-2 -bottom-2 flex h-7 w-7 items-center justify-center rounded-full border border-border-warm bg-white text-terracotta shadow-[0_3px_8px_rgba(36,28,22,0.18)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-charcoal px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-cream">
            Ausverkauft
          </span>
        )}
      </div>
    </div>
  );
}
