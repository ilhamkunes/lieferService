"use client";

import { useEffect, useState } from "react";

type OrderStatus = {
  siparis_durumu: "yeni" | "hazirlaniyor" | "teslime_hazir" | "tamamlandi" | "reddedildi";
  tahmini_hazir_saat: string | null;
  red_sebebi: string | null;
  tur: "teslimat" | "gelal";
  alma_saati: string | null;
};

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusText(s: OrderStatus): { title: string; tone: "wait" | "ok" | "done" | "rejected" } {
  switch (s.siparis_durumu) {
    case "yeni":
      return { title: "Warten auf Bestätigung durch das Restaurant…", tone: "wait" };
    case "hazirlaniyor":
      return {
        title: s.tahmini_hazir_saat
          ? `Wird zubereitet – fertig ca. ${timeLabel(s.tahmini_hazir_saat)} Uhr`
          : "Wird zubereitet…",
        tone: "ok",
      };
    case "teslime_hazir":
      return {
        title: s.tur === "gelal" ? "Bereit zur Abholung!" : "Bereit zur Lieferung!",
        tone: "ok",
      };
    case "tamamlandi":
      return {
        title: s.tur === "gelal" ? "Abgeholt – guten Appetit!" : "Geliefert – guten Appetit!",
        tone: "done",
      };
    case "reddedildi":
      return {
        title: `Leider abgelehnt${s.red_sebebi ? `: ${s.red_sebebi}` : "."}`,
        tone: "rejected",
      };
  }
}

const TONE_CLASSES: Record<string, string> = {
  wait: "bg-neutral-100 text-neutral-700",
  ok: "bg-emerald-50 text-emerald-800",
  done: "bg-emerald-50 text-emerald-800",
  rejected: "bg-red-50 text-red-700",
};

export function OrderStatusLive({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        if (res.ok && !cancelled) {
          const data: OrderStatus = await res.json();
          setStatus(data);
          if (data.siparis_durumu === "tamamlandi" || data.siparis_durumu === "reddedildi") {
            return; // bitti, polling'i durdur
          }
        }
      } catch {
        // sessizce yoksay, bir sonraki pollde tekrar dener
      }
      if (!cancelled) timer = setTimeout(poll, 5000);
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId]);

  if (!status) return null;

  const { title, tone } = statusText(status);

  return (
    <div className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium ${TONE_CLASSES[tone]}`}>
      {title}
    </div>
  );
}
