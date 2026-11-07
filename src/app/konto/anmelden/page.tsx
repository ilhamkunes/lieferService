"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { isValidEmail } from "@/lib/validation";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/konto";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!isValidEmail(email)) {
      setError("Bitte eine gültige E-Mail-Adresse angeben.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${redirect}` },
    });
    setSubmitting(false);
    if (error) {
      setError("Link konnte nicht gesendet werden. Bitte erneut versuchen.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <main className="flex-1 px-4 py-8 text-center">
        <p className="text-neutral-700">
          Wir haben dir einen Anmeldelink an <strong>{email}</strong> geschickt.
          Öffne dein E-Mail-Postfach und klicke auf den Link.
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-8">
      <h1 className="mb-1 text-lg font-semibold text-neutral-900">Anmelden</h1>
      <p className="mb-4 text-sm text-neutral-500">
        Kein Passwort nötig – wir schicken dir einen Anmeldelink per E-Mail.
      </p>
      <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="deine@email.de"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-orange-500 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "Wird gesendet…" : "Anmeldelink senden"}
        </button>
      </form>
    </main>
  );
}
