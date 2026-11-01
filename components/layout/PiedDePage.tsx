import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { NAVIGATION, SITE, adresseComplete } from "@/content/site";

const LEGAL = [
  { href: "/mentions-legales", libelle: "Mentions légales" },
  { href: "/cgv", libelle: "Conditions générales de vente" },
  { href: "/confidentialite", libelle: "Politique de confidentialité" },
  { href: "/cookies", libelle: "Cookies" },
];

/** Pied de page vert profond, wordmark doré. */
export function PiedDePage() {
  return (
    <footer className="bg-vert text-ivoire/85">
      <div className="mx-auto max-w-[90rem] px-4 pb-10 pt-20 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <Wordmark teinte="dore" decoratif className="w-44" />
          <p className="mt-6 font-serif text-xl italic text-ivoire-clair">{SITE.signature}</p>
        </div>

        <div className="mt-16 grid gap-12 border-t border-ivoire/15 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-[0.75rem] uppercase tracking-[0.3em] text-dore-clair">La maison</h2>
            <ul className="mt-5 space-y-1">
              {NAVIGATION.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-10 items-center hover:text-ivoire-clair">
                    {l.libelle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[0.75rem] uppercase tracking-[0.3em] text-dore-clair">Nous trouver</h2>
            <address className="mt-5 not-italic leading-relaxed">
              {adresseComplete()}
              <br />
              <a href={`mailto:${SITE.email}`} className="inline-flex min-h-10 items-center underline decoration-dore/60 underline-offset-4 hover:text-ivoire-clair">
                {SITE.email}
              </a>
              <br />
              {SITE.telephone}
            </address>
          </div>
          <div>
            <h2 className="text-[0.75rem] uppercase tracking-[0.3em] text-dore-clair">Horaires</h2>
            <dl className="mt-5 space-y-2">
              {SITE.horaires.map((h) => (
                <div key={h.jours}>
                  <dt>{h.jours}</dt>
                  <dd className="text-ivoire/65">{h.heures}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-[0.75rem] uppercase tracking-[0.3em] text-dore-clair">Suivre la maison</h2>
            <ul className="mt-5 space-y-1">
              {SITE.reseaux.map((r) => (
                <li key={r.nom}>
                  <a href={r.url} className="inline-flex min-h-10 items-center hover:text-ivoire-clair" rel="noopener" target="_blank">
                    {r.nom}
                    <span className="sr-only"> (nouvelle fenêtre)</span>
                  </a>
                </li>
              ))}
              <li>
                <Link href="/contact" className="inline-flex min-h-10 items-center hover:text-ivoire-clair">
                  Nous écrire
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ivoire/15 pt-8 text-sm text-ivoire/60 lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} Maison Sensa · Boulogne-Billancourt</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-10 items-center hover:text-ivoire-clair">
                  {l.libelle}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
