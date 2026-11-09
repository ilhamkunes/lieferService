"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useAuthUser } from "@/lib/auth/use-auth-user";

export default function NewPasswordPage() {
  const { user, loading } = useAuthUser();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen haben.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const { error } = await supabaseBrowser.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      setError("Passwort konnte nicht gespeichert werden. Bitte Link erneut anfordern.");
      return;
    }
    router.push("/konto");
  }

  if (loading) {
    return (
      <main className="flex-1 px-4 py-8">
        <p className="text-sm text-neutral-400">Wird geladen…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex-1 px-4 py-8 text-center">
        <p className="text-neutral-700">
          Dieser Link ist abgelaufen oder ungültig. Bitte fordere einen neuen
          Link an.
        </p>
        <Link
          href="/konto/anmelden"
          className="mt-4 inline-block rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white"
        >
          Zurück zur Anmeldung
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-8">
      <h1 className="mb-4 text-lg font-semibold text-neutral-900">
        Neues Passwort festlegen
      </h1>
      <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Neues Passwort"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-terracotta py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "Wird gespeichert…" : "Passwort speichern"}
        </button>
      </form>
    </main>
  );
}
