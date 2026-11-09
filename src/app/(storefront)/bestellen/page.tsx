import Link from "next/link";
import { Suspense } from "react";
import { getOpeningHours } from "@/lib/supabase/menu";
import { getRestaurantSettings } from "@/lib/supabase/settings";
import { getAvailability } from "@/lib/availability";
import { RESTAURANT_NAME } from "@/lib/config";
import { OrderTypePicker } from "@/components/bestellen/order-type-picker";

async function BestellenContent() {
  const [openingHours, settings] = await Promise.all([
    getOpeningHours(),
    getRestaurantSettings(),
  ]);
  const availability = getAvailability(openingHours, settings, new Date());

  return <OrderTypePicker availability={availability} />;
}

function BestellenSkeleton() {
  return (
    <div className="space-y-3 px-5 py-6">
      <div className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
      <div className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
    </div>
  );
}

export default function BestellenPage() {
  return (
    <main className="flex-1 md:mx-auto md:max-w-xl">
      <div className="flex items-center gap-3 px-5 py-4">
        <Link href="/" className="font-display text-sm font-semibold text-muted">
          ← {RESTAURANT_NAME}
        </Link>
      </div>
      <h1 className="font-display px-5 text-2xl font-semibold text-charcoal">
        Wie möchtest du bestellen?
      </h1>
      <Suspense fallback={<BestellenSkeleton />}>
        <BestellenContent />
      </Suspense>
    </main>
  );
}
