"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/config";
import { getOpeningHours } from "@/lib/supabase/menu";
import { getOpenStatus } from "@/lib/opening-hours";
import { getPickupSlotsForToday } from "@/lib/pickup";
import { findDeliveryZone, type DeliveryZone } from "@/lib/supabase/delivery";
import {
  isValidEmail,
  isValidGermanPostalCode,
  isValidPhone,
} from "@/lib/validation";
import type { OpeningHour } from "@/lib/supabase/types";
import { OrderSummary } from "@/components/checkout/order-summary";
import { FormField, inputClass, inputErrorClass } from "@/components/checkout/form-field";
import { DeliveryFields } from "@/components/checkout/delivery-fields";
import { PickupFields } from "@/components/checkout/pickup-fields";
import { PaypalButton } from "@/components/checkout/paypal-button";

type Tur = "teslimat" | "gelal";

type FormState = {
  isim: string;
  telefon: string;
  eposta: string;
  sokak: string;
  numara: string;
  posta_kodu: string;
  sehir: string;
  kapi_kat_notu: string;
};

const EMPTY_FORM: FormState = {
  isim: "",
  telefon: "",
  eposta: "",
  sokak: "",
  numara: "",
  posta_kodu: "",
  sehir: "",
  kapi_kat_notu: "",
};

type SuccessResult = {
  id: string;
  siparisNo: string;
  tur: Tur;
  toplam: number;
  almaSaati: string | null;
  paid: boolean;
};

