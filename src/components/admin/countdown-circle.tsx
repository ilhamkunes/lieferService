"use client";

import { useEffect, useState } from "react";

export function CountdownCircle({ target }: { target: string | null }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);

  if (!target) return null;

  const minutes = Math.round((new Date(target).getTime() - now.getTime()) / 60_000);
  const overdue = minutes < 0;

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
        overdue ? "border-red-500 text-red-600" : "border-orange-400 text-orange-600"
      }`}
      title="Verbleibende Minuten"
    >
      {overdue ? "!" : minutes}
    </div>
  );
}
