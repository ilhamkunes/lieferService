const RESEND_API_URL = "https://api.resend.com/emails";

const FROM_ADDRESS = "Bugday <bestellungen@bugday.eu>";

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
