"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import type { Availability } from "@/lib/availability";
import type { OrderType } from "@/lib/cart/cart-context";

function OptionCard({
  label,
  description,
  disabled,
  disabledReason,
  onSelect,
}: {
  label: string;
  description: string;
  disabled: boolean;
  disabledReason?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={`w-full rounded-2xl border px-5 py-6 text-left transition-colors ${
        disabled
          ? "border-border-warm bg-white opacity-50"
          : "border-border-warm bg-white hover:border-terracotta"
      }`}
    >
      <p className="font-display text-xl font-semibold text-charcoal">{label}</p>
      <p className="mt-1 text-sm text-muted">
        {disabled && disabledReason ? disabledReason : description}
      </p>
    </button>
  );
}

export function OrderTypePicker({ availability }: { availability: Availability }) {
  const router = useRouter();
  const { setOrderType } = useCart();

  function choose(type: OrderType) {
    setOrderType(type);
    router.push("/speisekarte");
  }

  if (!availability.isOpen) {
    return (
      <div className="px-5 py-10 text-center">
        <p className="font-medium text-red-700">
          Wir sind aktuell geschlossen und nehmen keine Bestellungen an.
        </p>
        {availability.nextOpenLabel && (
          <p className="mt-1 text-sm text-muted">
            Öffnet wieder: {availability.nextOpenLabel}
          </p>
        )}
        <Link
          href="/"
          className="mt-5 inline-block rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-cream"
        >
          Zurück zur Startseite
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-5 py-6">
      <OptionCard
        label="Abholung"
        description="Im Restaurant abholen"
        disabled={!availability.pickupAvailable}
        disabledReason="Abholung ist aktuell pausiert."
        onSelect={() => choose("gelal")}
      />
      <OptionCard
        label="Lieferung"
        description="Nach Hause liefern lassen"
        disabled={!availability.deliveryAvailable}
        disabledReason="Lieferung ist aktuell pausiert."
        onSelect={() => choose("teslimat")}
      />
    </div>
  );
}
