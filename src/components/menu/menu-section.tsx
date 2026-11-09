import {
  getCategories,
  getOpeningHours,
  getProducts,
} from "@/lib/supabase/menu";
import { getRestaurantSettings } from "@/lib/supabase/settings";
import { getAvailability } from "@/lib/availability";
import { MenuClient, type GroupedCategory } from "@/components/menu/menu-client";
import { RestaurantHeader } from "@/components/menu/restaurant-header";
import { ContactFooter } from "@/components/menu/contact-footer";

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
      <RestaurantHeader
        kapakFotoUrl={settings.kapak_foto_url}
        logoUrl={settings.logo_url}
        status={status}
      />

      <MenuClient grouped={grouped} featured={featured} />

      <ContactFooter settings={settings} openingHours={openingHours} />
    </div>
  );
}

export function MenuSectionSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-36 w-full bg-neutral-100" />
      <div className="space-y-3 px-4 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-neutral-100" />
        ))}
      </div>
    </div>
  );
}
