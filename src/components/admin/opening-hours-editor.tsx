"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { updateOpeningHour } from "@/lib/admin/menu";
import type { OpeningHour } from "@/lib/supabase/types";

const GUN_ADI = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

export function OpeningHoursEditor() {
  const [hours, setHours] = useState<OpeningHour[]>([]);

  function reload() {
    supabaseBrowser
      .from("opening_hours")
      .select("gun, acilis, kapanis, kapali")
      .order("gun")
      .then(({ data }) => {
        if (data) setHours(data);
      });
  }
  useEffect(reload, []);

  async function save(gun: number, patch: Partial<OpeningHour>) {
    await updateOpeningHour(gun, patch);
    reload();
  }

  return (
    <section className="mb-6">
      <h2 className="mb-2 font-semibold text-neutral-900">Öffnungszeiten</h2>
      <div className="space-y-2">
        {hours.map((h) => (
          <div
            key={h.gun}
            className="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 p-2 text-sm"
          >
            <span className="w-24 shrink-0">{GUN_ADI[h.gun]}</span>
            {h.kapali ? (
              <span className="flex-1 text-neutral-400">Geschlossen</span>
            ) : (
              <>
                <input
                  type="time"
                  value={h.acilis.slice(0, 5)}
                  onChange={(e) => save(h.gun, { acilis: `${e.target.value}:00` })}
                  className="rounded border border-neutral-200 px-2 py-1"
                />
                <span>–</span>
                <input
                  type="time"
                  value={h.kapanis.slice(0, 5)}
                  onChange={(e) => save(h.gun, { kapanis: `${e.target.value}:00` })}
                  className="rounded border border-neutral-200 px-2 py-1"
                />
              </>
            )}
            <button
              type="button"
              onClick={() => save(h.gun, { kapali: !h.kapali })}
              className="ml-auto rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
            >
              {h.kapali ? "Öffnen" : "Schließen"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
