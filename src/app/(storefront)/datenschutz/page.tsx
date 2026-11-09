import Link from "next/link";
import { RESTAURANT_NAME } from "@/lib/config";

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-1.5 mt-5 font-semibold">{children}</h2>;
}

export default function DatenschutzPage() {
  return (
    <main className="flex-1 px-5 py-6 pb-28 md:mx-auto md:max-w-2xl">
      <Link href="/" className="mb-4 inline-block text-sm font-semibold text-terracotta">
        ← Zurück
      </Link>
      <h1 className="font-display mb-6 text-2xl font-semibold text-charcoal">
        Datenschutzerklärung
      </h1>

      <div className="space-y-2 text-sm leading-relaxed text-charcoal">
        <H2>1. Verantwortlicher</H2>
        <p>
          Ailimutiza Halike ({RESTAURANT_NAME}), Königstraße 226, 47798
          Krefeld, E-Mail: bugdaykrefeld@gmail.com, Telefon: +49 176
          31321077.
        </p>

        <H2>2. Welche Daten wir verarbeiten</H2>
        <p>
          Wenn Sie über diese Website bestellen oder ein Kundenkonto
          anlegen, verarbeiten wir: Name, Telefonnummer, E-Mail-Adresse,
          bei Lieferung zusätzlich Lieferadresse, sowie die
          Bestelldetails (bestellte Artikel, Preis, Zahlungsart, Hinweise
          zur Bestellung). Bei Zahlung per PayPal werden zusätzlich
          Zahlungsdaten direkt von PayPal verarbeitet (siehe Punkt 5).
        </p>

        <H2>3. Zweck und Rechtsgrundlage</H2>
        <p>
          Die Verarbeitung erfolgt zur Abwicklung Ihrer Bestellung
          (Vertragserfüllung, Art. 6 Abs. 1 lit. b DSGVO) sowie, soweit
          gesetzlich vorgeschrieben, zur Erfüllung handels- und
          steuerrechtlicher Aufbewahrungspflichten (Art. 6 Abs. 1 lit. c
          DSGVO).
        </p>

        <H2>4. Hosting und Datenbank</H2>
        <p>
          Diese Website wird bei Vercel Inc. gehostet. Die Bestelldaten
          werden in einer Datenbank unseres Anbieters Supabase Inc.
          gespeichert. Beide Anbieter verarbeiten Daten teilweise auf
          Servern außerhalb der EU; in diesem Fall stellen Standard­ver­
          trags­klauseln der EU-Kommission ein angemessenes
          Datenschutzniveau sicher.
        </p>

        <H2>5. Zahlungsabwicklung (PayPal)</H2>
        <p>
          Für Online-Zahlungen nutzen wir PayPal (PayPal (Europe) S.à
          r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449
          Luxembourg). Bei Auswahl dieser Zahlungsart werden die für die
          Zahlungsabwicklung erforderlichen Daten an PayPal übermittelt.
          Es gilt die Datenschutzerklärung von PayPal.
        </p>

        <H2>6. Versand von Bestellbestätigungen</H2>
        <p>
          Zum Versand von Bestellbestätigungen per E-Mail nutzen wir den
          Dienst Resend. Ihre E-Mail-Adresse und die Bestellinhalte
          werden zu diesem Zweck an Resend übermittelt.
        </p>

        <H2>7. Lokale Speicherung im Browser</H2>
        <p>
          Diese Website speichert technisch notwendige Informationen im
          lokalen Speicher (localStorage) Ihres Browsers: den Inhalt
          Ihres Warenkorbs und, bei Anmeldung, Ihre Login-Sitzung. Diese
          Speicherung ist für die Nutzung der Bestellfunktion
          erforderlich und erfolgt nicht zu Analyse- oder
          Marketingzwecken. Eine Einwilligung ist hierfür gemäß § 25
          Abs. 2 TTDSG nicht erforderlich.
        </p>

        <H2>8. Kundenkonto</H2>
        <p>
          Die Erstellung eines Kundenkontos ist freiwillig. Dabei
          verarbeiten wir die von Ihnen angegebene E-Mail-Adresse und
          Ihr Passwort (verschlüsselt gespeichert). Sie können Ihr Konto
          jederzeit löschen lassen, indem Sie uns kontaktieren.
        </p>

        <H2>9. Speicherdauer</H2>
        <p>
          Bestelldaten speichern wir so lange, wie es die gesetzlichen
          Aufbewahrungsfristen für Geschäftsunterlagen vorsehen (in der
          Regel 6–10 Jahre, § 147 AO, § 257 HGB). Kundenkonten bleiben
          bestehen, bis Sie deren Löschung verlangen.
        </p>

        <H2>10. Ihre Rechte</H2>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung und
          Einschränkung der Verarbeitung Ihrer Daten sowie auf
          Datenübertragbarkeit und Widerspruch gegen die Verarbeitung
          (Art. 15–21 DSGVO). Wenden Sie sich hierzu an die oben
          genannte Kontaktadresse.
        </p>

        <H2>11. Beschwerderecht</H2>
        <p>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
          zu beschweren, z. B. bei der Landesbeauftragten für Datenschutz
          und Informationsfreiheit Nordrhein-Westfalen.
        </p>

        <H2>12. Verschlüsselung</H2>
        <p>
          Diese Website nutzt aus Sicherheitsgründen eine SSL/TLS-
          Verschlüsselung zum Schutz der Übertragung vertraulicher
          Inhalte (erkennbar am „https://" in der Adresszeile).
        </p>
      </div>
    </main>
  );
}
