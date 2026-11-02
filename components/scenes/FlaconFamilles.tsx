"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FAMILLES } from "@/content/familles";
import { CoucheBotanique } from "./Botaniques";
import { LienBouton } from "@/components/ui/Bouton";
import type { EtatScene } from "@/components/three/SceneFlacon";

gsap.registerPlugin(ScrollTrigger);

const SceneFlacon = dynamic(() => import("@/components/three/SceneFlacon"), { ssr: false });

/** Vues HD (rendus Blender) utilisées sans WebGL : une par famille. */
const VUES_SECOURS = ["flacon-face", "flacon-trois-quarts-droite", "flacon-dos", "flacon-trois-quarts-gauche"];

function webglDisponible() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Scène 3 : le flacon héros et les quatre familles (épinglée, ≈ 400 vh ;
 * 250 vh sur mobile). Sans WebGL : rendus HD en fondu. Avec
 * prefers-reduced-motion : aucune scène épinglée, les familles en liste.
 */
export function FlaconFamilles() {
  const section = useRef<HTMLElement>(null);
  const etat = useRef<EtatScene>({ entree: 0, rotation: 0, famille: 0, sortie: 0, sourisX: 0, sourisY: 0 });
  const [mode, setMode] = useState<"inconnu" | "3d" | "images" | "reduit">("inconnu");
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMobile(window.matchMedia("(max-width: 767px)").matches);
    setMode(reduit ? "reduit" : webglDisponible() ? "3d" : "images");
  }, []);

  useEffect(() => {
    if (mode !== "3d" && mode !== "images") return;
    const el = section.current!;
    const ambiances = el.querySelectorAll<HTMLElement>("[data-ambiance]");
    const textes = el.querySelectorAll<HTMLElement>("[data-famille-texte]");
    const couches = el.querySelectorAll<HTMLElement>("[data-couche]");
    const vues = el.querySelectorAll<HTMLElement>("[data-vue]");
    const fin = el.querySelector<HTMLElement>("[data-fin]")!;
    const compteur = el.querySelector<HTMLElement>("[data-compteur]")!;
    const botaniques = el.querySelectorAll<HTMLElement>("[data-botanique]");

    // Phases (fraction de la section) : entrée 0–0,12 ; familles 0,12–0,82 ; fin 0,82–1.
    const DEBUT = 0.12;
    const FIN = 0.82;
    let courante = -1;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        const e = etat.current;
        e.entree = gsap.utils.clamp(0, 1, p / DEBUT);
        const pf = gsap.utils.clamp(0, 1, (p - DEBUT) / (FIN - DEBUT));
        // Un tour complet à chaque passage de famille, puis un temps de pose de
        // face : l'étiquette est lisible quand le nom de la famille apparaît.
        const segment = pf * 4;
        const k = Math.min(3, Math.floor(segment));
        const local = segment - k;
        const tour = k === 0 ? 0 : k - 1 + gsap.parseEase("power2.inOut")(gsap.utils.clamp(0, 1, local / 0.35));
        e.rotation = tour + Math.sin(local * Math.PI) * 0.03;
        e.famille = pf * 3.999 - 0.5 < 0 ? 0 : Math.min(3, pf * 4 - 0.5);
        e.sortie = gsap.utils.clamp(0, 1, (p - FIN - 0.06) / 0.12);
        const idx = Math.min(3, Math.floor(pf * 4));

        // Fonds d'ambiance : fondu continu entre familles.
        ambiances.forEach((a, i) => {
          const d = Math.abs(e.famille - i);
          a.style.opacity = String(gsap.utils.clamp(0, 1, 1.25 - d * 1.25));
        });
        // Botaniques : parallaxe selon la profondeur.
        const dansFamille = pf * 4 - idx - 0.5; // −0,5 … 0,5 dans la famille courante
        botaniques.forEach((b) => {
          const pr = Number(b.dataset.profondeur);
          b.style.translate = `0 ${(-dansFamille * 90 * (0.3 + pr)).toFixed(1)}px`;
        });
        if (idx !== courante) {
          courante = idx;
          compteur.textContent = `0${idx + 1}`;
          textes.forEach((t, i) => {
            const actif = i === idx && p < FIN + 0.02;
            gsap.to(t, { autoAlpha: actif ? 1 : 0, y: actif ? 0 : i < idx ? -30 : 30, duration: 0.7, ease: "expo.out", overwrite: true });
          });
          couches.forEach((c, i) => gsap.to(c, { autoAlpha: i === idx ? 1 : 0, duration: 0.9, ease: "power2.out", overwrite: true }));
          vues.forEach((v, i) => gsap.to(v, { autoAlpha: i === idx ? 1 : 0, duration: 0.9, ease: "power2.out", overwrite: true }));
        }
        const montrerFin = p >= FIN + 0.02;
        if (montrerFin !== fin.classList.contains("est-visible")) {
          fin.classList.toggle("est-visible", montrerFin);
          gsap.to(fin, { opacity: montrerFin ? 1 : 0, y: montrerFin ? 0 : 24, duration: 0.8, ease: "expo.out", overwrite: true });
          fin.style.pointerEvents = montrerFin ? "auto" : "none";
          textes.forEach((t) => montrerFin && gsap.to(t, { autoAlpha: 0, duration: 0.4, overwrite: true }));
          el.querySelector<HTMLElement>("[data-entete-familles]")!.style.opacity = montrerFin ? "0" : "1";
        }
      },
    });

    const souris = (ev: PointerEvent) => {
      etat.current.sourisX = (ev.clientX / window.innerWidth) * 2 - 1;
      etat.current.sourisY = (ev.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", souris, { passive: true });
    return () => {
      st.kill();
      window.removeEventListener("pointermove", souris);
    };
  }, [mode]);

  if (mode === "reduit") return <FamillesStatiques />;

  return (
    <section
      ref={section}
      aria-labelledby="titre-familles"
      className="relative h-[250vh] md:h-[400vh]"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Ambiances */}
        {FAMILLES.map((f, i) => (
          <div
            key={f.cle}
            data-ambiance
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse 70% 60% at 50% 55%, ${f.ambiance[0]} 0%, ${f.ambiance[1]} 100%)`, opacity: i === 0 ? 1 : 0 }}
          />
        ))}

        {/* Botaniques, derrière et devant le flacon */}
        {FAMILLES.map((f, i) => (
          <div key={f.cle} data-couche className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
            <CoucheBotanique famille={f.cle} mobile={mobile} />
          </div>
        ))}

        {/* Flacon */}
        <div className="absolute inset-x-0 bottom-[36%] top-[11%] md:inset-x-[22%] md:bottom-0 md:top-[6%]">
          {mode === "3d" && <SceneFlacon etat={etat} mobile={mobile} />}
          {mode === "images" &&
            VUES_SECOURS.map((v, i) => (
              <div key={v} data-vue className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
                <Image src={`/renders/${v}.webp`} alt="" fill sizes="(min-width: 768px) 56vw, 100vw" className="object-contain" />
              </div>
            ))}
        </div>

        {/* En-tête de scène + compteur */}
        <div data-entete-familles className="absolute inset-x-0 top-0 flex items-start justify-between px-4 pt-24 transition-opacity duration-500 sm:px-8 lg:pt-28">
          <h2 id="titre-familles" className="text-surtitre uppercase tracking-[0.36em] text-encre-douce">
            Les familles olfactives
          </h2>
          <p className="font-serif text-2xl tabular-nums text-encre" aria-hidden="true">
            <span data-compteur>01</span>
            <span className="text-encre-douce"> / 04</span>
          </p>
        </div>

        {/* Textes des familles */}
        {FAMILLES.map((f, i) => (
          <div
            key={f.cle}
            data-famille-texte
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 px-4 pb-[7vh] sm:px-8 md:inset-y-0 md:left-auto md:right-0 md:flex md:w-[30%] md:flex-col md:justify-center md:pb-0 md:pr-12"
            style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden", color: f.encre }}
          >
            <h3 className="font-serif text-[clamp(3.5rem,2rem+6vw,8.5rem)] font-medium leading-[0.9]">{f.nom}</h3>
            <p className="mt-5 font-serif text-xl italic leading-snug md:text-2xl">{f.evocation}</p>
            <span aria-hidden="true" className="mt-6 block h-px w-12 bg-dore" />
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] uppercase tracking-[0.2em]" aria-label={`Notes de la famille ${f.nom}`}>
              {f.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        ))}

        {/* Fin de scène */}
        {/* Lecteurs d'écran : toutes les familles, sans dépendre du défilement */}
        <ol className="sr-only">
          {FAMILLES.map((f) => (
            <li key={f.cle}>
              {f.nom} : {f.evocation} Notes : {f.notes.join(", ")}.
            </li>
          ))}
        </ol>

        {/* Fin de scène (reste atteignable au clavier : visible dès qu'un bouton a le focus) */}
        <div data-fin className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-[9vh] text-center opacity-0 focus-within:pointer-events-auto focus-within:!opacity-100">
          <p className="font-serif text-titre font-medium">Laquelle vous ressemble&#8239;?</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <LienBouton href="/diagnostic" variante="contour">
              Faire mon diagnostic
            </LienBouton>
            <LienBouton href="/atelier#reserver">Réserver l’atelier</LienBouton>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Version sans animation : les quatre familles en liste, rendu HD fixe. */
function FamillesStatiques() {
  return (
    <section aria-labelledby="titre-familles" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <h2 id="titre-familles" className="text-center font-serif text-titre font-medium">
          Les familles olfactives
        </h2>
        <div className="relative mx-auto mt-12 aspect-[3/4] w-full max-w-sm">
          <Image src="/renders/flacon-face.webp" alt="Le flacon Maison Sensa : verre épais, jus doré, bouchon vert laqué et bague en laiton." fill sizes="384px" className="object-contain" />
        </div>
        <ol className="mt-16 grid gap-6 sm:grid-cols-2">
          {FAMILLES.map((f, i) => (
            <li key={f.cle} className="p-8" style={{ background: `linear-gradient(160deg, ${f.ambiance[0]}, ${f.ambiance[1]})`, color: f.encre }}>
              <p className="font-serif text-xl tabular-nums">0{i + 1} / 04</p>
              <h3 className="mt-3 font-serif text-5xl font-medium">{f.nom}</h3>
              <p className="mt-3 font-serif text-xl italic">{f.evocation}</p>
              <p className="mt-4 text-sm uppercase tracking-[0.2em]">{f.notes.join(" · ")}</p>
            </li>
          ))}
        </ol>
        <div className="mt-14 text-center">
          <p className="font-serif text-titre font-medium">Laquelle vous ressemble&#8239;?</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <LienBouton href="/diagnostic" variante="contour">
              Faire mon diagnostic
            </LienBouton>
            <LienBouton href="/atelier#reserver">Réserver l’atelier</LienBouton>
          </div>
        </div>
      </div>
    </section>
  );
}
