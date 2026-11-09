import type { OpeningHour, RestaurantSettings } from "@/lib/supabase/types";
import { GUN_ADI_DE, formatTime } from "@/lib/opening-hours";

function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function ContactFooter({
  settings,
  openingHours,
}: {
  settings: RestaurantSettings;
  openingHours: OpeningHour[];
}) {
  const { telefon, adres, instagram_url } = settings;
  const hasContact = telefon || adres || instagram_url;

  if (!hasContact && openingHours.length === 0) return null;

  return (
    <section className="mt-2 space-y-4 border-t border-neutral-100 px-4 py-6">
      <h2 className="text-base font-semibold text-neutral-900">Kontakt</h2>

      <div className="space-y-2 text-sm">
        {adres && (
          <a
            href={mapsUrl(adres)}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-neutral-600 underline-offset-2 hover:underline"
          >
            📍 {adres}
          </a>
        )}
        {telefon && (
          <a
            href={`tel:${telefon.replace(/\s+/g, "")}`}
            className="block text-neutral-600 underline-offset-2 hover:underline"
          >
            📞 {telefon}
          </a>
        )}
        {instagram_url && (
          <a
            href={instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-neutral-600 underline-offset-2 hover:underline"
          >
            📷 Instagram
          </a>
        )}
      </div>

      {openingHours.length > 0 && (
        <div>
          <h3 className="mb-1 text-sm font-semibold text-neutral-900">
            Öffnungszeiten
          </h3>
          <dl className="space-y-0.5 text-sm text-neutral-600">
            {GUN_ADI_DE.map((name, gun) => {
              const h = openingHours.find((o) => o.gun === gun);
              return (
                <div key={gun} className="flex justify-between">
                  <dt>{name}</dt>
                  <dd>
                    {!h || h.kapali
                      ? "Geschlossen"
                      : `${formatTime(h.acilis)} – ${formatTime(h.kapanis)}`}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}
    </section>
  );
}
