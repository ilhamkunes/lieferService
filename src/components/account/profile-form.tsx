"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { updateMyProfile } from "@/lib/supabase/account";
import { inputClass } from "@/components/checkout/form-field";

export function ProfileForm({ user }: { user: User }) {
  const [isim, setIsim] = useState((user.user_metadata?.isim as string) ?? "");
  const [telefon, setTelefon] = useState(
    (user.user_metadata?.telefon as string) ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await updateMyProfile({ isim, telefon });
    setSaving(false);
    setSaved(true);
  }

  return (
    <section className="mb-6">
      <h2 className="mb-2 font-semibold text-neutral-900">Mein Profil</h2>
      <p className="mb-2 text-sm text-neutral-500">{user.email}</p>
      <div className="space-y-2">
        <input
          placeholder="Name"
          value={isim}
          onChange={(e) => setIsim(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Telefon"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          className={inputClass}
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Speichert…" : saved ? "Gespeichert ✓" : "Speichern"}
        </button>
      </div>
    </section>
  );
}
