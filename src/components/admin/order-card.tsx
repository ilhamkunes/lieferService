"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/config";
import {
  acceptOrder,
  advanceOrder,
  getOrderItems,
  rejectOrder,
} from "@/lib/admin/orders";
import type { AdminOrder, AdminOrderItem } from "@/lib/supabase/types";
import { CountdownCircle } from "@/components/admin/countdown-circle";

function orderTimeLabel(order: AdminOrder): string {
  if (order.tur === "gelal" && order.alma_saati) {
    return new Date(order.alma_saati).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return "ASAP";
}

function mapsUrl(order: AdminOrder): string {
  const address = `${order.sokak} ${order.numara}, ${order.posta_kodu} ${order.sehir}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function OrderCard({
  order,
  defaultMinutes,
  onChanged,
}: {
  order: AdminOrder;
  defaultMinutes: number;
  onChanged: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState<AdminOrderItem[] | null>(null);
  const [showAccept, setShowAccept] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  async function toggleExpand() {
    const next = !expanded;
    setExpanded(next);
    if (next && items === null) {
      setItems(await getOrderItems(order.id));
    }
  }

  async function handleAccept() {
    setBusy(true);
    await acceptOrder(order.id, minutes);
    setBusy(false);
    setShowAccept(false);
    onChanged();
  }

  async function handleReject() {
    if (!reason.trim()) return;
    setBusy(true);
    await rejectOrder(order.id, reason.trim());
    setBusy(false);
    setShowReject(false);
    onChanged();
  }

  async function handleAdvance(next: "teslime_hazir" | "tamamlandi") {
    setBusy(true);
    await advanceOrder(order.id, next);
    setBusy(false);
    onChanged();
  }

  const paidBadge =
    order.odeme_durumu === "odendi" ? (
      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
        PayPal bezahlt
      </span>
    ) : (
      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
        Zahlung im Laden
      </span>
    );

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3">
      <button
        type="button"
        onClick={toggleExpand}
        className="flex w-full items-center gap-3 text-left"
      >
        <CountdownCircle
          target={order.siparis_durumu === "hazirlaniyor" ? order.tahmini_hazir_saat : null}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-neutral-900">
            {order.tur === "gelal"
              ? "Abholung"
              : `${order.sokak} ${order.numara}, ${order.sehir}`}
          </p>
          <p className="text-sm text-neutral-500">
            {order.musteri_adi} · {orderTimeLabel(order)} · #{order.siparis_no}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {paidBadge}
          <span className="font-semibold text-neutral-900">{formatPrice(order.toplam)}</span>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-neutral-100 pt-3 text-sm">
          {items?.map((it) => (
            <div key={it.id} className="flex justify-between text-neutral-700">
              <span>
                {it.adet}× {it.urun_adi}
              </span>
              <span>{formatPrice(it.birim_fiyat * it.adet)}</span>
            </div>
          ))}
          {order.not_metni && (
            <p className="text-neutral-500">Notiz: {order.not_metni}</p>
          )}
          <p className="text-neutral-500">Telefon: {order.telefon}</p>
          {order.tur === "teslimat" && (
            <a
              href={mapsUrl(order)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-orange-600"
            >
              In Google Maps öffnen
            </a>
          )}
        </div>
      )}

      {/* Aksiyonlar */}
      {order.siparis_durumu === "yeni" && (
        <div className="mt-3 flex gap-2 border-t border-neutral-100 pt-3">
          <button
            type="button"
            onClick={() => setShowAccept(true)}
            className="flex-1 rounded-full bg-orange-500 py-2 text-sm font-semibold text-white"
          >
            Annehmen
          </button>
          <button
            type="button"
            onClick={() => setShowReject(true)}
            className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-600"
          >
            Ablehnen
          </button>
        </div>
      )}

      {showAccept && (
        <div className="mt-3 rounded-lg bg-neutral-50 p-3">
          <p className="mb-2 text-sm font-medium text-neutral-700">
            Zubereitungszeit
          </p>
          <div className="mb-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMinutes((m) => Math.max(5, m - 5))}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-lg font-bold"
            >
              −
            </button>
            <span className="w-16 text-center font-semibold">{minutes} Min.</span>
            <button
              type="button"
              onClick={() => setMinutes((m) => m + 5)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-lg font-bold"
            >
              +
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={handleAccept}
              className="flex-1 rounded-full bg-orange-500 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Bestätigen
            </button>
            <button
              type="button"
              onClick={() => setShowAccept(false)}
              className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-600"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {showReject && (
        <div className="mt-3 rounded-lg bg-neutral-50 p-3">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Grund der Ablehnung"
            className="mb-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy || !reason.trim()}
              onClick={handleReject}
              className="flex-1 rounded-full bg-red-600 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Ablehnen bestätigen
            </button>
            <button
              type="button"
              onClick={() => setShowReject(false)}
              className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-600"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {order.siparis_durumu === "hazirlaniyor" && (
        <div className="mt-3 border-t border-neutral-100 pt-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => handleAdvance("teslime_hazir")}
            className="w-full rounded-full bg-orange-500 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Bereit zur {order.tur === "gelal" ? "Abholung" : "Übergabe"}
          </button>
        </div>
      )}

      {order.siparis_durumu === "teslime_hazir" && (
        <div className="mt-3 border-t border-neutral-100 pt-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => handleAdvance("tamamlandi")}
            className="w-full rounded-full bg-green-600 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Fertig
          </button>
        </div>
      )}
    </div>
  );
}
