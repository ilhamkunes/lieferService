import Link from "next/link";
import { Suspense } from "react";
import { getOpeningHours } from "@/lib/supabase/menu";
import { getRestaurantSettings } from "@/lib/supabase/settings";
import { getAvailability } from "@/lib/availability";
import { RestaurantHeader } from "@/components/menu/restaurant-header";
import { ContactFooter } from "@/components/menu/contact-footer";

async function HomeContent() {
  const [openingHours, settings] = await Promise.all([
    getOpeningHours(),
    getRestaurantSettings(),
  ]);
  const status = getAvailability(openingHours, settings, new Date());

  return (
    <div>
      <RestaurantHeader
        kapakFotoUrl={settings.kapak_foto_url}
        logoUrl={settings.logo_url}
        status={status}
      />

      <div className="px-5 py-6">
        <Link
          href="/bestellen"
          className="block w-full rounded-full bg-terracotta py-4 text-center text-base font-semibold text-cream shadow-[0_10px_24px_rgba(181,72,42,0.35)]"
        >
          Jetzt bestellen
        </Link>
      </div>

      <ContactFooter settings={settings} openingHours={openingHours} />
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[340px] w-full bg-neutral-100" />
      <div className="px-5 py-6">
        <div className="h-14 rounded-full bg-neutral-100" />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="flex-1">
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
