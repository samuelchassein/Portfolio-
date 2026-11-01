import Image from "next/image";
import { Revelation } from "./Revelation";
import { Arche } from "@/components/brand/Arche";

/**
 * Scène 2 : manifeste. Grand texte serif révélé ligne par ligne, image en
 * arche avec parallaxe douce. Cadrage resserré sur la conseillère et le client :
 * l'enseigne murale reste hors champ (jamais de nom de marque coupé).
 */
const LIGNES = ["Une odeur peut faire", "revenir un souvenir.", "Et si elle pouvait", "raconter votre histoire ?"];

export function Manifeste() {
  return (
    <Revelation as="section" aria-labelledby="titre-manifeste" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto grid max-w-[90rem] items-center gap-16 px-4 sm:px-8 md:grid-cols-[1.25fr_1fr] lg:gap-24">
        <div>
          <p data-reveler className="text-surtitre uppercase tracking-[0.36em] text-dore-texte">
            Manifeste
          </p>
          <h2 id="titre-manifeste" className="mt-8 font-serif text-titre font-medium md:text-[clamp(2.8rem,1.4rem+3.4vw,5.4rem)]">
            {LIGNES.map((l, i) => (
              <span key={i} className={`block overflow-hidden pb-[0.08em] ${i === 2 ? "mt-[0.35em] italic text-vert" : ""} ${i === 3 ? "italic text-vert" : ""}`}>
                <span data-ligne className="block">
                  {l.replace(" ?", " ?")}
                </span>
              </span>
            ))}
          </h2>
          <span data-filet-trace aria-hidden="true" className="mt-10 block h-px w-24 origin-left bg-dore" />
          <p data-reveler className="mt-10 max-w-md text-encre-douce">
            Chez Maison Sensa, un conseiller prend le temps de vous écouter. Vos souvenirs, vos envies, vos préférences
            deviennent un parfum composé selon vos goûts, parmi nos accords.
          </p>
        </div>
        <div className="mx-auto w-full max-w-[29rem]">
          <Arche filet ratio="4 / 5">
            <div data-parallaxe="0.06" className="absolute -inset-y-[8%] inset-x-0">
              <Image
                src="/images/atelier-conseil-client.jpg"
                alt="Pendant un atelier, un client sent une mouillette que lui présente sa conseillère, autour d’une table en travertin."
                fill
                sizes="(min-width: 768px) 29rem, 90vw"
                quality={85}
                className="origin-[58%_100%] scale-[1.28] object-cover object-[58%_70%]"
              />
            </div>
          </Arche>
        </div>
      </div>
    </Revelation>
  );
}
