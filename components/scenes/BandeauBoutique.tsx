"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Surtitre } from "@/components/brand/Signes";
import { LienBouton } from "@/components/ui/Bouton";
import { prix } from "@/content/site";
import { PRIX } from "@/content/produits";

gsap.registerPlugin(ScrollTrigger);

const ARTICLES = [
  { nom: "Bougie parfumée", detail: "Une par famille olfactive", prix: prix(PRIX.bougie), visuel: "bougie-trois-quarts-gauche", href: "/boutique/bougie-floral" },
  { nom: "Format voyage", detail: "10 ml, étui vert et doré", prix: prix(PRIX.voyage), visuel: "format-voyage-trois-quarts-gauche", href: "/boutique/format-voyage" },
  { nom: "Recharge", detail: "50 ml, votre parfum d’atelier", prix: prix(PRIX.recharge), visuel: "flacon-face", href: "/boutique/recharge" },
  { nom: "Coffret cadeau", detail: "Vert à marquage doré", prix: PRIX.coffret === null ? "Sur demande en boutique" : prix(PRIX.coffret), visuel: "coffret-trois-quarts-gauche", href: "/boutique/coffret-cadeau" },
  { nom: "Carte cadeau", detail: "Un atelier et un parfum de 50 ml", prix: prix(PRIX.carteCadeauAtelier), visuel: "flacon-trois-quarts-droite", href: "/carte-cadeau" },
];

/**
 * Scène 5 : la boutique. Bandeau horizontal glissé par le défilement
 * (desktop, scène épinglée) ou au doigt (mobile, défilement natif à accroche).
 * Visuels : rendus 3D HD sur fond ivoire. Survol : légère rotation 3D.
 */
export function BandeauBoutique() {
  const racine = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = racine.current!;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
      const piste = el.querySelector<HTMLElement>("[data-piste]")!;
      const distance = () => Math.max(0, piste.scrollWidth - window.innerWidth + 64);
      gsap.to(piste, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, scrub: 0.6, pin: el.querySelector("[data-epingle]"), invalidateOnRefresh: true },
      });
    });
    return () => mm.revert();
  }, []);

  const incliner = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
    e.currentTarget.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
  };
  const remettre = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--ry", "0deg");
    e.currentTarget.style.setProperty("--rx", "0deg");
  };

  return (
    <section ref={racine} aria-labelledby="titre-boutique" className="relative">
      <div data-epingle className="flex min-h-svh flex-col justify-center overflow-hidden py-24">
        <div className="mx-auto flex w-full max-w-[90rem] items-end justify-between gap-6 px-4 sm:px-8">
          <div>
            <Surtitre>La boutique</Surtitre>
            <h2 id="titre-boutique" className="mt-5 font-serif text-titre font-medium">
              Prolongez l’émotion chez vous
            </h2>
          </div>
          <LienBouton href="/boutique" variante="lien" fleche className="hidden sm:inline-flex">
            Voir la boutique
          </LienBouton>
        </div>
        <ul
          data-piste
          className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:px-8 lg:w-max lg:snap-none lg:overflow-visible lg:pl-[max(2rem,calc((100vw-90rem)/2+2rem))] lg:pr-16"
        >
          {ARTICLES.map((a) => (
            <li key={a.nom} className="w-[76vw] max-w-[22rem] shrink-0 snap-center lg:w-[22rem]">
              <Link
                href={a.href}
                onPointerMove={incliner}
                onPointerLeave={remettre}
                className="group block [perspective:900px]"
              >
                <div
                  className="relative aspect-[4/5] bg-ivoire-clair shadow-[0_30px_60px_-40px_rgb(60_40_20/0.45)] transition-transform duration-500 ease-doux [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]"
                >
                  <Image
                    src={`/renders/${a.visuel}.webp`}
                    alt=""
                    fill
                    sizes="352px"
                    className="object-contain p-8 transition-transform duration-700 ease-doux group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-2xl font-medium">{a.nom}</h3>
                  <p className="shrink-0 tabular-nums">{a.prix}</p>
                </div>
                <p className="mt-1 text-encre-douce">{a.detail}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 px-4 sm:hidden">
          <LienBouton href="/boutique" variante="lien" fleche>
            Voir la boutique
          </LienBouton>
        </div>
      </div>
    </section>
  );
}
