"use client";

import { useAdminSettings } from "@/lib/admin/settings-context";
import { updateSettings } from "@/lib/admin/settings";

export function PausedBanner() {
  const { settings, refresh } = useAdminSettings();
  if (!settings) return null;

  async function resume(field: "teslimat_durduruldu" | "gelal_durduruldu") {
    await updateSettings({ [field]: false });
    refresh();
  }

  return (
    <>
      {settings.manuel_kapatma && (
        <div className="flex items-center justify-between bg-red-50 px-4 py-2 text-sm">
          <span className="font-medium text-red-700">Restaurant manuell geschlossen</span>
          <button
            type="button"
            onClick={async () => {
              await updateSettings({ manuel_kapatma: false });
              refresh();
            }}
            className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white"
          >
            Jetzt öffnen
          </button>
        </div>
      )}
      {settings.teslimat_durduruldu && (
        <div className="flex items-center justify-between bg-yellow-50 px-4 py-2 text-sm">
          <span className="font-medium text-yellow-800">Lieferung pausiert</span>
          <button
            type="button"
            onClick={() => resume("teslimat_durduruldu")}
            className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white"
          >
            Jetzt fortsetzen
          </button>
        </div>
      )}
      {settings.gelal_durduruldu && (
        <div className="flex items-center justify-between bg-yellow-50 px-4 py-2 text-sm">
          <span className="font-medium text-yellow-800">Abholung pausiert</span>
          <button
            type="button"
            onClick={() => resume("gelal_durduruldu")}
            className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white"
          >
            Jetzt fortsetzen
          </button>
        </div>
      )}
    </>
  );
}
