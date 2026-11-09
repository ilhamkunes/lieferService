"use client";

import { formatPrice } from "@/lib/config";
import { useCart } from "@/lib/cart/cart-context";
import type { Product } from "@/lib/supabase/types";
import { FoodPlaceholderIcon } from "@/components/ui/food-placeholder-icon";

export function FeaturedSection({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  if (products.length === 0) return null;

  return (
    <section className="px-5 pt-6 pb-2">
      <h2 className="font-display mb-3.5 text-[19px] font-semibold text-charcoal">
        Beliebt diese Woche
      </h2>
      <div className="flex gap-3.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div key={p.id} className="w-[168px] shrink-0">
            <div className="relative h-[168px] w-[168px] overflow-hidden rounded-[18px] bg-orange-50 shadow-[0_8px_20px_rgba(36,28,22,0.12)]">
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
                  className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-cream text-terracotta shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
            <p className="mt-2.5 truncate text-sm font-semibold text-charcoal">
              {p.isim}
            </p>
            <p className="text-[13.5px] font-semibold text-terracotta">
              {formatPrice(p.fiyat)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
