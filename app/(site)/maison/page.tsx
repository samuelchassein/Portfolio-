import type { Metadata } from "next";
import Image from "next/image";
import { Surtitre } from "@/components/brand/Signes";
import { LienBouton } from "@/components/ui/Bouton";
import { Revelation } from "@/components/scenes/Revelation";

export const metadata: Metadata = {
  title: "La Maison",
  description: "Maison Sensa, parfumerie et atelier de création olfactive à Boulogne-Billancourt : le parfum comme identité, l’accompagnement individuel.",
};

const ENGAGEMENTS = [
  ["Un accompagnement individuel", "Un conseiller rien que pour vous, pendant toute la durée de l’atelier."],
  ["Du temps dédié", "45 à 60 minutes pour explorer, sentir, hésiter, choisir."],
  ["Une référence conservée", "Votre composition est gardée pour vos recharges : vous retrouvez votre parfum."],
];

export default function PageMaison() {
  return (
    <Revelation>
      <section className="relative h-[78svh] min-h-[30rem] overflow-hidden">
        <Image src="/images/comptoir-accueil.jpg" alt="Le comptoir d’accueil de Maison Sensa, en travertin et noyer, sous l’enseigne." fill priority sizes="100vw" quality={85} className="object-cover object-[50%_40%]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ivoire via-ivoire/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[90rem] px-4 pb-12 sm:px-8">
          <Surtitre>La Maison</Surtitre>
          <h1 className="mt-4 max-w-4xl font-serif text-hero font-medium">Votre identité, votre signature olfactive.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-8 md:py-32">
        <p data-reveler className="font-serif text-sous-titre leading-snug">
          Un parfum peut dire qui l’on est sans un mot. Chez Maison Sensa, nous avons voulu un lieu où chacun prend le temps de trouver le sien.
        </p>
        <span data-filet-trace aria-hidden="true" className="mx-auto mt-10 block h-px w-12 bg-dore" />
      </section>

      <section className="mx-auto grid max-w-[90rem] items-center gap-14 px-4 pb-24 sm:px-8 md:grid-cols-2 md:pb-32">
        <div data-reveler className="relative aspect-[4/5] overflow-hidden rounded-t-full">
          <Image src="/images/atelier-mouillette.jpg" alt="Une mouillette tenue au-dessus d’un flacon Maison Sensa, d’une bougie et d’un coffret." fill sizes="(min-width: 768px) 45vw, 100vw" quality={85} className="object-cover" />
        </div>
        <div data-reveler>
          <h2 className="font-serif text-titre font-medium">Le parfum comme identité</h2>
          <p className="mt-6 text-lg leading-relaxed text-encre-douce">
            Nous ne vendons pas un parfum tout fait. Nous vous aidons à composer le vôtre, selon vos goûts, parmi nos accords : une signature qui vous ressemble, et que vous pourrez retrouver.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-encre-douce">
            Quatre familles olfactives servent de point de départ : frais, floral, boisé, ambré. Votre conseiller vous guide de l’une à l’autre, sans pression, à votre rythme.
          </p>
        </div>
      </section>

      <section className="bg-vert py-24 text-ivoire-clair md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <h2 className="text-center font-serif text-titre font-medium text-dore-clair">Nos engagements</h2>
          <ul className="mt-14 grid gap-12 md:grid-cols-3">
            {ENGAGEMENTS.map(([t, d]) => (
              <li key={t} data-reveler className="border-t border-dore/60 pt-6">
                <h3 className="font-serif text-2xl">{t}</h3>
                <p className="mt-3 text-ivoire/75">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-[90rem] items-center gap-14 px-4 py-24 sm:px-8 md:grid-cols-[1fr_1.2fr] md:py-32">
        <div data-reveler>
          <h2 className="font-serif text-titre font-medium">Deux espaces à Boulogne-Billancourt</h2>
          <p className="mt-6 text-lg leading-relaxed text-encre-douce">
            La boutique s’ouvre sans rendez-vous : bougies, formats voyage, coffrets. L’atelier, à l’écart du passage, accueille une personne à la fois, sur rendez-vous.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <LienBouton href="/atelier">Découvrir l’atelier</LienBouton>
            <LienBouton href="/visite" variante="contour">
              Visiter en 360°
            </LienBouton>
          </div>
        </div>
        <div data-reveler className="relative aspect-[16/10] overflow-hidden">
          <Image src="/images/interieur-vue-large.jpg" alt="Vue d’ensemble de la boutique : comptoirs en noyer, niches éclairées, tables de bougies." fill sizes="(min-width: 768px) 55vw, 100vw" quality={85} className="object-cover" />
        </div>
      </section>
    </Revelation>
  );
}
