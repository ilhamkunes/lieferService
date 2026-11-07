"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/lib/auth/use-auth-user";
import { supabaseBrowser } from "@/lib/supabase/client";
import { ProfileForm } from "@/components/account/profile-form";
import { AddressManager } from "@/components/account/address-manager";
import { OrderHistory } from "@/components/account/order-history";

export default function AccountPage() {
  const { user, loading } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/konto/anmelden");
    }
  }, [loading, user, router]);

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.replace("/");
  }

  if (loading || !user) {
    return (
      <main className="flex-1 px-4 py-8">
        <p className="text-sm text-neutral-400">Wird geladen…</p>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-6 pb-12">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">Mein Konto</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-neutral-500"
        >
          Abmelden
        </button>
      </div>

      <ProfileForm user={user} />
      <AddressManager />
      <OrderHistory />
    </main>
  );
}
