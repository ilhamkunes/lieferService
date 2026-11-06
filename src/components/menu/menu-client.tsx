"use client";

import { useEffect, useRef, useState } from "react";
import type { Category, Product } from "@/lib/supabase/types";
import { CategoryTabs } from "@/components/menu/category-tabs";
import { ProductCard } from "@/components/menu/product-card";

export type GroupedCategory = {
  category: Category;
  products: Product[];
};

export function MenuClient({ grouped }: { grouped: GroupedCategory[] }) {
  const [activeId, setActiveId] = useState<string | null>(
    grouped[0]?.category.id ?? null
  );
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const clickScrollLock = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (clickScrollLock.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-kategori-id");
            if (id) setActiveId(id);
          }
        }
      },
      { rootMargin: "-110px 0px -70% 0px", threshold: 0 }
    );

    for (const g of grouped) {
      const el = sectionRefs.current[g.category.id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [grouped]);

  function handleSelect(id: string) {
    setActiveId(id);
    clickScrollLock.current = true;
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    window.setTimeout(() => {
      clickScrollLock.current = false;
    }, 600);
  }

  return (
    <div>
      <CategoryTabs
        categories={grouped.map((g) => g.category)}
        activeId={activeId}
        onSelect={handleSelect}
      />

      <div className="space-y-6 px-4 py-4">
        {grouped.map((g) => (
          <section
            key={g.category.id}
            data-kategori-id={g.category.id}
            ref={(el) => {
              sectionRefs.current[g.category.id] = el;
            }}
            style={{ scrollMarginTop: 110 }}
          >
            <h2 className="mb-2 text-base font-semibold text-neutral-900">
              {g.category.isim}
            </h2>
            {g.products.length === 0 ? (
              <p className="text-sm text-neutral-400">
                Diese Kategorie ist noch leer.
              </p>
            ) : (
              <div className="space-y-2">
                {g.products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
