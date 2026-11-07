"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { getSettings } from "@/lib/admin/settings";
import type { RestaurantSettings } from "@/lib/supabase/types";

type Ctx = {
  settings: RestaurantSettings | null;
  refresh: () => void;
};

const SettingsContext = createContext<Ctx>({ settings: null, refresh: () => {} });

export function AdminSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);

  function refresh() {
    getSettings().then(setSettings);
  }

  useEffect(() => {
    refresh();
    const channel = supabaseBrowser
      .channel("restaurant_settings-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "restaurant_settings" },
        () => refresh()
      )
      .subscribe();
    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useAdminSettings() {
  return useContext(SettingsContext);
}
