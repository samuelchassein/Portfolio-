import Image from "next/image";
import Link from "next/link";
import { Revelation } from "./Revelation";
import { EntreFilets } from "@/components/brand/Signes";

/**
 * Scène 2 bis : « Deux espaces, une expérience ». Deux grandes cartes en
 * arche. Images petites (≈ 900 px) : arches ≤ 340 px de large, presque
 * carrées, pour rester nettes sur écran Retina.
 */
const ESPACES = [
  {
    titre: "L’atelier",
    image: "/images/deux-espaces-atelier.jpg",
    alt: "Un flacon Maison Sensa, des mouillettes et des flacons d’essai sur un socle en travertin.",
    texte: "Créez votre parfum avec un conseiller",
    details: ["45 à 60 minutes", "50 ml", "149 €"],
    lien: { href: "/atelier", libelle: "Atelier sur rendez-vous" },
  },
  {
    titre: "La boutique",
    image: "/images/deux-espaces-boutique.jpg",
    alt: "Une bougie parfumée, un format voyage, un coffret vert et un flacon sur des socles en travertin.",
    texte: "Bougies, formats voyage et coffrets cadeaux",
    details: ["Bougies", "Formats voyage", "Coffrets cadeaux"],
    lien: { href: "/boutique", libelle: "Boutique sans rendez-vous" },
  },
];

export function DeuxEspaces() {
  return (
    <Revelation as="section" aria-labelledby="titre-espaces" className="bg-ivoire-clair/60 py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div data-reveler>
          <EntreFilets>
            <h2 id="titre-espaces" className="text-center font-serif text-titre font-medium">
              Deux espaces, une expérience
            </h2>
          </EntreFilets>
        </div>
        <div className="mt-20 grid gap-20 md:grid-cols-2 md:gap-10 lg:gap-20">
          {ESPACES.map((e, i) => (
            <article key={e.titre} data-reveler data-delai={i * 0.12} className="group flex flex-col items-center text-center">
              <div className="w-full max-w-[21.25rem]">
                <div className="relative overflow-hidden rounded-t-full" style={{ aspectRatio: "20 / 21" }}>
                  <Image
                    src={e.image}
                    alt={e.alt}
                    fill
                    sizes="(min-width: 768px) 340px, 85vw"
                    quality={90}
                    className="object-cover transition-transform duration-[1.6s] ease-doux group-hover:scale-[1.035]"
                  />
                </div>
              </div>
              <h3 className="mt-10 font-serif text-[2.4rem] font-medium leading-none">{e.titre}</h3>
              <span
                aria-hidden="true"
                className="mt-5 block h-px w-10 bg-dore transition-[width] duration-700 ease-doux group-hover:w-24"
              />
              <p className="mt-5 text-lg">{e.texte}</p>
              <ul className="mt-2 flex flex-wrap justify-center gap-x-3 text-encre-douce" aria-label={`${e.titre} : en bref`}>
                {e.details.map((d, j) => (
                  <li key={d} className="flex items-center gap-3">
                    {j > 0 && (
                      <span aria-hidden="true" className="text-dore">
                        ·
                      </span>
                    )}
                    {d}
                  </li>
                ))}
              </ul>
              <Link
                href={e.lien.href}
                className={`mt-8 inline-flex min-h-12 items-center px-8 text-[0.8125rem] uppercase tracking-[0.24em] transition-colors duration-300 ${
                  i === 0 ? "bg-vert text-ivoire-clair hover:bg-vert-nuit" : "border border-encre/70 text-encre hover:bg-encre hover:text-ivoire-clair"
                }`}
              >
                {e.lien.libelle}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </Revelation>
  );
}
