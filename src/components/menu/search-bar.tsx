"use client";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="px-4 py-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Suche im Menü"
        className="w-full rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
      />
    </div>
  );
}
