import Link from "next/link";
import { RESTAURANT_NAME } from "@/lib/config";
import type { Availability } from "@/lib/availability";

export function MenuPageHeader({
  logoUrl,
  status,
}: {
  logoUrl: string | null;
  status: Availability;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3 md:px-8 md:py-4">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-sm font-bold text-charcoal">
              {RESTAURANT_NAME.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <span className="font-display text-base font-semibold text-charcoal">
          {RESTAURANT_NAME}
        </span>
      </Link>

      <div className="flex items-center gap-1.5">
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            status.isOpen ? "bg-emerald-600" : "bg-neutral-400"
          }`}
        />
        <span className="text-xs font-semibold text-muted">
          {status.isOpen ? "Geöffnet" : "Geschlossen"}
        </span>
      </div>
    </div>
  );
}
