"use client";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative z-10 px-5 pt-3 md:px-8">
      <div className="flex items-center gap-2.5 rounded-2xl bg-white px-4.5 py-3.5 shadow-[0_10px_30px_rgba(36,28,22,0.14)]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="shrink-0"
        >
          <circle cx="11" cy="11" r="7" stroke="#A8998A" strokeWidth="2" />
          <path
            d="M21 21l-4.3-4.3"
            stroke="#A8998A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <label htmlFor="menu-suche" className="sr-only">
          Suche im Menü
        </label>
        <input
          id="menu-suche"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Suche im Menü"
          className="w-full bg-transparent text-sm text-charcoal placeholder:text-muted focus:outline-none"
        />
      </div>
    </div>
  );
}
