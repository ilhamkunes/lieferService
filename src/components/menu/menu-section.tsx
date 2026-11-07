import {
  getCategories,
  getOpeningHours,
  getProducts,
} from "@/lib/supabase/menu";
import { getRestaurantSettings } from "@/lib/supabase/settings";
import { getAvailability } from "@/lib/availability";
import { MenuClient, type GroupedCategory } from "@/components/menu/menu-client";

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

  return (
    <div>
      {status.isOpen ? (
        <div className="bg-green-50 px-4 py-2 text-center text-sm font-medium text-green-700">
          Geöffnet – wir nehmen jetzt Bestellungen an
        </div>
      ) : (
        <div className="bg-red-50 px-4 py-2 text-center text-sm font-medium text-red-700">
          Geschlossen
          {status.nextOpenLabel ? ` – öffnet wieder: ${status.nextOpenLabel}` : ""}
        </div>
      )}

      <MenuClient grouped={grouped} />
    </div>
  );
}

export function MenuSectionSkeleton() {
  return (
    <div className="animate-pulse px-4 py-4">
      <div className="mb-4 h-8 w-full rounded bg-neutral-100" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-neutral-100" />
        ))}
      </div>
    </div>
  );
}
