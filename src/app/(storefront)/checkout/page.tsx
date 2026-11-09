"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/config";
import { getOpeningHours } from "@/lib/supabase/menu";
import { getRestaurantSettings } from "@/lib/supabase/settings";
import { getAvailability } from "@/lib/availability";
import { getPickupSlotsForToday } from "@/lib/pickup";
import {
  findDeliveryZone,
  effectiveDeliveryFee,
  type DeliveryZone,
} from "@/lib/supabase/delivery";
import {
  isValidEmail,
  isValidGermanPostalCode,
  isValidPhone,
} from "@/lib/validation";
import type {
  CustomerAddress,
  OpeningHour,
  RestaurantSettings,
} from "@/lib/supabase/types";
import { OrderSummary } from "@/components/checkout/order-summary";
import { FormField, inputClass, inputErrorClass } from "@/components/checkout/form-field";
import { DeliveryFields } from "@/components/checkout/delivery-fields";
import { PickupFields } from "@/components/checkout/pickup-fields";
import { PaypalButton } from "@/components/checkout/paypal-button";
import { OrderStatusLive } from "@/components/checkout/order-status-live";
import { useAuthUser } from "@/lib/auth/use-auth-user";
import { supabaseBrowser } from "@/lib/supabase/client";
import { addMyAddress, getMyAddresses } from "@/lib/supabase/account";

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
  const { user } = useAuthUser();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [tur, setTur] = useState<Tur>("teslimat");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [almaSaati, setAlmaSaati] = useState<string>("");

  // /bestellen sayfasinda secilen Abholung/Lieferung tercihini devral.
  useEffect(() => {
    if (cart.orderType) setTur(cart.orderType);
  }, [cart.orderType]);

  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(true);

  useEffect(() => {
    if (!user) {
      setAddresses([]);
      return;
    }
    setForm((f) => ({
      ...f,
      isim: f.isim || (user.user_metadata?.isim as string) || "",
      telefon: f.telefon || (user.user_metadata?.telefon as string) || "",
      eposta: user.email ?? f.eposta,
    }));
    getMyAddresses().then(setAddresses);
  }, [user]);

  function selectAddress(a: CustomerAddress) {
    setSelectedAddressId(a.id);
    setForm((f) => ({
      ...f,
      sokak: a.sokak,
      numara: a.numara,
      posta_kodu: a.posta_kodu,
      sehir: a.sehir,
      kapi_kat_notu: a.kapi_kat_notu ?? "",
    }));
  }

  const [hours, setHours] = useState<OpeningHour[] | null>(null);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [hoursLoading, setHoursLoading] = useState(true);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    Promise.all([getOpeningHours(), getRestaurantSettings()])
      .then(([h, s]) => {
        setHours(h);
        setSettings(s);
      })
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

  // Next.js'in client-router cache'i bu sayfa instance'ini canli tutabiliyor;
  // kullanici basarili siparisten sonra menuye donup yeni urun eklerse (sayfa
  // yenilenmeden), eski success ekraninda takili kalmasin diye sifirla.
  useEffect(() => {
    if (success && cart.itemCount > 0) setSuccess(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.itemCount]);

  const pickupSlots = useMemo(
    () => (hours && now ? getPickupSlotsForToday(hours, now) : []),
    [hours, now]
  );
  const availability = useMemo(
    () => (hours && settings && now ? getAvailability(hours, settings, now) : null),
    [hours, settings, now]
  );

  useEffect(() => {
    if (!availability) return;
    if (tur === "teslimat" && !availability.deliveryAvailable && availability.pickupAvailable) {
      setTur("gelal");
    } else if (tur === "gelal" && !availability.pickupAvailable && availability.deliveryAvailable) {
      setTur("teslimat");
    }
  }, [availability, tur]);

  const ADDRESS_FIELDS = new Set([
    "sokak",
    "numara",
    "posta_kodu",
    "sehir",
    "kapi_kat_notu",
  ]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (ADDRESS_FIELDS.has(key)) setSelectedAddressId(null);
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
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (user) {
        const { data } = await supabaseBrowser.auth.getSession();
        if (data.session) headers.Authorization = `Bearer ${data.session.access_token}`;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers,
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
      // Teslimat siparislerinde sepet, PayPal odemesi basarili olunca temizlenir
      // (asagidaki onPaid), boylece musteri odemeden once vazgecip "Abbrechen"
      // derse sepeti hala doluyken forma geri doner.
      if (data.tur === "gelal") cart.clear();

      if (user && tur === "teslimat" && !selectedAddressId && saveAddress) {
        addMyAddress({
          etiket: "Zuhause",
          sokak: form.sokak,
          numara: form.numara,
          posta_kodu: form.posta_kodu,
          sehir: form.sehir,
          kapi_kat_notu: form.kapi_kat_notu,
        }).catch(() => {});
      }
    } catch {
      setSubmitError("Netzwerkfehler. Bitte erneut versuchen.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <main className="flex-1 px-5 py-8 md:mx-auto md:max-w-xl">
        <div
          className={`mx-auto max-w-md rounded-3xl border p-7 text-center ${
            success.paid
              ? "border-emerald-200 bg-emerald-50"
              : "border-border-warm bg-white shadow-[0_10px_30px_rgba(36,28,22,0.08)]"
          }`}
        >
          <h1
            className={`font-display text-xl font-semibold ${
              success.paid ? "text-emerald-800" : "text-charcoal"
            }`}
          >
            {success.paid ? "Bestellung erhalten" : "Fast geschafft"}
          </h1>
          <p className={`mt-2 ${success.paid ? "text-emerald-700" : "text-muted"}`}>
            Bestellnummer: <strong>#{success.siparisNo}</strong>
          </p>
          {success.tur === "gelal" && success.almaSaati && (
            <p className="mt-1 text-emerald-700">
              Abholzeit:{" "}
              {new Date(success.almaSaati).toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              Uhr
            </p>
          )}
          <p
            className={`mt-1 font-semibold ${success.paid ? "text-emerald-700" : "text-charcoal"}`}
          >
            Gesamt: {formatPrice(success.toplam)}
          </p>
          {success.paid && (
            <p className="mt-1 text-sm text-emerald-700">
              Eine Bestellbestätigung wurde per E-Mail gesendet.
            </p>
          )}

          {success.paid && <OrderStatusLive orderId={success.id} />}

          {success.tur === "teslimat" && !success.paid && (
            <>
              <div className="mt-5 rounded-2xl bg-cream p-4">
                <p className="mb-3 text-sm font-medium text-charcoal">
                  Bitte jetzt mit PayPal bezahlen:
                </p>
                <PaypalButton
                  orderId={success.id}
                  onPaid={() => {
                    cart.clear();
                    setSuccess((s) => (s ? { ...s, paid: true } : s));
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => setSuccess(null)}
                className="mt-4 text-sm font-semibold text-muted underline"
              >
                Abbrechen und Bestellung ändern
              </button>
            </>
          )}

          {success.paid && (
            <Link
              href="/speisekarte"
              className="mt-5 inline-block rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-cream"
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
      <main className="flex-1 px-4 py-8 md:mx-auto md:max-w-xl">
        <div className="mx-auto max-w-md animate-pulse space-y-3">
          <div className="h-8 rounded bg-neutral-100" />
          <div className="h-32 rounded bg-neutral-100" />
        </div>
      </main>
    );
  }

  if (cart.itemCount === 0) {
    return (
      <main className="flex-1 px-4 py-8 text-center md:mx-auto md:max-w-xl">
        <p className="text-neutral-600">Dein Warenkorb ist leer.</p>
        <Link
          href="/speisekarte"
          className="mt-4 inline-block rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white"
        >
          Zur Speisekarte
        </Link>
      </main>
    );
  }

  if (
    availability &&
    (!availability.isOpen ||
      (!availability.deliveryAvailable && !availability.pickupAvailable))
  ) {
    return (
      <main className="flex-1 px-4 py-8 text-center md:mx-auto md:max-w-xl">
        <p className="font-medium text-red-700">
          Wir sind aktuell geschlossen und nehmen keine Bestellungen an.
        </p>
        {availability.nextOpenLabel && (
          <p className="mt-1 text-sm text-neutral-600">
            Öffnet wieder: {availability.nextOpenLabel}
          </p>
        )}
        <Link
          href="/speisekarte"
          className="mt-4 inline-block rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white"
        >
          Zurück zur Speisekarte
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-6 pb-32 md:mx-auto md:max-w-xl">
      <h1 className="mb-4 text-lg font-semibold text-neutral-900">Bestellung</h1>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={availability ? !availability.deliveryAvailable : false}
          onClick={() => setTur("teslimat")}
          className={`rounded-xl py-3 text-sm font-semibold disabled:opacity-40 ${
            tur === "teslimat"
              ? "bg-terracotta text-white"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          Lieferung
        </button>
        <button
          type="button"
          disabled={availability ? !availability.pickupAvailable : false}
          onClick={() => setTur("gelal")}
          className={`rounded-xl py-3 text-sm font-semibold disabled:opacity-40 ${
            tur === "gelal"
              ? "bg-terracotta text-white"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          Abholung
        </button>
      </div>
      {availability && !availability.deliveryAvailable && tur === "teslimat" && (
        <p className="mb-4 text-sm text-yellow-700">Lieferung ist aktuell pausiert.</p>
      )}
      {availability && !availability.pickupAvailable && tur === "gelal" && (
        <p className="mb-4 text-sm text-yellow-700">Abholung ist aktuell pausiert.</p>
      )}

      {!user && (
        <p className="mb-4 text-sm text-neutral-500">
          <Link href="/konto/anmelden" className="font-semibold text-terracotta">
            Anmelden
          </Link>{" "}
          für schnelleres Bestellen beim nächsten Mal.
        </p>
      )}

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
                readOnly={!!user}
                className={`${errors.eposta ? inputErrorClass : inputClass} ${
                  user ? "bg-neutral-50 text-neutral-500" : ""
                }`}
              />
            </FormField>
          </div>
        </div>

        {tur === "teslimat" ? (
          <div className="space-y-3">
            {user && addresses.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-neutral-700">
                  Gespeicherte Adresse
                </p>
                <div className="flex flex-wrap gap-2">
                  {addresses.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => selectAddress(a)}
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        selectedAddressId === a.id
                          ? "bg-terracotta text-white"
                          : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {a.etiket}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <DeliveryFields
              values={form}
              errors={errors}
              onChange={updateField}
              zone={zone}
              zoneLoading={zoneLoading}
              cartTotal={cart.total}
            />

            {user && !selectedAddressId && (
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                />
                Adresse für künftige Bestellungen speichern
              </label>
            )}
          </div>
        ) : (
          <PickupFields
            slots={pickupSlots}
            value={almaSaati}
            onChange={setAlmaSaati}
            error={errors.almaSaati}
          />
        )}

        <OrderSummary
          deliveryFee={
            tur === "teslimat" && zone
              ? effectiveDeliveryFee(zone, cart.total)
              : undefined
          }
        />

        {submitError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-terracotta py-3 text-base font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "Wird gesendet…" : "Jetzt bestellen"}
        </button>

        <p className="text-center text-xs text-neutral-400">
          Mit dem Absenden akzeptierst du unsere{" "}
          <Link href="/agb" className="underline">
            AGB
          </Link>{" "}
          und{" "}
          <Link href="/datenschutz" className="underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
      </form>
    </main>
  );
}
