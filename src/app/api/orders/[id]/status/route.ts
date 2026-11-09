import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// Misafir musteriler de (giris yapmadan) kendi siparis durumunu
// gorebilsin diye auth gerektirmiyor - sadece durum bilgisi donuyor,
// isim/adres/telefon gibi kisisel veri hic donmuyor.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("siparis_durumu, tahmini_hazir_saat, red_sebebi, tur, alma_saati")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Bestellung nicht gefunden." }, { status: 404 });
  }

  return NextResponse.json(data);
}
