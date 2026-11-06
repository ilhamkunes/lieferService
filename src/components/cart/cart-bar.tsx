"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { formatPrice } from "@/lib/config";
import { useCart } from "@/lib/cart/cart-context";
import { CartSheet } from "@/components/cart/cart-sheet";

export function CartBar() {
  const { itemCount, total } = useCart();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (itemCount === 0) return null;
  if (pathname?.startsWith("/checkout")) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-20 px-4 pb-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-full bg-orange-500 px-5 py-3 text-white shadow-lg active:bg-orange-600"
        >
          <span className="font-semibold">
            {itemCount} {itemCount === 1 ? "Artikel" : "Artikel"}
          </span>
          <span className="font-semibold">{formatPrice(total)}</span>
        </button>
      </div>

      {open && <CartSheet onClose={() => setOpen(false)} />}
    </>
  );
}
