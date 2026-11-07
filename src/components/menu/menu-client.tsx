"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Category, Product } from "@/lib/supabase/types";
import { CategoryTabs } from "@/components/menu/category-tabs";
import { ProductCard } from "@/components/menu/product-card";
import { SearchBar } from "@/components/menu/search-bar";
import { FeaturedSection } from "@/components/menu/featured-section";

export type GroupedCategory = {
  category: Category;
  products: Product[];
};

export function MenuClient({
  grouped,
  featured,
}: {
  grouped: GroupedCategory[];
  featured: Product[];
}) {
  const [activeId, setActiveId] = useState<string | null>(
    grouped[0]?.category.id ?? null
  );
  const [search, setSearch] = useState("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const clickScrollLock = useRef(false);

  useEffect(() => {
    if (search) return;
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
      { rootMargin: "-56px 0px -70% 0px", threshold: 0 }
    );

    for (const g of grouped) {
      const el = sectionRefs.current[g.category.id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [grouped, search]);

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

  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.trim().toLowerCase();
    return grouped
      .flatMap((g) => g.products)
      .filter((p) => p.isim.toLowerCase().includes(q));
  }, [grouped, search]);

  return (
    <div>
      <SearchBar value={search} onChange={setSearch} />

      {!search && <FeaturedSection products={featured} />}

      <CategoryTabs
        categories={grouped.map((g) => g.category)}
        activeId={activeId}
        onSelect={handleSelect}
      />

      {searchResults ? (
        <div className="px-4 py-2">
          {searchResults.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">
              Keine Treffer für &quot;{search}&quot;.
            </p>
          ) : (
            searchResults.map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>
      ) : (
        <div className="px-4 py-2">
          {grouped.map((g) => (
            <section
              key={g.category.id}
              data-kategori-id={g.category.id}
              ref={(el) => {
                sectionRefs.current[g.category.id] = el;
              }}
              style={{ scrollMarginTop: 56 }}
              className="py-3"
            >
              <h2 className="mb-1 text-base font-semibold text-neutral-900">
                {g.category.isim}
              </h2>
              {g.products.length === 0 ? (
                <p className="text-sm text-neutral-400">
                  Diese Kategorie ist noch leer.
                </p>
              ) : (
                g.products.map((p) => <ProductCard key={p.id} product={p} />)
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
