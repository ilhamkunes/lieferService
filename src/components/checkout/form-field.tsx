"use client";

import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none";
export const inputErrorClass =
  "w-full rounded-lg border border-red-400 px-3 py-2 text-sm focus:border-red-500 focus:outline-none";

export function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-sm font-medium text-neutral-700"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
