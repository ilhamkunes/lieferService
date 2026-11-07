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
    <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
      <div className="flex gap-5 overflow-x-auto px-4 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const active = cat.id === activeId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={`shrink-0 border-b-2 pb-2 text-sm whitespace-nowrap transition-colors ${
                active
                  ? "border-orange-500 font-semibold text-neutral-900"
                  : "border-transparent font-medium text-neutral-400"
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
