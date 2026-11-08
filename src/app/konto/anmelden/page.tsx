"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { isValidEmail } from "@/lib/validation";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

type Mode = "login" | "register";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/konto";
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    setError(null);
    setInfo(null);

    if (!isValidEmail(email)) {
      setError("Bitte eine gültige E-Mail-Adresse angeben.");
      return;
    }
    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen haben.");
      return;
    }

    setSubmitting(true);

    if (mode === "login") {
      const { error } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      });
      setSubmitting(false);
      if (error) {
        setError("E-Mail oder Passwort ist falsch.");
        return;
      }
      router.push(redirect);
      return;
    }

    const { data, error } = await supabaseBrowser.auth.signUp({
      email,
      password,
    });
    setSubmitting(false);
    if (error) {
      setError(
        error.message.toLowerCase().includes("already")
          ? "Diese E-Mail ist bereits registriert. Bitte anmelden."
          : "Registrierung fehlgeschlagen. Bitte erneut versuchen."
      );
      return;
    }

    if (data.session) {
      router.push(redirect);
      return;
    }

    setInfo(
      "Konto erstellt! Bitte bestätige deine E-Mail-Adresse über den Link, den wir dir geschickt haben, und melde dich danach an."
    );
    setMode("login");
  }

  async function handleForgotPassword() {
    if (!isValidEmail(email)) {
      setError("Bitte zuerst deine E-Mail-Adresse oben eingeben.");
      return;
    }
    setError(null);
    setInfo(null);
    const { error } = await supabaseBrowser.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/konto/neues-passwort`,
    });
    if (error) {
      setError("Link konnte nicht gesendet werden.");
      return;
    }
    setInfo("Falls ein Konto existiert, haben wir einen Link zum Zurücksetzen geschickt.");
  }

  return (
    <main className="flex-1 px-4 py-8">
      <h1 className="mb-4 text-lg font-semibold text-neutral-900">
        {mode === "login" ? "Anmelden" : "Konto erstellen"}
      </h1>

      <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="deine@email.de"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {info && <p className="text-sm text-green-700">{info}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-orange-500 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting
            ? "Einen Moment…"
            : mode === "login"
              ? "Anmelden"
              : "Konto erstellen"}
        </button>

        {mode === "login" && (
          <button
            type="button"
            onClick={handleForgotPassword}
            className="block w-full text-center text-sm text-neutral-500"
          >
            Passwort vergessen?
          </button>
        )}
      </form>

      <p className="mt-4 text-center text-sm text-neutral-500">
        {mode === "login" ? (
          <>
            Noch kein Konto?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
                setInfo(null);
              }}
              className="font-semibold text-orange-600"
            >
              Jetzt registrieren
            </button>
          </>
        ) : (
          <>
            Schon ein Konto?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setInfo(null);
              }}
              className="font-semibold text-orange-600"
            >
              Anmelden
            </button>
          </>
        )}
      </p>
    </main>
  );
}
