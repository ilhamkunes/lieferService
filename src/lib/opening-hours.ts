import type { OpeningHour } from "@/lib/supabase/types";
import { getBerlinParts } from "@/lib/timezone";

export const GUN_ADI_DE = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
] as const;

function toMinutes(hhmmss: string): number {
  const [h, m] = hhmmss.split(":").map(Number);
  return h * 60 + m;
}

export function formatTime(hhmmss: string): string {
  const [h, m] = hhmmss.split(":");
  return `${h}:${m}`;
}

export type OpenStatus =
  | { isOpen: true }
  | { isOpen: false; nextOpenLabel: string | null };

// now, calistigi ortamin (tarayici veya Vercel sunucusu - UTC) yerel
// saatinden BAGIMSIZ olarak hep Europe/Berlin saatine gore degerlendirilir.
export function getOpenStatus(hours: OpeningHour[], now: Date): OpenStatus {
  const berlin = getBerlinParts(now);
  const nowMinutes = berlin.hours * 60 + berlin.minutes;

  const today = hours.find((h) => h.gun === berlin.weekday);

  if (today && !today.kapali) {
    const acilisMin = toMinutes(today.acilis);
    const kapanisMin = toMinutes(today.kapanis);
    if (nowMinutes >= acilisMin && nowMinutes < kapanisMin) {
      return { isOpen: true };
    }
    if (nowMinutes < acilisMin) {
      return {
        isOpen: false,
        nextOpenLabel: `Heute ${formatTime(today.acilis)} Uhr`,
      };
    }
  }

  // Bugun kapali/gecmis - sonraki 7 gun icinde ilk acik gunu bul
  for (let offset = 1; offset <= 7; offset++) {
    const gun = (berlin.weekday + offset) % 7;
    const hit = hours.find((h) => h.gun === gun && !h.kapali);
    if (hit) {
      const label =
        offset === 1
          ? `Morgen, ${GUN_ADI_DE[gun]} ${formatTime(hit.acilis)} Uhr`
          : `${GUN_ADI_DE[gun]}, ${formatTime(hit.acilis)} Uhr`;
      return { isOpen: false, nextOpenLabel: label };
    }
  }

  return { isOpen: false, nextOpenLabel: null };
}
