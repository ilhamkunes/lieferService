import {
  getCategories,
  getOpeningHours,
  getProducts,
} from "@/lib/supabase/menu";
import { getRestaurantSettings } from "@/lib/supabase/settings";
import { getAvailability } from "@/lib/availability";
import { MenuClient, type GroupedCategory } from "@/components/menu/menu-client";
import { MenuPageHeader } from "@/components/menu/menu-page-header";
import { OrderTypeBar } from "@/components/menu/order-type-bar";

export async function MenuSection() {
  const [categories, products, openingHours, settings] = await Promise.all([
    getCategories(),
    getProducts(),
    getOpeningHours(),
    getRestaurantSettings(),
  ]);

  const status = getAvailability(openingHours, settings, new Date());

  const grouped: GroupedCategory[] = categories.map((category) => ({
    category,
    products: products.filter((p) => p.kategori_id === category.id),
  }));

  const featured = products.filter((p) => p.one_cikan && p.mevcut_mu);

  return (
    <div>
      <MenuPageHeader logoUrl={settings.logo_url} status={status} />
      <OrderTypeBar />

      <MenuClient grouped={grouped} featured={featured} />
    </div>
  );
}

export function MenuSectionSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-14 w-full bg-neutral-100" />
      <div className="space-y-3 px-4 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-neutral-100" />
        ))}
      </div>
    </div>
  );
}
