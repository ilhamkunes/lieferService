import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

const BUCKET = "product-images";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "Ungültige Sitzung." }, { status: 401 });
  }

  const { data: isAdmin } = await supabaseAdmin
    .from("admins")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (!isAdmin) {
    return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const pathPrefix = formData.get("pathPrefix");
  if (!(file instanceof File) || typeof pathPrefix !== "string") {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const extFromName = file.name.split(".").pop();
  const ext =
    extFromName && extFromName.length <= 5
      ? extFromName.toLowerCase()
      : file.type === "image/png"
        ? "png"
        : "jpg";
  const path = `${pathPrefix}-${Date.now()}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: upErr } = await supabaseAdmin.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type || undefined,
    upsert: true,
  });
  if (upErr) {
    return NextResponse.json({ error: "Hochladen fehlgeschlagen." }, { status: 500 });
  }

  const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: pub.publicUrl });
}
