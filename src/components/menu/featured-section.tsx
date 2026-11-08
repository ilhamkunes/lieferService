"use client";

import { formatPrice } from "@/lib/config";
import { useCart } from "@/lib/cart/cart-context";
import type { Product } from "@/lib/supabase/types";
import { FoodPlaceholderIcon } from "@/components/ui/food-placeholder-icon";

export function FeaturedSection({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  if (products.length === 0) return null;

  return (
    <section className="px-4 py-4">
      <h2 className="mb-2 text-base font-semibold text-neutral-900">Beliebt</h2>
      <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div key={p.id} className="relative w-28 shrink-0">
            <div className="h-28 w-28 overflow-hidden rounded-lg bg-orange-50">
              {p.fotograf_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.fotograf_url}
                  alt={p.isim}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <FoodPlaceholderIcon className="h-10 w-10 text-orange-200" />
                </div>
              )}
              {p.mevcut_mu && (
                <button
                  type="button"
                  onClick={() => addItem(p)}
                  aria-label={`${p.isim} hinzufügen`}
                  className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-base font-bold text-orange-500 shadow"
                >
                  +
                </button>
              )}
            </div>
            <p className="mt-1 truncate text-sm font-medium text-neutral-900">
              {p.isim}
            </p>
            <p className="text-sm text-neutral-500">{formatPrice(p.fiyat)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
