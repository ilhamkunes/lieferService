import type { OpeningHour, RestaurantSettings } from "@/lib/supabase/types";
import { getOpenStatus } from "@/lib/opening-hours";

export type Availability = {
  isOpen: boolean;
  nextOpenLabel: string | null;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
};

// Takvim bazli acik/kapali durumunu admin panelindeki manuel
// kapatma / teslimat-gelal durdurma ayarlariyla birlestirir.
export function getAvailability(
  hours: OpeningHour[],
  settings: RestaurantSettings,
  now: Date
): Availability {
  const schedule = getOpenStatus(hours, now);
  const isOpen = schedule.isOpen && !settings.manuel_kapatma;

  return {
    isOpen,
    nextOpenLabel: schedule.isOpen ? null : schedule.nextOpenLabel,
    deliveryAvailable: isOpen && !settings.teslimat_durduruldu,
    pickupAvailable: isOpen && !settings.gelal_durduruldu,
  };
}
