"use client";

import { useEffect, useRef, useState } from "react";
import { getActiveOrders } from "@/lib/admin/orders";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useAdminSettings } from "@/lib/admin/settings-context";
import { OrderCard } from "@/components/admin/order-card";
import type { AdminOrder } from "@/lib/supabase/types";

type Tab = "zubereiten" | "uebergabe" | "fertig";

const TABS: { key: Tab; label: string }[] = [
  { key: "zubereiten", label: "Zubereiten" },
  { key: "uebergabe", label: "Übergabe" },
  { key: "fertig", label: "Fertig" },
];

export default function BestellungenPage() {
  const { settings } = useAdminSettings();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [tab, setTab] = useState<Tab>("zubereiten");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [soundUnlocked, setSoundUnlocked] = useState(false);

  function refresh() {
    getActiveOrders().then(setOrders);
  }

  useEffect(() => {
    refresh();
    const channel = supabaseBrowser
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => refresh()
      )
      .subscribe();
    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, []);

  function beep() {
    try {
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state !== "running") return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // tarayici sesi engellemis olabilir, sessizce gec
    }
  }

  // iOS/Safari sesin önce bir dokunuşla açılmasını zorunlu kılar - bu yuzden
  // AudioContext sadece bu buton tiklamasinda (gercek bir kullanici
  // etkilesiminde) olusturulup "resume" edilir. Bu olmadan arka planda
  // (setInterval/Realtime) baslatilan ses iPhone'da hic calismaz.
  function unlockSound() {
    try {
      const ctx = audioCtxRef.current ?? new AudioContext();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") ctx.resume();
      setSoundUnlocked(true);
      // kisa bir test sesi caldirip baglantiyi kesinlestir
      setTimeout(beep, 50);
    } catch {
      setSoundUnlocked(true);
    }
  }

  const neueCount = orders.filter((o) => o.siparis_durumu === "yeni").length;

  useEffect(() => {
    if (neueCount === 0 || !soundUnlocked) return;
    beep();
    const id = setInterval(beep, 1800);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [neueCount, soundUnlocked]);

  const zubereiten = orders.filter(
    (o) => o.siparis_durumu === "yeni" || o.siparis_durumu === "hazirlaniyor"
  );
  const uebergabe = orders.filter((o) => o.siparis_durumu === "teslime_hazir");
  const fertig = orders.filter((o) => o.siparis_durumu === "tamamlandi");

  const counts: Record<Tab, number> = {
    zubereiten: zubereiten.length,
    uebergabe: uebergabe.length,
    fertig: fertig.length,
  };

  const listByTab: Record<Tab, AdminOrder[]> = {
    zubereiten,
    uebergabe,
    fertig,
  };

  return (
    <main className="px-4 py-4">
      {!soundUnlocked && (
        <button
          type="button"
          onClick={unlockSound}
          className="mb-4 flex w-full items-center justify-between rounded-lg bg-orange-50 px-4 py-2 text-sm font-medium text-orange-800"
        >
          <span>🔔 Ton für neue Bestellungen aktivieren</span>
          <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
            Aktivieren
          </span>
        </button>
      )}

      <div className="mb-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold ${
              tab === t.key ? "bg-orange-500 text-white" : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {listByTab[tab].length === 0 && (
          <p className="py-8 text-center text-sm text-neutral-400">
            Keine Bestellungen hier.
          </p>
        )}
        {listByTab[tab].map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            defaultMinutes={settings?.hazirlik_dakika ?? 20}
            onChanged={refresh}
          />
        ))}
      </div>
    </main>
  );
}
