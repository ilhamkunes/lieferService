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
      { rootMargin: "-64px 0px -70% 0px", threshold: 0 }
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
        <div className="px-5 py-2 md:px-8">
          {searchResults.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              Keine Treffer für &quot;{search}&quot;.
            </p>
          ) : (
            <div className="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-8">
              {searchResults.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="px-5 py-2 md:px-8">
          {grouped.map((g) => (
            <section
              key={g.category.id}
              data-kategori-id={g.category.id}
              ref={(el) => {
                sectionRefs.current[g.category.id] = el;
              }}
              style={{ scrollMarginTop: 64 }}
              className="py-4 md:py-6"
            >
              <h2 className="font-display mb-1 text-[19px] font-semibold text-charcoal md:text-2xl">
                {g.category.isim}
              </h2>
              {g.products.length === 0 ? (
                <p className="text-sm text-muted">
                  Diese Kategorie ist noch leer.
                </p>
              ) : (
                <>
                  <p className="mb-3 text-[13px] text-muted md:mb-5">
                    {g.products.length}{" "}
                    {g.products.length === 1 ? "Artikel" : "Artikel"}
                  </p>
                  <div className="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-8">
                    {g.products.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
