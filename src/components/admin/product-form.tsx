"use client";

import { useState } from "react";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  type ProductInput,
} from "@/lib/admin/menu";
import type { Category, Product } from "@/lib/supabase/types";

export function ProductForm({
  categories,
  product,
  defaultKategoriId,
  onClose,
  onSaved,
}: {
  categories: Category[];
  product?: Product;
  defaultKategoriId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ProductInput>({
    isim: product?.isim ?? "",
    aciklama: product?.aciklama ?? "",
    fiyat: product?.fiyat ?? 0,
    kategori_id: product?.kategori_id ?? defaultKategoriId ?? categories[0]?.id ?? "",
    fotograf_url: product?.fotograf_url ?? "",
    alerjenler: product?.alerjenler ?? [],
    one_cikan: product?.one_cikan ?? false,
  });
  const [allergeneText, setAllergeneText] = useState(
    (product?.alerjenler ?? []).join(", ")
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!form.isim.trim() || form.fiyat <= 0 || !form.kategori_id) {
      setError("Bitte Name, Preis und Kategorie angeben.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload: ProductInput = {
      ...form,
      alerjenler: allergeneText
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    };
    try {
      if (product) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      onSaved();
    } catch {
      setError("Speichern fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!product) return;
    setSaving(true);
    await deleteProduct(product.id);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <button
        type="button"
        aria-label="Schließen"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold text-neutral-900">
          {product ? "Artikel bearbeiten" : "Neuer Artikel"}
        </h2>

        <div className="space-y-3">
          <input
            placeholder="Name"
            value={form.isim}
            onChange={(e) => setForm((f) => ({ ...f, isim: e.target.value }))}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Beschreibung"
            value={form.aciklama}
            onChange={(e) => setForm((f) => ({ ...f, aciklama: e.target.value }))}
            rows={2}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              step="0.01"
              placeholder="Preis (€)"
              value={form.fiyat || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, fiyat: Number(e.target.value) }))
              }
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
            <select
              value={form.kategori_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, kategori_id: e.target.value }))
              }
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.isim}
                </option>
              ))}
            </select>
          </div>
          <input
            placeholder="Foto-URL (optional)"
            value={form.fotograf_url}
            onChange={(e) =>
              setForm((f) => ({ ...f, fotograf_url: e.target.value }))
            }
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
          <input
            placeholder="Allergene, mit Komma getrennt"
            value={allergeneText}
            onChange={(e) => setAllergeneText(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={form.one_cikan}
              onChange={(e) =>
                setForm((f) => ({ ...f, one_cikan: e.target.checked }))
              }
            />
            Als &quot;Beliebt&quot; markieren
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="w-full rounded-full bg-orange-500 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            Speichern
          </button>
          {product && (
            <button
              type="button"
              disabled={saving}
              onClick={handleDelete}
              className="w-full rounded-full bg-red-50 py-3 text-sm font-semibold text-red-600"
            >
              Artikel löschen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
