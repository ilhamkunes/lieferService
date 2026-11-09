import type { OpeningHour, RestaurantSettings } from "@/lib/supabase/types";
import { GUN_ADI_DE, formatTime } from "@/lib/opening-hours";

function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M12 22s7-7.2 7-12.6A7 7 0 0 0 5 9.4C5 14.8 12 22 12 22z"
        stroke="#C8963E"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="9.4" r="2.6" stroke="#C8963E" strokeWidth="1.8" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.6c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"
        stroke="#C8963E"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="#C8963E" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="#C8963E" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="#C8963E" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M16.5 3c.3 2.1 1.6 3.5 3.5 3.7v2.7c-1.3.1-2.5-.3-3.5-1v6.4a5.1 5.1 0 1 1-5.1-5.1c.2 0 .4 0 .6.03v2.75a2.4 2.4 0 1 0 1.7 2.3V3h2.8z"
        stroke="#C8963E"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactFooter({
  settings,
  openingHours,
}: {
  settings: RestaurantSettings;
  openingHours: OpeningHour[];
}) {
  const { telefon, adres, instagram_url, tiktok_url } = settings;
  const hasContact = telefon || adres || instagram_url || tiktok_url;

  if (!hasContact && openingHours.length === 0) return null;

  return (
    <section className="mx-4 mt-8 mb-6 rounded-3xl bg-charcoal px-6 py-7.5 text-cream">
      <h2 className="font-display mb-5 text-[22px] font-semibold text-cream">
        Kontakt
      </h2>

      <div className="mb-6 flex flex-col gap-3.5">
        {adres && (
          <a
            href={mapsUrl(adres)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-cream/85 hover:text-cream"
          >
            <PinIcon />
            <span>{adres}</span>
          </a>
        )}
        {telefon && (
          <a
            href={`tel:${telefon.replace(/\s+/g, "")}`}
            className="flex items-center gap-3 text-sm text-cream/85 hover:text-cream"
          >
            <PhoneIcon />
            <span>{telefon}</span>
          </a>
        )}
        {instagram_url && (
          <a
            href={instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-cream/85 hover:text-cream"
          >
            <InstagramIcon />
            <span>Instagram</span>
          </a>
        )}
        {tiktok_url && (
          <a
            href={tiktok_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-cream/85 hover:text-cream"
          >
            <TiktokIcon />
            <span>TikTok</span>
          </a>
        )}
      </div>

      {openingHours.length > 0 && (
        <div className="border-t border-cream/15 pt-4.5">
          <h3 className="mb-2.5 text-[13px] font-bold tracking-[0.08em] text-gold uppercase">
            Öffnungszeiten
          </h3>
          <dl className="flex flex-col gap-1.5 text-[13.5px]">
            {GUN_ADI_DE.map((name, gun) => {
              const h = openingHours.find((o) => o.gun === gun);
              return (
                <div key={gun} className="flex justify-between text-cream/85">
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
