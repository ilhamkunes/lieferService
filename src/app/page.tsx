import { Suspense } from "react";
import { RESTAURANT_NAME } from "@/lib/config";
import {
  MenuSection,
  MenuSectionSkeleton,
} from "@/components/menu/menu-section";

export default function HomePage() {
  return (
    <main className="flex-1 pb-28">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-neutral-900">
          {RESTAURANT_NAME}
        </h1>
      </header>

      <Suspense fallback={<MenuSectionSkeleton />}>
        <MenuSection />
      </Suspense>
    </main>
  );
}
