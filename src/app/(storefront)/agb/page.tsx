import Link from "next/link";
import { RESTAURANT_NAME } from "@/lib/config";

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-1.5 mt-5 font-semibold">{children}</h2>;
}

export default function AgbPage() {
  return (
    <main className="flex-1 px-5 py-6 pb-28">
      <Link href="/" className="mb-4 inline-block text-sm font-semibold text-terracotta">
        ← Zurück
      </Link>
      <h1 className="font-display mb-6 text-2xl font-semibold text-charcoal">
        Allgemeine Geschäftsbedingungen
      </h1>

      <div className="space-y-2 text-sm leading-relaxed text-charcoal">
        <H2>1. Geltungsbereich</H2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen gelten für alle
          Bestellungen, die Sie über diese Website bei {RESTAURANT_NAME}{" "}
          (Ailimutiza Halike, Königstraße 226, 47798 Krefeld) zur
          Lieferung oder Abholung aufgeben.
        </p>

        <H2>2. Vertragsschluss</H2>
        <p>
          Die Darstellung der Speisen auf der Website stellt kein
          bindendes Angebot dar. Mit dem Absenden Ihrer Bestellung geben
          Sie ein verbindliches Angebot zum Abschluss eines
          Kaufvertrags ab. Der Vertrag kommt zustande, sobald wir Ihre
          Bestellung annehmen; dies kann auch durch tatsächliche
          Zubereitung bzw. Übergabe der Bestellung erfolgen.
        </p>

        <H2>3. Preise und Zahlung</H2>
        <p>
          Es gelten die zum Zeitpunkt der Bestellung auf der Website
          angezeigten Preise in Euro. Gemäß § 19 UStG weisen wir keine
          Umsatzsteuer gesondert aus. Bei Lieferung erfolgt die Zahlung
          online über PayPal (inkl. Kartenzahlung/SEPA-Lastschrift über
          PayPal). Bei Abholung kann vor Ort bar oder mit Karte bezahlt
          werden.
        </p>

        <H2>4. Lieferung und Abholung</H2>
        <p>
          Lieferungen erfolgen nur innerhalb der auf der Website
          angezeigten Liefergebiete und ab dem dort angegebenen
          Mindestbestellwert; es kann eine Liefergebühr anfallen. Bei
          Abholung wird die Bestellung zur gewählten Abholzeit im
          Restaurant bereitgestellt. Angegebene Liefer- und
          Zubereitungszeiten sind Richtwerte und können je nach
          Auftragslage abweichen.
        </p>

        <H2>5. Widerrufsrecht</H2>
        <p>
          Da es sich bei unseren Speisen um Waren handelt, die schnell
          verderben oder deren Verfallsdatum schnell überschritten
          würde, besteht gemäß § 312g Abs. 2 Nr. 2 BGB{" "}
          <strong>kein Widerrufsrecht</strong>. Ihr gesetzliches Recht,
          uns bei einer falschen oder mangelhaften Lieferung zu
          kontaktieren, bleibt hiervon selbstverständlich unberührt.
        </p>

        <H2>6. Reklamationen</H2>
        <p>
          Bei Beanstandungen zu Ihrer Bestellung (z. B. falsche oder
          fehlende Artikel) kontaktieren Sie uns bitte umgehend unter
          den im Impressum genannten Kontaktdaten.
        </p>

        <H2>7. Haftung</H2>
        <p>
          Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit
          sowie nach den Vorschriften des Produkthaftungsgesetzes und
          bei Verletzung von Leben, Körper oder Gesundheit. Für leicht
          fahrlässig verursachte Schäden haften wir nur bei Verletzung
          einer wesentlichen Vertragspflicht, begrenzt auf den
          vorhersehbaren, vertragstypischen Schaden.
        </p>

        <H2>8. Allergene und Inhaltsstoffe</H2>
        <p>
          Angaben zu Allergenen finden Sie, soweit angegeben, direkt bei
          den jeweiligen Gerichten. Bei Unverträglichkeiten oder
          Allergien kontaktieren Sie uns bitte vor der Bestellung.
        </p>

        <H2>9. Streitschlichtung</H2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-terracotta underline"
          >
            ec.europa.eu/consumers/odr
          </a>
          . Wir sind nicht verpflichtet und nicht bereit, an einem
          Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <H2>10. Schlussbestimmungen</H2>
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland. Sollte eine
          Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit
          der übrigen Bestimmungen unberührt.
        </p>
      </div>
    </main>
  );
}
