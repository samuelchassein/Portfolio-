"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Picto } from "@/components/brand/Pictos";
import { CadreDore, Surtitre } from "@/components/brand/Signes";
import { LienBouton } from "@/components/ui/Bouton";
import { SITE } from "@/content/site";
import { ETAPES_ATELIER } from "@/content/atelier";

gsap.registerPlugin(ScrollTrigger);


/**
 * Scène 4 : l'Atelier Signature. Mise en page asymétrique, quatre étapes
 * reliées par un fil doré qui se trace au défilement, bloc pictogrammes.
 */
export function AtelierSignature() {
  const racine = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = racine.current!;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const fil = el.querySelector<HTMLElement>("[data-fil]")!;
      gsap.fromTo(fil, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el.querySelector("[data-etapes]"), start: "top 70%", end: "bottom 60%", scrub: true } });
      el.querySelectorAll<HTMLElement>("[data-etape]").forEach((n) => {
        gsap.from(n, { autoAlpha: 0, y: 24, duration: 1, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 75%", once: true } });
        const point = n.querySelector("[data-point]");
        gsap.from(point, { scale: 0, duration: 0.6, ease: "back.out(1.6)", scrollTrigger: { trigger: n, start: "top 72%", once: true } });
      });
      gsap.from(el.querySelector("[data-image]"), { clipPath: "inset(12% 12% 12% 12%)", duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 70%", once: true } });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={racine} aria-labelledby="titre-atelier" className="py-28 md:py-40">
      <div className="mx-auto grid max-w-[90rem] gap-16 px-4 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Surtitre>L’Atelier Signature</Surtitre>
          <h2 id="titre-atelier" className="mt-6 font-serif text-titre font-medium">
            Créez votre signature olfactive
          </h2>
          <div data-image className="relative mt-10 aspect-[16/10] overflow-hidden">
            <Image
              src="/images/atelier-table.jpg"
              alt="La table de l’atelier : plateau en travertin, tabourets en velours vert, mur vert profond et étagères de flacons."
              fill
              sizes="(min-width: 1024px) 52vw, 100vw"
              quality={85}
              className="object-cover"
            />
          </div>
        </div>

        <div className="lg:pt-24">
          <p className="max-w-md text-lg text-encre-douce">
            Un rendez-vous individuel avec un conseiller, pour composer un parfum selon vos goûts, parmi nos accords.
          </p>
          <ol data-etapes className="relative mt-14 space-y-12 pl-12">
            <span aria-hidden="true" className="absolute bottom-3 left-[0.6875rem] top-3 w-px bg-encre/10" />
            <span data-fil aria-hidden="true" className="absolute bottom-3 left-[0.6875rem] top-3 w-px origin-top bg-dore" />
            {ETAPES_ATELIER.map((e, i) => (
              <li key={e.titre} data-etape className="relative">
                <span
                  data-point
                  aria-hidden="true"
                  className="absolute -left-12 top-1.5 flex size-6 items-center justify-center rounded-full border border-dore bg-ivoire"
                >
                  <span className="size-1.5 rounded-full bg-dore" />
                </span>
                <p className="font-serif text-lg tabular-nums text-dore-texte">0{i + 1}</p>
                <h3 className="mt-1 font-serif text-3xl font-medium">{e.titre}</h3>
                <p className="mt-2 max-w-sm text-encre-douce">{e.texte}</p>
              </li>
            ))}
          </ol>

          <CadreDore double className="mt-16 bg-ivoire-clair px-6 py-8 sm:px-10">
            <ul className="grid grid-cols-2 gap-y-8 sm:grid-cols-4">
              {(
                [
                  ["personnes", "Accompagnement individuel"],
                  ["horloge", `${SITE.atelier.dureeMin} à ${SITE.atelier.dureeMax} minutes`],
                  ["flacon", `Parfum ${SITE.atelier.contenance}`],
                  ["etiquette", `${SITE.atelier.prix} €`],
                ] as const
              ).map(([p, t]) => (
                <li key={p} className="flex flex-col items-center gap-3 px-2 text-center">
                  <Picto nom={p} taille={40} className="text-dore" />
                  <span className="font-serif text-lg leading-tight">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-center">
              <LienBouton href="/atelier#reserver">Réserver mon atelier</LienBouton>
            </div>
          </CadreDore>
        </div>
      </div>
    </section>
  );
}
