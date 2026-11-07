"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import {
  getExistingPushSubscription,
  isPushSupported,
  subscribeToPush,
} from "@/lib/push-client";

export function PushNotificationBanner() {
  const [status, setStatus] = useState<
    "checking" | "subscribed" | "unsubscribed" | "unsupported"
  >("checking");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPushSupported()) {
      setStatus("unsupported");
      return;
    }
    getExistingPushSubscription().then((sub) => {
      setStatus(sub ? "subscribed" : "unsubscribed");
    });
  }, []);

  async function handleEnable() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Nicht angemeldet.");
      await subscribeToPush(token);
      setStatus("subscribed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Aktivieren.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "checking" || status === "subscribed" || status === "unsupported") {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 bg-orange-50 px-4 py-2 text-sm">
      <span className="text-orange-800">
        Push-Benachrichtigungen für neue Bestellungen aktivieren?
      </span>
      <div className="flex shrink-0 items-center gap-2">
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="button"
          onClick={handleEnable}
          disabled={loading}
          className="rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {loading ? "…" : "Aktivieren"}
        </button>
      </div>
    </div>
  );
}
