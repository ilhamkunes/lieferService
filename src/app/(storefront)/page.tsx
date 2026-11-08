import { Suspense } from "react";
import {
  MenuSection,
  MenuSectionSkeleton,
} from "@/components/menu/menu-section";

export default function HomePage() {
  return (
    <main className="flex-1 pb-28">
      <Suspense fallback={<MenuSectionSkeleton />}>
        <MenuSection />
      </Suspense>
    </main>
  );
}
