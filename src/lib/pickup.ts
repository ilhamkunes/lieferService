import type { OpeningHour } from "@/lib/supabase/types";

// Mutfagin siparisi hazirlamaya baslamasi icin gereken minimum sure.
// Prompt 5'te admin panelinden ayarlanabilir hale gelecek, simdilik sabit.
export const MIN_PREP_MINUTES = 15;
const SLOT_STEP_MINUTES = 15;

function atTime(base: Date, hhmmss: string): Date {
  const [h, m, s] = hhmmss.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h, m, s || 0, 0);
  return d;
}

function roundUpToStep(date: Date, stepMinutes: number): Date {
  const ms = stepMinutes * 60 * 1000;
  return new Date(Math.ceil(date.getTime() / ms) * ms);
}

export function getPickupSlotsForToday(hours: OpeningHour[], now: Date): Date[] {
  const today = hours.find((h) => h.gun === now.getDay());
  if (!today || today.kapali) return [];

  const acilis = atTime(now, today.acilis);
  const kapanis = atTime(now, today.kapanis);
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
  if (candidate.toDateString() !== now.toDateString()) return false;

  const today = hours.find((h) => h.gun === candidate.getDay());
  if (!today || today.kapali) return false;

  const acilis = atTime(candidate, today.acilis);
  const kapanis = atTime(candidate, today.kapanis);
  const earliest = new Date(now.getTime() + MIN_PREP_MINUTES * 60 * 1000);

  if (candidate < acilis || candidate >= kapanis) return false;
  if (candidate < earliest) return false;
  return true;
}
