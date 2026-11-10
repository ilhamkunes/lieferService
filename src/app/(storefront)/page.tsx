import Link from "next/link";
import { Suspense } from "react";
import { getOpeningHours, getProducts } from "@/lib/supabase/menu";
import { getRestaurantSettings } from "@/lib/supabase/settings";
import { getAvailability } from "@/lib/availability";
import { RESTAURANT_NAME } from "@/lib/config";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { ContactFooter } from "@/components/menu/contact-footer";
import { WheatIcon } from "@/components/ui/wheat-icon";

async function HomeContent() {
  const [openingHours, settings, products] = await Promise.all([
    getOpeningHours(),
    getRestaurantSettings(),
    getProducts(),
  ]);
  const status = getAvailability(openingHours, settings, new Date());

  const slides = products
    .filter((p) => p.fotograf_url && p.mevcut_mu)
    .slice(0, 6)
    .map((p) => ({ id: p.id, url: p.fotograf_url as string, alt: p.isim }));

  return (
    <div className="md:mx-auto md:max-w-xl">
      <HeroCarousel slides={slides} logoUrl={settings.logo_url} status={status} />

      <section className="px-6 py-8 text-center">
        <h1 className="font-display text-[32px] leading-tight font-semibold text-charcoal">
          Willkommen bei {RESTAURANT_NAME}
        </h1>
        <p className="mt-1.5 text-sm font-semibold text-terracotta">
          Uyghurisches Restaurant in Krefeld
        </p>
        <p className="mt-3.5 text-[14.5px] leading-relaxed text-muted">
          Authentische uigurische Küche, frisch zubereitet und mit Liebe
          serviert. Entdecken Sie traditionelle Spezialitäten und genießen
          Sie ein besonderes Geschmackserlebnis.
        </p>
      </section>

      <section className="mx-5 rounded-3xl bg-white p-6 text-center shadow-[0_4px_20px_rgba(36,28,22,0.08)]">
        <h2 className="font-display text-xl font-semibold text-charcoal">
          Unsere Spezialitäten
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Frisch zubereitete uigurische Spezialitäten – traditionelle
          Rezepte, hochwertige Zutaten und authentischer Geschmack.
        </p>
        <div className="mt-5 flex gap-3">
          <Link
            href="/speisekarte"
            className="flex-1 rounded-full border-2 border-terracotta py-3 text-sm font-semibold text-terracotta"
          >
            Speisekarte
          </Link>
          <Link
            href="/bestellen"
            className="flex-1 rounded-full bg-terracotta py-3 text-sm font-semibold text-cream"
          >
            Jetzt bestellen
          </Link>
        </div>
      </section>

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
      <div className="h-[300px] w-full bg-neutral-100" />
      <div className="px-6 py-8">
        <div className="mx-auto h-8 w-2/3 rounded bg-neutral-100" />
      </div>
      <div className="mx-5 h-40 rounded-3xl bg-neutral-100" />
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
