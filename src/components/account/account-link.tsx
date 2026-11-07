"use client";

import Link from "next/link";
import { useAuthUser } from "@/lib/auth/use-auth-user";

export function AccountLink() {
  const { user, loading } = useAuthUser();

  if (loading) return null;

  return (
    <Link href="/konto" className="text-sm font-medium text-neutral-500">
      {user ? "Mein Konto" : "Anmelden"}
    </Link>
  );
}
