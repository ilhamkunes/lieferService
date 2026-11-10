"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RESTAURANT_NAME } from "@/lib/config";
import { AccountLink } from "@/components/account/account-link";
import type { Availability } from "@/lib/availability";

type Slide = { id: string; url: string; alt: string };

export function HeroCarousel({
  slides,
  logoUrl,
  status,
}: {
  slides: Slide[];
  logoUrl: string | null;
  status: Availability;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const userInteracting = useRef(false);

  function scrollToIndex(i: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      if (userInteracting.current) return;
      setActive((prev) => {
        const next = (prev + 1) % slides.length;
        scrollToIndex(next);
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  function handleScroll() {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setActive(i);
  }

  if (slides.length === 0) {
    return (
      <div className="relative flex h-[300px] w-full items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <span className="font-display text-2xl text-orange-300">
          {RESTAURANT_NAME}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-[300px] w-full overflow-hidden">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onTouchStart={() => (userInteracting.current = true)}
        onTouchEnd={() => {
          window.setTimeout(() => (userInteracting.current = false), 3000);
        }}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.id}
            src={s.url}
            alt={s.alt}
            className="h-full w-full shrink-0 snap-start object-cover"
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/10 via-30% to-charcoal/85" />

      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
        <Link href="/" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-cream/85 bg-gold">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-lg font-bold text-charcoal">
              {RESTAURANT_NAME.charAt(0).toUpperCase()}
            </span>
          )}
        </Link>
        <div className="rounded-full bg-cream/90 px-4 py-2 text-xs font-semibold text-charcoal">
          <AccountLink />
        </div>
      </div>

      <div className="absolute inset-x-5 bottom-10">
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

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Bild ${i + 1} anzeigen`}
              onClick={() => {
                setActive(i);
                scrollToIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-5 bg-cream" : "w-1.5 bg-cream/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
