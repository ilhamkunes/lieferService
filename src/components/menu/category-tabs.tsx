"use client";

import type { Category } from "@/lib/supabase/types";

export function CategoryTabs({
  categories,
  activeId,
  onSelect,
}: {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="sticky top-0 z-10 bg-cream pt-5 pb-1 shadow-[0_1px_0_rgba(36,28,22,0.06)]">
      <div className="flex gap-2.5 overflow-x-auto px-5 pb-1 md:px-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const active = cat.id === activeId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={`shrink-0 rounded-full px-4.5 py-2.5 text-[13.5px] font-semibold whitespace-nowrap transition-colors ${
                active
                  ? "bg-terracotta text-cream"
                  : "border border-border-warm bg-white text-muted"
              }`}
            >
              {cat.isim}
            </button>
          );
        })}
      </div>
    </div>
  );
}
