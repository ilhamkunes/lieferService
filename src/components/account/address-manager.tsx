"use client";

import { useEffect, useState } from "react";
import {
  addMyAddress,
  deleteMyAddress,
  getMyAddresses,
} from "@/lib/supabase/account";
import type { CustomerAddress } from "@/lib/supabase/types";
import { isValidGermanPostalCode } from "@/lib/validation";
import { inputClass } from "@/components/checkout/form-field";

const EMPTY_ADDRESS = {
  etiket: "Zuhause",
  sokak: "",
  numara: "",
  posta_kodu: "",
  sehir: "",
  kapi_kat_notu: "",
};

export function AddressManager() {
  const [addresses, setAddresses] = useState<CustomerAddress[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_ADDRESS);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function reload() {
    getMyAddresses().then(setAddresses);
  }

  useEffect(reload, []);

  async function handleAdd() {
    if (
      !form.sokak.trim() ||
      !form.numara.trim() ||
      !isValidGermanPostalCode(form.posta_kodu) ||
      !form.sehir.trim()
    ) {
      setError("Bitte Straße, Hausnummer, eine gültige PLZ und Stadt angeben.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await addMyAddress(form);
      setForm(EMPTY_ADDRESS);
      setShowForm(false);
      reload();
    } catch {
      setError("Adresse konnte nicht gespeichert werden.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteMyAddress(id);
    reload();
  }

  return (
    <section className="mb-6">
      <h2 className="mb-2 font-semibold text-neutral-900">Meine Adressen</h2>

      {addresses === null && (
        <p className="text-sm text-neutral-400">Wird geladen…</p>
      )}
      {addresses?.length === 0 && !showForm && (
        <p className="text-sm text-neutral-500">Noch keine Adresse gespeichert.</p>
      )}

      <div className="space-y-2">
        {addresses?.map((a) => (
          <div
            key={a.id}
            className="flex items-start justify-between rounded-lg border border-neutral-200 p-3"
          >
            <div className="text-sm text-neutral-700">
              <p className="font-medium text-neutral-900">{a.etiket}</p>
              <p>
                {a.sokak} {a.numara}, {a.posta_kodu} {a.sehir}
              </p>
              {a.kapi_kat_notu && (
                <p className="text-neutral-400">{a.kapi_kat_notu}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleDelete(a.id)}
              className="text-sm text-red-500"
            >
              Löschen
            </button>
          </div>
        ))}
      </div>

      {showForm ? (
        <div className="mt-3 space-y-2 rounded-lg border border-neutral-200 p-3">
          <input
            placeholder="Bezeichnung (z. B. Zuhause)"
            value={form.etiket}
            onChange={(e) => setForm((f) => ({ ...f, etiket: e.target.value }))}
            className={inputClass}
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              placeholder="Straße"
              value={form.sokak}
              onChange={(e) => setForm((f) => ({ ...f, sokak: e.target.value }))}
              className={`col-span-2 ${inputClass}`}
            />
            <input
              placeholder="Nr."
              value={form.numara}
              onChange={(e) => setForm((f) => ({ ...f, numara: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="PLZ"
              value={form.posta_kodu}
              onChange={(e) => setForm((f) => ({ ...f, posta_kodu: e.target.value }))}
              className={inputClass}
            />
            <input
              placeholder="Stadt"
              value={form.sehir}
              onChange={(e) => setForm((f) => ({ ...f, sehir: e.target.value }))}
              className={inputClass}
            />
          </div>
          <input
            placeholder="Etage / Türnotiz (optional)"
            value={form.kapi_kat_notu}
            onChange={(e) =>
              setForm((f) => ({ ...f, kapi_kat_notu: e.target.value }))
            }
            className={inputClass}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={saving}
              className="rounded-full bg-terracotta px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Speichert…" : "Speichern"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError(null);
              }}
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
          className="mt-3 text-sm font-semibold text-terracotta"
        >
          + Neue Adresse
        </button>
      )}
    </section>
  );
}
