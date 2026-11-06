"use client";

function formatSlot(d: Date): string {
  return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

export function PickupFields({
  slots,
  value,
  onChange,
  error,
}: {
  slots: Date[];
  value: string;
  onChange: (iso: string) => void;
  error?: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-neutral-700">Abholzeit</p>

      {slots.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Für heute sind leider keine Abholzeiten mehr verfügbar.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {slots.map((slot) => {
            const iso = slot.toISOString();
            const active = iso === value;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => onChange(iso)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  active
                    ? "bg-orange-500 text-white"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                {formatSlot(slot)}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <p className="mt-3 text-sm text-neutral-500">
        Zahlung: im Laden (bar oder Karte)
      </p>
    </div>
  );
}
