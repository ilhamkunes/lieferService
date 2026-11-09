"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "lieferservice_cookie_hinweis_gesehen";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage yoksa (gizli sekme vb.) sessizce yoksay
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border-warm bg-white px-5 py-4 shadow-[0_-4px_20px_rgba(36,28,22,0.12)]">
      <div className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted">
          Diese Website speichert nur technisch notwendige Daten in
          deinem Browser (Warenkorb, Login-Sitzung) – keine Tracking-
          oder Marketing-Cookies.{" "}
          <Link href="/datenschutz" className="font-semibold text-terracotta underline">
            Mehr erfahren
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-full bg-terracotta px-5 py-2 text-xs font-semibold text-cream"
        >
          Verstanden
        </button>
      </div>
    </div>
  );
}