export default function CheckoutPage() {
  const cart = useCart();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [tur, setTur] = useState<Tur>("teslimat");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [almaSaati, setAlmaSaati] = useState<string>("");

  const [hours, setHours] = useState<OpeningHour[] | null>(null);
  const [hoursLoading, setHoursLoading] = useState(true);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    getOpeningHours()
      .then((h) => setHours(h))
      .finally(() => setHoursLoading(false));
  }, []);

  const [zone, setZone] = useState<DeliveryZone | null | undefined>(undefined);
  const [zoneLoading, setZoneLoading] = useState(false);

  useEffect(() => {
    if (tur !== "teslimat") return;
    const code = form.posta_kodu.trim();
    if (!isValidGermanPostalCode(code)) {
      setZone(undefined);
      return;
    }
    let cancelled = false;
    setZoneLoading(true);
    findDeliveryZone(code)
      .then((z) => {
        if (!cancelled) setZone(z);
      })
      .finally(() => {
        if (!cancelled) setZoneLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [form.posta_kodu, tur]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessResult | null>(null);

  const pickupSlots = useMemo(
    () => (hours && now ? getPickupSlotsForToday(hours, now) : []),
    [hours, now]
  );
  const openStatus = useMemo(
    () => (hours && now ? getOpenStatus(hours, now) : null),
    [hours, now]
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!form.isim.trim()) e.isim = "Name ist erforderlich.";
    if (!isValidPhone(form.telefon))
      e.telefon = "Bitte eine gültige Telefonnummer angeben.";
    if (!isValidEmail(form.eposta))
      e.eposta = "Bitte eine gültige E-Mail-Adresse angeben.";

    if (tur === "teslimat") {
      if (!form.sokak.trim()) e.sokak = "Straße ist erforderlich.";
      if (!form.numara.trim()) e.numara = "Hausnummer ist erforderlich.";
      if (!isValidGermanPostalCode(form.posta_kodu))
        e.posta_kodu = "Bitte eine gültige Postleitzahl (5 Ziffern) angeben.";
      if (!form.sehir.trim()) e.sehir = "Stadt ist erforderlich.";
      if (zone === null) e.posta_kodu = "Leider liefern wir nicht in dieses Gebiet.";
      if (zone && cart.total < zone.minimum_siparis) {
        e.zone = `Mindestbestellwert: ${formatPrice(zone.minimum_siparis)}`;
      }
    } else {
      if (!almaSaati) e.almaSaati = "Bitte eine Abholzeit wählen.";
    }
    return e;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tur,
          musteri: { isim: form.isim, telefon: form.telefon, eposta: form.eposta },
          items: cart.items.map((i) => ({ productId: i.productId, adet: i.adet })),
          not: cart.not,
          teslimat:
            tur === "teslimat"
              ? {
                  sokak: form.sokak,
                  numara: form.numara,
                  posta_kodu: form.posta_kodu,
                  sehir: form.sehir,
                  kapi_kat_notu: form.kapi_kat_notu,
                }
              : undefined,
          alma_saati: tur === "gelal" ? almaSaati : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Bestellung konnte nicht gesendet werden.");
        return;
      }
      setSuccess({ ...data, paid: data.tur === "gelal" });
      cart.clear();
    } catch {
      setSubmitError("Netzwerkfehler. Bitte erneut versuchen.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <main className="flex-1 px-4 py-8">
        <div
          className={`mx-auto max-w-md rounded-xl border p-6 text-center ${
            success.paid
              ? "border-green-200 bg-green-50"
              : "border-orange-200 bg-orange-50"
          }`}
        >
          <h1
            className={`text-xl font-semibold ${
              success.paid ? "text-green-800" : "text-orange-800"
            }`}
          >
            {success.paid ? "Bestellung erhalten" : "Fast geschafft"}
          </h1>
          <p className={`mt-2 ${success.paid ? "text-green-700" : "text-orange-700"}`}>
            Bestellnummer: <strong>#{success.siparisNo}</strong>
          </p>
          {success.tur === "gelal" && success.almaSaati && (
            <p className="mt-1 text-green-700">
              Abholzeit:{" "}
              {new Date(success.almaSaati).toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              Uhr
            </p>
          )}
          <p
            className={`mt-1 ${success.paid ? "text-green-700" : "text-orange-700"}`}
          >
            Gesamt: {formatPrice(success.toplam)}
          </p>

          {success.tur === "teslimat" && !success.paid && (
            <div className="mt-4 rounded-lg bg-white p-4">
              <p className="mb-3 text-sm font-medium text-neutral-700">
                Bitte jetzt mit PayPal bezahlen:
              </p>
              <PaypalButton
                orderId={success.id}
                onPaid={() => setSuccess((s) => (s ? { ...s, paid: true } : s))}
              />
            </div>
          )}

          {success.paid && (
            <Link
              href="/"
              className="mt-4 inline-block rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white"
            >
              Zurück zur Speisekarte
            </Link>
          )}
        </div>
      </main>
    );
  }

  if (!hydrated || hoursLoading || !now) {
    return (
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-md animate-pulse space-y-3">
          <div className="h-8 rounded bg-neutral-100" />
          <div className="h-32 rounded bg-neutral-100" />
        </div>
      </main>
    );
  }

  if (cart.itemCount === 0) {
    return (
      <main className="flex-1 px-4 py-8 text-center">
        <p className="text-neutral-600">Dein Warenkorb ist leer.</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white"
        >
          Zur Speisekarte
        </Link>
      </main>
    );
  }

  if (openStatus && !openStatus.isOpen) {
    return (
      <main className="flex-1 px-4 py-8 text-center">
        <p className="font-medium text-red-700">
          Wir sind aktuell geschlossen und nehmen keine Bestellungen an.
        </p>
        {openStatus.nextOpenLabel && (
          <p className="mt-1 text-sm text-neutral-600">
            Öffnet wieder: {openStatus.nextOpenLabel}
          </p>
        )}
        <Link
          href="/"
          className="mt-4 inline-block rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white"
        >
          Zurück zur Speisekarte
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-6 pb-32">
      <h1 className="mb-4 text-lg font-semibold text-neutral-900">Bestellung</h1>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setTur("teslimat")}
          className={`rounded-xl py-3 text-sm font-semibold ${
            tur === "teslimat"
              ? "bg-orange-500 text-white"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          Lieferung
        </button>
        <button
          type="button"
          onClick={() => setTur("gelal")}
          className={`rounded-xl py-3 text-sm font-semibold ${
            tur === "gelal"
              ? "bg-orange-500 text-white"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          Abholung
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-3">
          <FormField label="Name" htmlFor="isim" error={errors.isim}>
            <input
              id="isim"
              value={form.isim}
              onChange={(e) => updateField("isim", e.target.value)}
              className={errors.isim ? inputErrorClass : inputClass}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Telefon" htmlFor="telefon" error={errors.telefon}>
              <input
                id="telefon"
                value={form.telefon}
                onChange={(e) => updateField("telefon", e.target.value)}
                inputMode="tel"
                className={errors.telefon ? inputErrorClass : inputClass}
              />
            </FormField>
            <FormField label="E-Mail" htmlFor="eposta" error={errors.eposta}>
              <input
                id="eposta"
                value={form.eposta}
                onChange={(e) => updateField("eposta", e.target.value)}
                inputMode="email"
                className={errors.eposta ? inputErrorClass : inputClass}
              />
            </FormField>
          </div>
        </div>

        {tur === "teslimat" ? (
          <DeliveryFields
            values={form}
            errors={errors}
            onChange={updateField}
            zone={zone}
            zoneLoading={zoneLoading}
            cartTotal={cart.total}
          />
        ) : (
          <PickupFields
            slots={pickupSlots}
            value={almaSaati}
            onChange={setAlmaSaati}
            error={errors.almaSaati}
          />
        )}

        <OrderSummary deliveryFee={tur === "teslimat" ? zone?.teslimat_ucreti : undefined} />

        {submitError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-orange-500 py-3 text-base font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "Wird gesendet…" : "Jetzt bestellen"}
        </button>
      </form>
    </main>
  );
}
