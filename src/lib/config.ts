// Tek yerden ayar: restoran adini degistirmek icin sadece burayi duzenle.
export const RESTAURANT_NAME = "Bugday";

export const CURRENCY = "EUR";
export const LOCALE = "de-DE";

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
  }).format(amount);
}
