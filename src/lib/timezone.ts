// Sunucu (Vercel) UTC'de calisir, tarayici ise kullanicinin kendi saat
// diliminde. Acilis saatlerimiz hep Almanya saatine gore oldugu icin,
// "su an kac" sorusunu HER ZAMAN Europe/Berlin'e gore cevaplamamiz lazim -
// calistigi ortamin yerel saatine (Date.getHours() vb.) guvenmeden.
const TIME_ZONE = "Europe/Berlin";

const WEEKDAY_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export type BerlinParts = {
  year: number;
  month: number; // 1-12
  day: number;
  weekday: number; // 0 = Pazar ... 6 = Cumartesi
  hours: number;
  minutes: number;
};

function formatParts(date: Date, withSeconds: boolean): Record<string, string> {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: withSeconds ? "2-digit" : undefined,
    hour12: false,
  });
  const map: Record<string, string> = {};
  for (const p of fmt.formatToParts(date)) map[p.type] = p.value;
  return map;
}

export function getBerlinParts(date: Date): BerlinParts {
  const map = formatParts(date, false);
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    weekday: WEEKDAY_MAP[map.weekday],
    hours: Number(map.hour) % 24,
    minutes: Number(map.minute),
  };
}

function getBerlinOffsetMinutes(date: Date): number {
  const map = formatParts(date, true);
  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour) % 24,
    Number(map.minute),
    Number(map.second)
  );
  return Math.round((asUtc - date.getTime()) / 60_000);
}

// year/month(1-12)/day/hour/minute olarak verilen Berlin yerel saatine
// karsilik gelen gercek ani (doğru UTC Date) dondurur. Yaz/kis saati
// (CET/CEST) farkini otomatik hesaba katar.
export function berlinWallTimeToDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): Date {
  const guessUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const offsetMinutes = getBerlinOffsetMinutes(guessUtc);
  return new Date(guessUtc.getTime() - offsetMinutes * 60_000);
}
