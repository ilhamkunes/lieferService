import type { OpeningHour } from "@/lib/supabase/types";
import { berlinWallTimeToDate, getBerlinParts } from "@/lib/timezone";

// Mutfagin siparisi hazirlamaya baslamasi icin gereken minimum sure.
// Prompt 5'te admin panelinden ayarlanabilir hale gelecek, simdilik sabit.
export const MIN_PREP_MINUTES = 15;
const SLOT_STEP_MINUTES = 15;

// hhmmss ("HH:MM:SS"), base'in Berlin takvim gunune (yil/ay/gun) denk
// gelen gercek ani (UTC Date) olarak dondurulur - calistigi ortamin
// (tarayici/Vercel sunucusu) yerel saatinden bagimsiz.
function atBerlinTime(base: Date, hhmmss: string): Date {
  const { year, month, day } = getBerlinParts(base);
  const [h, m] = hhmmss.split(":").map(Number);
  return berlinWallTimeToDate(year, month, day, h, m);
}

function roundUpToStep(date: Date, stepMinutes: number): Date {
  const ms = stepMinutes * 60 * 1000;
  return new Date(Math.ceil(date.getTime() / ms) * ms);
}

export function getPickupSlotsForToday(hours: OpeningHour[], now: Date): Date[] {
  const today = hours.find((h) => h.gun === getBerlinParts(now).weekday);
  if (!today || today.kapali) return [];

  const acilis = atBerlinTime(now, today.acilis);
  const kapanis = atBerlinTime(now, today.kapanis);
  const earliest = roundUpToStep(
    new Date(
      Math.max(now.getTime() + MIN_PREP_MINUTES * 60 * 1000, acilis.getTime())
    ),
    SLOT_STEP_MINUTES
  );

  const slots: Date[] = [];
  for (
    let t = new Date(earliest);
    t < kapanis;
    t = new Date(t.getTime() + SLOT_STEP_MINUTES * 60 * 1000)
  ) {
    slots.push(new Date(t));
  }
  return slots;
}

export function isValidPickupTime(
  hours: OpeningHour[],
  candidate: Date,
  now: Date
): boolean {
  if (Number.isNaN(candidate.getTime())) return false;

  const candidateBerlin = getBerlinParts(candidate);
  const nowBerlin = getBerlinParts(now);
  if (
    candidateBerlin.year !== nowBerlin.year ||
    candidateBerlin.month !== nowBerlin.month ||
    candidateBerlin.day !== nowBerlin.day
  ) {
    return false;
  }

  const today = hours.find((h) => h.gun === candidateBerlin.weekday);
  if (!today || today.kapali) return false;

  const acilis = atBerlinTime(candidate, today.acilis);
  const kapanis = atBerlinTime(candidate, today.kapanis);
  const earliest = new Date(now.getTime() + MIN_PREP_MINUTES * 60 * 1000);

  if (candidate < acilis || candidate >= kapanis) return false;
  if (candidate < earliest) return false;
  return true;
}
