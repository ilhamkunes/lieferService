"use client";

import { useEffect, useState } from "react";
import { useAdminSettings } from "@/lib/admin/settings-context";
import { updateSettings } from "@/lib/admin/settings";
import type { RestaurantSettings } from "@/lib/supabase/types";
import { OpeningHoursEditor } from "@/components/admin/opening-hours-editor";
import { DeliveryZonesEditor } from "@/components/admin/delivery-zones-editor";

function StatusRow({
  label,
  active,
  activeLabel,
  pausedLabel,
  onToggle,
}: {
  label: string;
  active: boolean;
  activeLabel: string;
  pausedLabel: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-lg border border-neutral-200 p-3 text-left"
    >
      <span className="font-medium text-neutral-900">{label}</span>
      <span
        className={`text-sm font-semibold ${active ? "text-green-600" : "text-red-600"}`}
      >
        {active ? activeLabel : pausedLabel}
      </span>
    </button>
  );
}

function MinuteStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-3">
      <span className="font-medium text-neutral-900">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(5, value - 5))}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-lg font-bold"
        >
          −
        </button>
        <span className="w-16 text-center font-semibold">{value} Min.</span>
        <button
          type="button"
          onClick={() => onChange(value + 5)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-lg font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
}

function BrandingEditor({
  settings,
  onSaved,
}: {
  settings: RestaurantSettings;
  onSaved: () => void;
}) {
  const [kapak, setKapak] = useState(settings.kapak_foto_url ?? "");
  const [logo, setLogo] = useState(settings.logo_url ?? "");

  useEffect(() => {
    setKapak(settings.kapak_foto_url ?? "");
    setLogo(settings.logo_url ?? "");
  }, [settings.kapak_foto_url, settings.logo_url]);

  async function save() {
    await updateSettings({
      kapak_foto_url: kapak.trim() || null,
      logo_url: logo.trim() || null,
    });
    onSaved();
  }

  return (
    <section className="mb-6 space-y-2">
      <h2 className="mb-2 font-semibold text-neutral-900">Design</h2>
      <input
        placeholder="Kapak-Foto-URL"
        value={kapak}
        onChange={(e) => setKapak(e.target.value)}
        onBlur={save}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
      />
      <input
        placeholder="Logo-URL"
        value={logo}
        onChange={(e) => setLogo(e.target.value)}
        onBlur={save}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
      />
    </section>
  );
}

export default function EinstellungenPage() {
  const { settings, refresh } = useAdminSettings();

  if (!settings) {
    return <main className="px-4 py-4 text-sm text-neutral-400">Wird geladen…</main>;
  }

  async function set(patch: Partial<RestaurantSettings>) {
    await updateSettings(patch);
    refresh();
  }

  return (
    <main className="px-4 py-4">
      <BrandingEditor settings={settings} onSaved={refresh} />

      <section className="mb-6 space-y-2">
        <StatusRow
          label="Restaurant"
          active={!settings.manuel_kapatma}
          activeLabel="Geöffnet"
          pausedLabel="Geschlossen"
          onToggle={() => set({ manuel_kapatma: !settings.manuel_kapatma })}
        />
        <StatusRow
          label="Lieferung"
          active={!settings.teslimat_durduruldu}
          activeLabel="Verfügbar"
          pausedLabel="Pausiert"
          onToggle={() => set({ teslimat_durduruldu: !settings.teslimat_durduruldu })}
        />
        <StatusRow
          label="Abholung"
          active={!settings.gelal_durduruldu}
          activeLabel="Verfügbar"
          pausedLabel="Pausiert"
          onToggle={() => set({ gelal_durduruldu: !settings.gelal_durduruldu })}
        />
      </section>

      <section className="mb-6 space-y-2">
        <MinuteStepper
          label="Zubereitung dauert"
          value={settings.hazirlik_dakika}
          onChange={(v) => set({ hazirlik_dakika: v })}
        />
        <MinuteStepper
          label="Lieferung dauert"
          value={settings.teslimat_dakika}
          onChange={(v) => set({ teslimat_dakika: v })}
        />
      </section>

      <OpeningHoursEditor />
      <DeliveryZonesEditor />
    </main>
  );
}
