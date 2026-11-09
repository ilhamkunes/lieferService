import Link from "next/link";
import { Suspense } from "react";
import { getOpeningHours } from "@/lib/supabase/menu";
import { getRestaurantSettings } from "@/lib/supabase/settings";
import { getAvailability } from "@/lib/availability";
import { RestaurantHeader } from "@/components/menu/restaurant-header";
import { ContactFooter } from "@/components/menu/contact-footer";
import { WheatIcon } from "@/components/ui/wheat-icon";

async function HomeContent() {
  const [openingHours, settings] = await Promise.all([
    getOpeningHours(),
    getRestaurantSettings(),
  ]);
  const status = getAvailability(openingHours, settings, new Date());

  return (
    <div className="md:mx-auto md:max-w-xl">
      <RestaurantHeader
        kapakFotoUrl={settings.kapak_foto_url}
        logoUrl={settings.logo_url}
        status={status}
      />

      <div className="px-5 py-6">
        <Link
          href="/bestellen"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta py-4 text-center text-base font-semibold text-cream shadow-[0_10px_24px_rgba(168,120,31,0.35)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 2v8M5 2v5a2 2 0 0 0 4 0V2M7 10v12M17 2c-2 1-3 3-3 6s1 4 3 5v9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Jetzt bestellen
        </Link>
      </div>

      <div className="relative px-4">
        <WheatIcon className="pointer-events-none absolute -top-2 right-8 h-16 w-6 rotate-[14deg] text-gold/50" />
        <ContactFooter settings={settings} openingHours={openingHours} />
      </div>
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
