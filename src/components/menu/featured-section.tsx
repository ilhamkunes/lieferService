"use client";

import { formatPrice } from "@/lib/config";
import { useCart } from "@/lib/cart/cart-context";
import type { Product } from "@/lib/supabase/types";
import { FoodPlaceholderIcon } from "@/components/ui/food-placeholder-icon";

export function FeaturedSection({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  if (products.length === 0) return null;

  return (
    <section className="px-5 pt-6 pb-2 md:px-8">
      <h2 className="font-display mb-3.5 text-[19px] font-semibold text-charcoal md:text-2xl">
        Beliebt diese Woche
      </h2>
      <div className="flex gap-3.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:[grid-template-columns:repeat(auto-fill,minmax(190px,1fr))] md:gap-6 md:overflow-visible">
        {products.map((p) => (
          <div
            key={p.id}
            className="w-[168px] shrink-0 md:w-auto md:rounded-2xl md:bg-white md:shadow-[0_4px_16px_rgba(36,28,22,0.08)]"
          >
            <div className="relative h-[168px] w-[168px] overflow-hidden rounded-[18px] bg-orange-50 shadow-[0_8px_20px_rgba(36,28,22,0.12)] md:h-auto md:w-full md:aspect-square md:rounded-none md:shadow-none">
              {p.fotograf_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.fotograf_url}
                  alt={p.isim}
                  className="h-full w-full object-cover md:object-contain"
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
                  className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-cream text-terracotta shadow-[0_2px_8px_rgba(0,0,0,0.25)] md:right-3 md:bottom-3 md:h-9 md:w-9"
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
            <p className="mt-2.5 truncate text-sm font-semibold text-charcoal md:px-4 md:pt-1">
              {p.isim}
            </p>
            <p className="text-[13.5px] font-semibold text-terracotta md:px-4 md:pb-4">
              {formatPrice(p.fiyat)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
