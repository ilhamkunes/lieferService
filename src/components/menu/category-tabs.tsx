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
    <div className="sticky top-[49px] z-10 border-b border-neutral-200 bg-white">
      <div className="flex gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const active = cat.id === activeId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? "bg-orange-500 text-white"
                  : "bg-neutral-100 text-neutral-600"
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
