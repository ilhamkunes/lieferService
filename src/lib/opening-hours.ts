import type { OpeningHour } from "@/lib/supabase/types";

const GUN_ADI_DE = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
] as const;

function parseTimeOnDate(base: Date, hhmmss: string): Date {
  const [h, m, s] = hhmmss.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h, m, s || 0, 0);
  return d;
}

function formatTime(hhmmss: string): string {
  const [h, m] = hhmmss.split(":");
  return `${h}:${m}`;
}

export type OpenStatus =
  | { isOpen: true }
  | { isOpen: false; nextOpenLabel: string | null };

export function getOpenStatus(hours: OpeningHour[], now: Date): OpenStatus {
  const today = hours.find((h) => h.gun === now.getDay());

  if (today && !today.kapali) {
    const acilis = parseTimeOnDate(now, today.acilis);
    const kapanis = parseTimeOnDate(now, today.kapanis);
    if (now >= acilis && now < kapanis) {
      return { isOpen: true };
    }
    if (now < acilis) {
      return {
        isOpen: false,
        nextOpenLabel: `Heute ${formatTime(today.acilis)} Uhr`,
      };
    }
  }

  // Bugun kapali/gecmis - sonraki 7 gun icinde ilk acik gunu bul
  for (let offset = 1; offset <= 7; offset++) {
    const gun = (now.getDay() + offset) % 7;
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
