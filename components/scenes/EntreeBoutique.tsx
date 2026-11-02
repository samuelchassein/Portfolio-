"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OmbresFeuillage } from "./OmbresFeuillage";
import { SITE } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scène 1 : entrer dans la boutique (épinglée, ≈ 300 vh ; 150 vh sur mobile).
 * 1. Façade plein écran, ombres de feuillage, titre et « Défiler pour entrer ».
 * 2. La caméra avance vers la porte (zoom ≤ 1,25×) pendant qu'un masque en
 *    forme de porte s'ouvre et révèle l'intérieur.
 * 3. L'intérieur occupe l'écran (1,0 → 1,15×).
 * 4. Fondu vers le comptoir et le texte d'accueil.
 * Sans animation (prefers-reduced-motion) : façade puis images fixes.
 *
 * Qualité : sources agrandies ×2 (3 344 px). En 1 440 px Retina, l'image est
 * affichée à ≤ 1,2× sa résolution au zoom maximal.
 */

// Porte vitrée de la façade, en fraction de l'image (mesurée sur facade.jpg).
const PORTE = { x0: 0.392, x1: 0.608, y0: 0.238, y1: 0.878, cx: 0.5, cy: 0.56 };
const RATIO_FACADE = 3344 / 1882;
const ZOOM_MAX = 1.25;

/** Rectangle de la porte à l'écran pour un zoom donné (object-fit: cover, centré). */
function rectPorte(W: number, H: number, zoom: number) {
  const k = Math.max(W / RATIO_FACADE, H);
  const w = k * RATIO_FACADE;
  const h = k;
  const ox = (W - w) / 2;
  const oy = (H - h) / 2;
  const o = { x: ox + PORTE.cx * w, y: oy + PORTE.cy * h };
  const p = (fx: number, fy: number) => ({
    x: o.x + (ox + fx * w - o.x) * zoom,
    y: o.y + (oy + fy * h - o.y) * zoom,
  });
  const a = p(PORTE.x0, PORTE.y0);
  const b = p(PORTE.x1, PORTE.y1);
  return { haut: a.y, gauche: a.x, droite: W - b.x, bas: H - b.y, largeur: b.x - a.x };
}

