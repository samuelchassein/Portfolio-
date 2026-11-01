"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Surtitre } from "@/components/brand/Signes";

gsap.registerPlugin(ScrollTrigger);

const ETAPES = [
  { n: "1", titre: "Je crée", texte: "L’atelier avec un conseiller.", image: "/images/parcours-1-je-cree.jpg", alt: "Une cliente sent une mouillette pendant qu’une conseillère lui présente les accords." },
  { n: "2", titre: "J’emporte", texte: "Votre flacon 50 ml et votre référence.", image: "/images/parcours-2-j-emporte.jpg", alt: "Une cliente découvre son flacon Maison Sensa au comptoir." },
  { n: "3", titre: "Je reviens", texte: "La recharge 50 ml à 89 €.", image: "/images/parcours-3-je-reviens.jpg", alt: "Une cliente revient au comptoir avec son flacon, accueillie par une conseillère." },
];

/**
 * Scène 4 bis : « Une expérience qui se prolonge ». Trois portraits en arche
 * (images ≈ 1 000 px : cadres ≤ 300 px de large), reliés par des flèches
 * dorées tracées au défilement. Sur mobile : défilement horizontal à accroche.
 */
export function ExperienceProlongee() {
  const racine = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = racine.current!;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(el.querySelectorAll("[data-carte]"), {
        y: 50,
        autoAlpha: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.18,
        scrollTrigger: { trigger: el.querySelector("[data-cartes]"), start: "top 78%", once: true },
      });
      el.querySelectorAll<SVGPathElement>("[data-fleche] path").forEach((p) => {
        const l = p.getTotalLength();
        gsap.fromTo(p, { strokeDasharray: l, strokeDashoffset: l }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut", scrollTrigger: { trigger: p, start: "top 75%", once: true } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={racine} aria-labelledby="titre-experience" className="overflow-hidden bg-travertin/45 py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-8">
        <Surtitre>Je crée, j’emporte, je reviens</Surtitre>
        <h2 id="titre-experience" className="mt-6 font-serif text-titre font-medium">
          Une expérience qui se prolonge
        </h2>
        <span aria-hidden="true" className="mx-auto mt-6 block h-px w-12 bg-dore" />
      </div>
      <ol
        data-cartes
        className="mx-auto mt-16 flex max-w-6xl snap-x snap-mandatory gap-6 overflow-x-auto px-[12vw] pb-4 [scrollbar-width:none] md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start md:gap-4 md:overflow-visible md:px-8"
      >
        {ETAPES.map((e, i) => (
          <li key={e.n} className="contents">
            <article data-carte className="w-[72vw] max-w-[18.75rem] shrink-0 snap-center text-center md:mx-auto md:w-full">
              <div className="relative mx-auto overflow-hidden rounded-t-full" style={{ aspectRatio: "15 / 16" }}>
                <Image src={e.image} alt={e.alt} fill sizes="300px" quality={90} className="object-cover object-top" />
              </div>
              <p className="mt-6 font-serif text-xl tabular-nums text-dore-texte">{e.n}.</p>
              <h3 className="font-serif text-3xl font-medium">{e.titre}</h3>
              <p className="mt-2 text-encre-douce">{e.texte}</p>
            </article>
            {i < ETAPES.length - 1 && (
              <svg data-fleche aria-hidden="true" viewBox="0 0 80 24" className="hidden w-16 self-center text-dore md:mt-[-6rem] md:block lg:w-20" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M2 14C22 4 50 4 74 12" />
                <path d="M68 6l7 6-8 4" />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
