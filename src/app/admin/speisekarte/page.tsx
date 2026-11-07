"use client";

import { useEffect, useState } from "react";
import { getCategories, getProducts } from "@/lib/supabase/menu";
import { addCategory, toggleProductAvailability } from "@/lib/admin/menu";
import type { Category, Product } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/config";
import { ProductForm } from "@/components/admin/product-form";

export default function SpeisekartePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  function reload() {
    getCategories().then(setCategories);
    getProducts().then(setProducts);
  }
  useEffect(reload, []);

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return;
    await addCategory(newCategoryName.trim(), categories.length + 1);
    setNewCategoryName("");
    setShowNewCategory(false);
    reload();
  }

  async function handleToggle(p: Product) {
    await toggleProductAvailability(p.id, !p.mevcut_mu);
    reload();
  }

  const filtered = products.filter((p) => {
    if (activeCategory && p.kategori_id !== activeCategory) return false;
    if (search && !p.isim.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="px-4 py-4">
      <input
        placeholder="Suche…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
            activeCategory === null ? "bg-orange-500 text-white" : "bg-neutral-100 text-neutral-600"
          }`}
        >
          Alle
        </button>
        {categories.map((c) => {
          const count = products.filter(
            (p) => p.kategori_id === c.id && p.mevcut_mu
          ).length;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                activeCategory === c.id
                  ? "bg-orange-500 text-white"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {c.isim} ({count} vorrätig)
            </button>
          );
        })}

        {showNewCategory ? (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Neue Kategorie"
              className="w-32 rounded-full border border-neutral-200 px-3 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="rounded-full bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white"
            >
              OK
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowNewCategory(true)}
            className="rounded-full bg-neutral-50 px-3 py-1.5 text-sm font-medium text-orange-600"
          >
            + Kategorie
          </button>
        )}
      </div>

      <div className="space-y-2">
        {filtered.map((p) => (
          <div
            key={p.id}
            role="button"
            tabIndex={0}
            onClick={() => setEditingProduct(p)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditingProduct(p);
            }}
            className="flex w-full items-center justify-between rounded-lg border border-neutral-200 p-3 text-left"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-neutral-900">{p.isim}</p>
              <p className="text-sm text-neutral-500">{formatPrice(p.fiyat)}</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle(p);
              }}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                p.mevcut_mu
                  ? "bg-orange-500 text-white"
                  : "bg-neutral-200 text-neutral-500"
              }`}
            >
              {p.mevcut_mu ? "Verfügbar" : "Ausverkauft"}
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowNewProduct(true)}
        className="fixed bottom-4 right-4 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg"
      >
        + Neuer Artikel
      </button>

      {(showNewProduct || editingProduct) && (
        <ProductForm
          categories={categories}
          product={editingProduct ?? undefined}
          defaultKategoriId={activeCategory ?? undefined}
          onClose={() => {
            setShowNewProduct(false);
            setEditingProduct(null);
          }}
          onSaved={() => {
            setShowNewProduct(false);
            setEditingProduct(null);
            reload();
          }}
        />
      )}
    </main>
  );
}
