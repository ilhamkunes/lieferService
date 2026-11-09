import { RESTAURANT_NAME, RESTAURANT_TAGLINE } from "@/lib/config";
import { AccountLink } from "@/components/account/account-link";
import { FoodPlaceholderIcon } from "@/components/ui/food-placeholder-icon";
import type { Availability } from "@/lib/availability";

export function RestaurantHeader({
  kapakFotoUrl,
  logoUrl,
  status,
}: {
  kapakFotoUrl: string | null;
  logoUrl: string | null;
  status: Availability;
}) {
  return (
    <div className="relative h-[340px] w-full overflow-hidden">
      {kapakFotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={kapakFotoUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
          <FoodPlaceholderIcon className="h-14 w-14 text-orange-200" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/15 via-30% to-charcoal/95" />

      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-cream/85 bg-gold">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-lg font-bold text-charcoal">
              {RESTAURANT_NAME.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="rounded-full bg-cream/90 px-4 py-2 text-xs font-semibold text-charcoal">
          <AccountLink />
        </div>
      </div>

      <div className="absolute inset-x-5 bottom-6">
        <p className="mb-1.5 text-[11px] font-bold tracking-[0.22em] text-gold uppercase">
          {RESTAURANT_TAGLINE}
        </p>
        <h1 className="font-display mb-2.5 text-[46px] leading-none font-semibold text-cream">
          {RESTAURANT_NAME}
        </h1>
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
            status.isOpen ? "bg-emerald-800/90" : "bg-neutral-700/90"
          }`}
        >
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              status.isOpen ? "bg-emerald-300" : "bg-neutral-300"
            }`}
          />
          <span className="text-[12.5px] font-semibold text-cream">
            {status.isOpen
              ? "Geöffnet – wir nehmen jetzt Bestellungen an"
              : `Geschlossen${status.nextOpenLabel ? ` – öffnet ${status.nextOpenLabel}` : ""}`}
          </span>
        </div>
      </div>
    </div>
  );
}
