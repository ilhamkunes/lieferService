"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RESTAURANT_NAME } from "@/lib/config";

const LINKS = [
  { href: "/admin/bestellungen", label: "Bestellungen" },
  { href: "/admin/einstellungen", label: "Einstellungen" },
  { href: "/admin/speisekarte", label: "Speisekarte" },
  { href: "/admin/historie", label: "Bestellhistorie" },
];

export function AdminNav({ onLogout }: { onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-2xl leading-none"
          aria-label="Menü"
        >
          ☰
        </button>
        <span className="font-semibold text-neutral-900">{RESTAURANT_NAME}</span>
        <button type="button" onClick={onLogout} className="text-sm text-neutral-500">
          Abmelden
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 flex">
          <button
            type="button"
            aria-label="Schließen"
            onClick={() => setOpen(false)}
            className="flex-1 bg-black/40"
          />
          <nav className="w-64 bg-white p-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-3 text-sm font-medium ${
                  pathname.startsWith(l.href)
                    ? "bg-orange-50 text-orange-600"
                    : "text-neutral-700"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
