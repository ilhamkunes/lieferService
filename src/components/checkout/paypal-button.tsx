"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: Record<string, unknown>) => {
        render: (container: HTMLElement) => void;
      };
    };
  }
}

function loadPaypalScript(clientId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.paypal) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>("#paypal-sdk");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("PayPal SDK konnte nicht geladen werden."))
      );
      return;
    }
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&currency=EUR&intent=capture`;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("PayPal SDK konnte nicht geladen werden."));
    document.body.appendChild(script);
  });
}

export function PaypalButton({
  orderId,
  onPaid,
}: {
  orderId: string;
  onPaid: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onPaidRef = useRef(onPaid);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onPaidRef.current = onPaid;
  }, [onPaid]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      setError("PayPal ist noch nicht konfiguriert.");
      return;
    }

    let cancelled = false;

    loadPaypalScript(clientId)
      .then(() => {
        if (cancelled || !containerRef.current || !window.paypal) return;
        setReady(true);
        window.paypal
          .Buttons({
            style: { layout: "vertical", color: "gold", label: "paypal", shape: "pill" },
            createOrder: async () => {
              const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error ?? "Fehler");
              return data.paypalOrderId;
            },
            onApprove: async (data: { orderID: string }) => {
              const res = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, paypalOrderId: data.orderID }),
              });
              const result = await res.json();
              if (!res.ok || !result.success) {
                setError(
                  result.error ?? "Zahlung fehlgeschlagen. Bitte erneut versuchen."
                );
                return;
              }
              onPaidRef.current();
            },
            onError: () => {
              setError(
                "Bei der Zahlung ist ein Fehler aufgetreten. Bitte erneut versuchen."
              );
            },
          })
          .render(containerRef.current);
      })
      .catch((err: Error) => setError(err.message));

    return () => {
      cancelled = true;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [orderId]);

  return (
    <div>
      <div ref={containerRef} />
      {!ready && !error && (
        <p className="text-sm text-neutral-400">PayPal wird geladen…</p>
      )}
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
