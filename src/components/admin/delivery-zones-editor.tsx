"use client";

import { useEffect, useState } from "react";
import {
  addDeliveryZone,
  deleteDeliveryZone,
  getDeliveryZonesAdmin,
  updateDeliveryZone,
} from "@/lib/admin/menu";
import type { DeliveryZoneAdmin } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/config";

const EMPTY = { posta_kodu: "", teslimat_ucreti: "", minimum_siparis: "" };

export function DeliveryZonesEditor() {
  const [zones, setZones] = useState<DeliveryZoneAdmin[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);

  function reload() {
    getDeliveryZonesAdmin().then(setZones);
  }
  useEffect(reload, []);

  async function handleAdd() {
    if (!form.posta_kodu.trim()) return;
    await addDeliveryZone({
      posta_kodu: form.posta_kodu.trim(),
      teslimat_ucreti: Number(form.teslimat_ucreti) || 0,
      minimum_siparis: Number(form.minimum_siparis) || 0,
    });
    setForm(EMPTY);
    setShowForm(false);
    reload();
  }

  async function handleDelete(id: string) {
    await deleteDeliveryZone(id);
    reload();
  }

  async function toggleActive(z: DeliveryZoneAdmin) {
    await updateDeliveryZone(z.id, { aktif: !z.aktif });
    reload();
  }

  return (
    <section className="mb-6">
      <h2 className="mb-2 font-semibold text-neutral-900">Liefergebiete</h2>
      <div className="space-y-2">
        {zones.map((z) => (
          <div
            key={z.id}
            className={`flex items-center justify-between rounded-lg border p-2 text-sm ${
              z.aktif
                ? "border-neutral-200"
                : "border-neutral-100 bg-neutral-50 text-neutral-400"
            }`}
          >
            <div>
              <p className="font-medium">{z.posta_kodu}</p>
              <p className="text-xs">
                {formatPrice(z.teslimat_ucreti)} · Mindest. {formatPrice(z.minimum_siparis)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toggleActive(z)}
                className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
              >
                {z.aktif ? "Deaktivieren" : "Aktivieren"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(z.id)}
                className="text-xs text-red-500"
              >
                Löschen
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm ? (
        <div className="mt-3 space-y-2 rounded-lg border border-neutral-200 p-3">
          <input
            placeholder="PLZ"
            value={form.posta_kodu}
            onChange={(e) => setForm((f) => ({ ...f, posta_kodu: e.target.value }))}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
          <input
            placeholder="Liefergebühr (€)"
            value={form.teslimat_ucreti}
            onChange={(e) =>
              setForm((f) => ({ ...f, teslimat_ucreti: e.target.value }))
            }
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
          <input
            placeholder="Mindestbestellwert (€)"
            value={form.minimum_siparis}
            onChange={(e) =>
              setForm((f) => ({ ...f, minimum_siparis: e.target.value }))
            }
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white"
            >
              Speichern
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-600"
            >
              Abbrechen
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-3 text-sm font-semibold text-orange-600"
        >
          + Neues Gebiet
        </button>
      )}
    </section>
  );
}
