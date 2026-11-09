import Link from "next/link";
import { RESTAURANT_NAME } from "@/lib/config";

export default function ImpressumPage() {
  return (
    <main className="flex-1 px-5 py-6 pb-28 md:mx-auto md:max-w-2xl">
      <Link href="/" className="mb-4 inline-block text-sm font-semibold text-terracotta">
        ← Zurück
      </Link>
      <h1 className="font-display mb-6 text-2xl font-semibold text-charcoal">
        Impressum
      </h1>

      <div className="space-y-5 text-sm leading-relaxed text-charcoal">
        <section>
          <h2 className="mb-1 font-semibold">Angaben gemäß § 5 TMG</h2>
          <p>
            Ailimutiza Halike
            <br />
            Geschäftsbezeichnung: {RESTAURANT_NAME}
            <br />
            Königstraße 226
            <br />
            47798 Krefeld
            <br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold">Kontakt</h2>
          <p>
            Telefon: +49 176 31321077
            <br />
            E-Mail: bugdaykrefeld@gmail.com
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold">Umsatzsteuer</h2>
          <p>
            Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und ausgewiesen
            (Kleinunternehmerregelung).
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p>
            Ailimutiza Halike
            <br />
            Königstraße 226, 47798 Krefeld
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold">EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-terracotta underline"
            >
              ec.europa.eu/consumers/odr
            </a>
            . Unsere E-Mail-Adresse finden Sie oben in diesem Impressum.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold">
            Verbraucherstreitbeilegung/Universalschlichtungsstelle
          </h2>
          <p>
            Wir sind nicht bereit und nicht verpflichtet, an
            Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>
      </div>
    </main>
  );
}
