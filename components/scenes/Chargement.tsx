"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { WORDMARK } from "@/components/brand/wordmark-paths";

/**
 * Scène 0 : chargement (1,5 s maximum, une fois par session).
 * « MAISON » s'espace lettre par lettre, « SENSA » se révèle par un masque
 * vertical, un filet doré se trace dessous. Pas de barre de progression.
 * Décoratif : masqué aux lecteurs d'écran, ne bloque jamais la page.
 */
export function Chargement() {
  const [actif, setActif] = useState(true);
  const racine = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dejaVu = false;
    try {
      dejaVu = sessionStorage.getItem("ms-chargement") === "1";
      sessionStorage.setItem("ms-chargement", "1");
    } catch {
      /* stockage indisponible : on joue l'animation */
    }
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (dejaVu || reduit) {
      setActif(false);
      return;
    }
    const el = racine.current!;
    const cx = WORDMARK.largeur / 2;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: () => setActif(false) });
    tl.fromTo(
      el.querySelectorAll("[data-maison]"),
      { opacity: 0, x: (_i: number, t: Element) => (cx - Number((t as SVGElement).dataset.x)) * 0.55 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.04 },
      0,
    )
      .fromTo(el.querySelector("[data-masque]"), { attr: { y: WORDMARK.hauteur + 4 } }, { attr: { y: 30 }, duration: 0.75, ease: "power3.out" }, 0.18)
      .fromTo(el.querySelector("[data-filet]"), { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: "power2.out" }, 0.55)
      .to(el, { opacity: 0, duration: 0.35, ease: "power2.out" }, 1.12);
    return () => {
      tl.kill();
    };
  }, []);

  if (!actif) return null;
  const marge = 4;
  return (
    <div ref={racine} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-ivoire">
      <div className="flex w-[min(62vw,22rem)] flex-col items-center">
        <svg viewBox={`${-marge} ${-marge} ${WORDMARK.largeur + marge * 2} ${WORDMARK.hauteur + marge * 2}`} className="w-full text-encre" fill="currentColor">
          <defs>
            <clipPath id="masque-sensa">
              <rect data-masque x={-10} y={WORDMARK.hauteur + 4} width={WORDMARK.largeur + 20} height={WORDMARK.hauteur} />
            </clipPath>
          </defs>
          {WORDMARK.lettresMaison.map((l, i) => (
            <path key={i} d={l.d} data-maison data-x={l.x} style={{ opacity: 0 }} />
          ))}
          <path d={WORDMARK.sensa} clipPath="url(#masque-sensa)" />
        </svg>
        <span data-filet className="mt-6 block h-px w-14 origin-center scale-x-0 bg-dore" />
      </div>
    </div>
  );
}
