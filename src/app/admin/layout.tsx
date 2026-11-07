"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthUser } from "@/lib/auth/use-auth-user";
import { checkIsAdmin } from "@/lib/admin/auth";
import { supabaseBrowser } from "@/lib/supabase/client";
import { AdminNav } from "@/components/admin/admin-nav";
import { PausedBanner } from "@/components/admin/paused-banner";
import { AdminSettingsProvider } from "@/lib/admin/settings-context";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/konto/anmelden?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    checkIsAdmin().then(setIsAdmin);
  }, [loading, user, router, pathname]);

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.replace("/");
  }

  if (loading || !user || isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">
        Wird geladen…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="font-medium text-neutral-700">
          Kein Zugriff auf das Restaurant-Panel.
        </p>
        <button type="button" onClick={handleLogout} className="text-sm text-orange-600">
          Abmelden
        </button>
      </div>
    );
  }

  return (
    <AdminSettingsProvider>
      <div className="flex min-h-screen flex-col bg-neutral-50">
        <AdminNav onLogout={handleLogout} />
        <PausedBanner />
        <div className="flex-1">{children}</div>
      </div>
    </AdminSettingsProvider>
  );
}
