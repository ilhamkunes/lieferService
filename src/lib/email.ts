const RESEND_API_URL = "https://api.resend.com/emails";

// Domain dogrulanana kadar Resend sadece bu gonderici adresine ve sadece
// hesap sahibinin kendi dogrulanmis e-postasina gonderime izin verir.
const FROM_ADDRESS = "Bestellungen <onboarding@resend.dev>";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // Resend henuz kurulmadiysa siparis akisini bozma

  try {
    await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      }),
    });
  } catch {
    // E-posta gonderilemese bile siparis basarili sayilir, sessizce gec.
  }
}