export function EntreeBoutique() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = section.current!;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const facade = el.querySelector<HTMLElement>("[data-facade]")!;
      const interieur = el.querySelector<HTMLElement>("[data-interieur]")!;
      const interieurImg = el.querySelector<HTMLElement>("[data-interieur-img]")!;
      const comptoir = el.querySelector<HTMLElement>("[data-comptoir]")!;
      const titre = el.querySelectorAll<HTMLElement>("[data-titre]");
      const accueil = el.querySelectorAll<HTMLElement>("[data-accueil] > *");
      const scene = el.querySelector<HTMLElement>("[data-scene]")!;

      const masque = (t: number) => {
        // t : 0 = porte, 1 = plein écran
        const W = scene.clientWidth;
        const H = scene.clientHeight;
        const r = rectPorte(W, H, ZOOM_MAX);
        const lerp = (a: number, b: number) => a + (b - a) * t;
        const rayon = lerp(r.largeur * 0.5, 0);
        return `inset(${lerp(r.haut, 0)}px ${lerp(r.droite, 0)}px ${lerp(r.bas, 0)}px ${lerp(r.gauche, 0)}px round ${rayon}px ${rayon}px 0 0)`;
      };
      const etat = { ouverture: 0, comptoir: 0 };
      // Seconde ouverture : un fondu doux qui s'étend depuis le comptoir visible
      // dans l'intérieur (masque radial adouci, pas de bord net).
      const voileComptoir = (t: number) => {
        const r = t * 135;
        const g = `radial-gradient(ellipse 60% 70% at 30% 58%, #000 ${Math.max(r - 28, 0)}%, transparent ${r}%)`;
        return g;
      };
      const appliquer = () => {
        interieur.style.clipPath = masque(etat.ouverture);
        const m = voileComptoir(etat.comptoir);
        comptoir.style.maskImage = m;
        comptoir.style.setProperty("-webkit-mask-image", m);
      };

      gsap.set(facade, { transformOrigin: `${PORTE.cx * 100}% ${PORTE.cy * 100}%` });
      gsap.set(interieurImg, { transformOrigin: "53% 45%" });
      gsap.set(interieur, { autoAlpha: 0 });
      gsap.set(comptoir, { autoAlpha: 0 });
      gsap.set(accueil, { autoAlpha: 0, y: 24 });
      appliquer();

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true },
      });
      tl.to(titre, { autoAlpha: 0, y: -30, duration: 0.12, stagger: 0.02, ease: "power2.in" }, 0.02)
        .to(el.querySelector("[data-voile]"), { autoAlpha: 0, duration: 0.12 }, 0.04)
        .to(facade, { scale: ZOOM_MAX, duration: 0.38, ease: "power2.inOut" }, 0)
        .set(interieur, { autoAlpha: 1 }, 0.26)
        .fromTo(interieurImg, { scale: 1.18 }, { scale: 1.0, duration: 0.2, ease: "power2.out" }, 0.26)
        .to(etat, { ouverture: 1, duration: 0.2, ease: "power2.inOut", onUpdate: appliquer }, 0.26)
        .to(interieurImg, { scale: 1.15, duration: 0.3 }, 0.46)
        .set(comptoir, { autoAlpha: 1 }, 0.64)
        .to(etat, { comptoir: 1, duration: 0.12, ease: "power1.inOut", onUpdate: appliquer }, 0.64)
        .fromTo(el.querySelector("[data-comptoir-img]"), { scale: 1.12 }, { scale: 1.0, duration: 0.3, ease: "power1.out" }, 0.64)
        .to(accueil, { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.03, ease: "power2.out" }, 0.76)
        .to({}, { duration: 0.1 });

      const surRedim = () => appliquer();
      window.addEventListener("resize", surRedim);
      return () => window.removeEventListener("resize", surRedim);
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} aria-label="Entrer dans la boutique" className="relative h-auto motion-safe:h-[150vh] motion-safe:md:h-[300vh]">
      {/* Version animée : scène collante */}
      <div data-scene className="relative h-svh overflow-hidden motion-safe:sticky motion-safe:top-0">
        <div data-facade className="absolute inset-0 will-change-transform">
          <Image
            src="/images/facade.jpg"
            alt="La façade de Maison Sensa : pierre claire, menuiseries vert profond et enseigne, portes vitrées ouvertes sur la boutique."
            fill
            priority
            sizes="100vw"
            quality={85}
            className="object-cover"
          />
          <OmbresFeuillage />
        </div>

        <div data-interieur className="absolute inset-0 invisible motion-reduce:hidden">
          <div data-interieur-img className="absolute inset-0 will-change-transform">
            <Image
              src="/images/interieur-vue-large.jpg"
              alt="L’intérieur de la boutique : comptoirs en noyer cannelé, niches éclairées, tables de bougies."
              fill
              sizes="100vw"
              quality={85}
              className="object-cover"
            />
          </div>
        </div>

        <div data-comptoir className="absolute inset-0 invisible motion-reduce:hidden">
          <div data-comptoir-img className="absolute inset-0 will-change-transform">
            <Image
              src="/images/comptoir-accueil.jpg"
              alt="Le comptoir d’accueil en travertin et noyer, sous l’enseigne Maison Sensa."
              fill
              sizes="100vw"
              quality={85}
              className="object-cover object-[50%_60%]"
            />
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ivoire via-ivoire/70 to-transparent" />
          <div data-accueil className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-6 pb-[12vh] text-center">
            <p className="font-sans text-surtitre uppercase tracking-[0.36em] text-dore-texte">Bienvenue chez Maison Sensa</p>
            <p className="mt-5 font-serif text-sous-titre font-medium leading-snug text-encre">
              Une boutique à découvrir librement, un atelier pour composer votre parfum.
            </p>
            <span aria-hidden="true" className="mx-auto mt-6 block h-px w-12 bg-dore" />
          </div>
        </div>

        {/* Titre sur la façade */}
        <div
          data-voile
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-ivoire from-30% via-ivoire/70 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-[4.5vh] text-center sm:px-10">
          <h1 data-titre className="mx-auto font-serif text-[clamp(2.4rem,1rem+3.6vw,4.4rem)] font-medium leading-[1.04] text-encre md:whitespace-nowrap">
            {SITE.signature}
          </h1>
          <div data-titre className="mt-6 flex flex-col items-center gap-3 motion-reduce:hidden" aria-hidden="true">
            <span className="text-surtitre uppercase tracking-[0.36em] text-encre-douce">Défiler pour entrer</span>
            <span className="relative block h-8 w-px overflow-hidden bg-encre/15">
              <span className="trait-defiler absolute inset-0 bg-dore" />
            </span>
          </div>
        </div>
      </div>

      {/* Version sans animation : l'intérieur et l'accueil, en images fixes */}
      <div className="hidden motion-reduce:block">
        <div className="relative h-[70svh]">
          <Image src="/images/interieur-vue-large.jpg" alt="L’intérieur de la boutique : comptoirs en noyer cannelé, niches éclairées, tables de bougies." fill sizes="100vw" className="object-cover" />
        </div>
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-surtitre uppercase tracking-[0.36em] text-dore-texte">Bienvenue chez Maison Sensa</p>
          <p className="mt-5 font-serif text-sous-titre font-medium">Une boutique à découvrir librement, un atelier pour composer votre parfum.</p>
        </div>
      </div>
    </section>
  );
}
