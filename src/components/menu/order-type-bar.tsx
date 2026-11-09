"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";

export function OrderTypeBar() {
  const { orderType } = useCart();
  if (!orderType) return null;

  return (
    <div className="flex items-center justify-between gap-2 border-y border-border-warm bg-white px-5 py-2.5 text-sm">
      <span className="text-charcoal">
        {orderType === "gelal" ? "Abholung" : "Lieferung"}
      </span>
      <Link href="/bestellen" className="font-semibold text-terracotta">
        Ändern
      </Link>
    </div>
  );
}
