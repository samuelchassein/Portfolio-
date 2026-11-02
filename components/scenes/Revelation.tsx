"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Révélation au défilement des éléments marqués :
 *  - [data-reveler]        : montée douce + fondu ;
 *  - [data-ligne]          : ligne de texte qui sort d'un masque (manifeste) ;
 *  - [data-filet-trace]    : filet doré qui se trace (scaleX) ;
 *  - [data-parallaxe=0.12] : parallaxe verticale douce (fraction de hauteur).
 * Rien n'est caché sans JavaScript ni avec prefers-reduced-motion.
 */
export function Revelation({ children, className, as: Balise = "div", ...reste }: { children: ReactNode; className?: string; as?: "div" | "section" } & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      el.querySelectorAll<HTMLElement>("[data-reveler]").forEach((n) => {
        gsap.from(n, {
          y: 36,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          delay: Number(n.dataset.delai ?? 0),
          scrollTrigger: { trigger: n, start: "top 88%", once: true },
        });
      });
      const lignes = el.querySelectorAll<HTMLElement>("[data-ligne]");
      if (lignes.length) {
        gsap.from(lignes, {
          yPercent: 105,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: lignes[0], start: "top 82%", once: true },
        });
      }
      el.querySelectorAll<HTMLElement>("[data-filet-trace]").forEach((n) => {
        gsap.from(n, { scaleX: 0, duration: 1.2, ease: "power2.out", scrollTrigger: { trigger: n, start: "top 90%", once: true } });
      });
      el.querySelectorAll<HTMLElement>("[data-parallaxe]").forEach((n) => {
        const f = Number(n.dataset.parallaxe);
        gsap.fromTo(
          n,
          { yPercent: -f * 100 },
          { yPercent: f * 100, ease: "none", scrollTrigger: { trigger: n.parentElement ?? n, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    });
    return () => mm.revert();
  }, []);
  return (
    // @ts-expect-error -- ref polymorphe div/section
    <Balise ref={ref} className={className} {...reste}>
      {children}
    </Balise>
  );
}
