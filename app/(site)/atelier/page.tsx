import type { Metadata } from "next";
import Image from "next/image";
import { Surtitre, CadreDore } from "@/components/brand/Signes";
import { Picto } from "@/components/brand/Pictos";
import { LienBouton } from "@/components/ui/Bouton";
import { Reservation } from "@/components/reservation/Reservation";
import { ETAPES_ATELIER } from "@/content/atelier";
import { FAQ_ATELIER } from "@/content/faq";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "L’Atelier Signature",
  description:
    "Composez votre parfum avec un conseiller, en rendez-vous individuel de 45 à 60 minutes. Parfum 50 ml inclus, 149 €. Réservez votre atelier à Boulogne-Billancourt.",
};

const INCLUS = [
  ["personnes", "Un conseiller, rien que pour vous"],
  ["horloge", `${SITE.atelier.dureeMin} à ${SITE.atelier.dureeMax} minutes`],
  ["flacon", `Votre parfum de ${SITE.atelier.contenance}`],
  ["recharge", "Une référence conservée pour vos recharges"],
] as const;

export default function PageAtelier() {
  return (
    <>
      <section className="relative pt-28 lg:pt-32">
        <div className="mx-auto grid max-w-[90rem] items-end gap-12 px-4 sm:px-8 lg:grid-cols-[1fr_1.15fr]">
          <div className="pb-6">
            <Surtitre>L’Atelier Signature</Surtitre>
            <h1 className="mt-6 font-serif text-hero font-medium">Votre parfum, votre signature.</h1>
            <span aria-hidden="true" className="mt-8 block h-px w-12 bg-dore" />
            <p className="mt-8 max-w-lg text-lg text-encre-douce">
              Un rendez-vous individuel avec un conseiller pour composer un parfum selon vos goûts, parmi nos accords. Vous
              repartez avec votre flacon de 50 ml et une référence pour le retrouver.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <LienBouton href="#reserver">Réserver mon atelier</LienBouton>
              <LienBouton href="/diagnostic" variante="contour">
                Faire mon diagnostic
              </LienBouton>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-[12rem]">
            <Image
              src="/images/atelier-conseil-client.jpg"
              alt="Une conseillère présente une mouillette à un client autour de la table de l’atelier."
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              quality={85}
              className="object-cover object-[60%_center]"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="titre-deroule" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <h2 id="titre-deroule" className="text-center font-serif text-titre font-medium">
            Le déroulé
          </h2>
          <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPES_ATELIER.map((e, i) => (
              <li key={e.titre} className="border-t border-dore pt-6">
                <p className="font-serif text-lg tabular-nums text-dore-texte">0{i + 1}</p>
                <h3 className="mt-2 font-serif text-3xl font-medium">{e.titre}</h3>
                <p className="mt-3 text-encre-douce">{e.texte}</p>
              </li>
            ))}
          </ol>

          <CadreDore double className="mt-20 bg-ivoire-clair px-6 py-10 sm:px-12">
            <h2 className="text-center font-serif text-3xl font-medium">Ce qui est inclus</h2>
            <ul className="mt-10 grid grid-cols-2 gap-y-10 lg:grid-cols-4">
              {INCLUS.map(([p, t]) => (
                <li key={p} className="flex flex-col items-center gap-3 px-3 text-center">
                  <Picto nom={p} taille={42} className="text-dore" />
                  <span className="font-serif text-lg leading-tight">{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-center font-serif text-5xl text-vert">{SITE.atelier.prix}&nbsp;€</p>
          </CadreDore>
        </div>
      </section>

      <section id="reserver" aria-labelledby="titre-reserver" className="scroll-mt-24 bg-ivoire-clair/70 py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <Surtitre>Réservation</Surtitre>
          <h2 id="titre-reserver" className="mt-5 font-serif text-titre font-medium">
            Réserver mon atelier
          </h2>
          <div className="mt-12">
            <Reservation />
          </div>
        </div>
      </section>

      <section aria-labelledby="titre-faq" className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          <h2 id="titre-faq" className="text-center font-serif text-titre font-medium">
            Vos questions
          </h2>
          <div className="mt-14 divide-y divide-encre/10 border-y border-encre/10">
            {FAQ_ATELIER.map((f) => (
              <details key={f.q} className="group py-2">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 font-serif text-xl [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="text-2xl text-dore transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-5 pr-10 text-encre-douce">{f.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
