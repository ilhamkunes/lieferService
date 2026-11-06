"use client";

import { formatPrice } from "@/lib/config";
import type { DeliveryZone } from "@/lib/supabase/delivery";
import { FormField, inputClass, inputErrorClass } from "./form-field";

export type DeliveryFormValues = {
  sokak: string;
  numara: string;
  posta_kodu: string;
  sehir: string;
  kapi_kat_notu: string;
};

export function DeliveryFields({
  values,
  errors,
  onChange,
  zone,
  zoneLoading,
  cartTotal,
}: {
  values: DeliveryFormValues;
  errors: Record<string, string>;
  onChange: <K extends keyof DeliveryFormValues>(
    key: K,
    value: DeliveryFormValues[K]
  ) => void;
  zone: DeliveryZone | null | undefined;
  zoneLoading: boolean;
  cartTotal: number;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <FormField label="Straße" htmlFor="sokak" error={errors.sokak}>
            <input
              id="sokak"
              value={values.sokak}
              onChange={(e) => onChange("sokak", e.target.value)}
              className={errors.sokak ? inputErrorClass : inputClass}
            />
          </FormField>
        </div>
        <FormField label="Nr." htmlFor="numara" error={errors.numara}>
          <input
            id="numara"
            value={values.numara}
            onChange={(e) => onChange("numara", e.target.value)}
            className={errors.numara ? inputErrorClass : inputClass}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="PLZ" htmlFor="posta_kodu" error={errors.posta_kodu}>
          <input
            id="posta_kodu"
            value={values.posta_kodu}
            onChange={(e) => onChange("posta_kodu", e.target.value)}
            inputMode="numeric"
            maxLength={5}
            className={errors.posta_kodu ? inputErrorClass : inputClass}
          />
        </FormField>
        <FormField label="Stadt" htmlFor="sehir" error={errors.sehir}>
          <input
            id="sehir"
            value={values.sehir}
            onChange={(e) => onChange("sehir", e.target.value)}
            className={errors.sehir ? inputErrorClass : inputClass}
          />
        </FormField>
      </div>

      <FormField label="Etage / Türnotiz (optional)" htmlFor="kapi_kat_notu">
        <input
          id="kapi_kat_notu"
          value={values.kapi_kat_notu}
          onChange={(e) => onChange("kapi_kat_notu", e.target.value)}
          className={inputClass}
        />
      </FormField>

      {zoneLoading && (
        <p className="text-sm text-neutral-400">Liefergebiet wird geprüft…</p>
      )}
      {!zoneLoading && zone === null && (
        <p className="text-sm font-medium text-red-600">
          Leider liefern wir nicht in dieses Gebiet.
        </p>
      )}
      {!zoneLoading && zone && (
        <div className="rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
          <p>Liefergebühr: {formatPrice(zone.teslimat_ucreti)}</p>
          <p>Mindestbestellwert: {formatPrice(zone.minimum_siparis)}</p>
          {cartTotal < zone.minimum_siparis && (
            <p className="mt-1 font-medium text-red-600">
              Noch {formatPrice(zone.minimum_siparis - cartTotal)} bis zum
              Mindestbestellwert.
            </p>
          )}
        </div>
      )}
      {errors.zone && (
        <p className="text-sm font-medium text-red-600">{errors.zone}</p>
      )}
    </div>
  );
}
