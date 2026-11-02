"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { LienBouton } from "@/components/ui/Bouton";
import { Surtitre } from "@/components/brand/Signes";
import { ESPACES_VISITE as ESPACES } from "@/content/visite";
import { useMouvementReduit } from "@/lib/hooks";
import { Maquette3D, ORBITE_DEPART, surPlan, type EtatCamera } from "./Maquette3D";

const R_MIN = 5;
const R_MAX = 55;
const borne = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Bouton d'outil de la visite (pilule ivoire, état pressé en vert). */
function Outil({ presse, bureau, className = "", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { presse?: boolean; bureau?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={presse}
      {...p}
      className={`${bureau ? "hidden sm:inline-flex" : "inline-flex"} min-h-11 shrink-0 cursor-pointer items-center border px-4 text-[0.6875rem] uppercase tracking-[0.2em] backdrop-blur-md transition-colors duration-300 ${
        presse ? "border-vert bg-vert text-ivoire-clair" : "border-encre/15 bg-ivoire-clair/85 text-encre hover:border-dore"
      } ${className}`}
    />
  );
}

/** Repli sans WebGL : les espaces en images, même contenu que le panneau. */
function VisiteEnImages() {
  return (
    <ol className="mx-auto grid max-w-6xl gap-16 px-4 pb-24 sm:px-8">
      {ESPACES.map((e, i) => (
        <li key={e.cle} className="grid gap-6 md:grid-cols-2 md:items-center md:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src={e.images[0].src} alt={e.images[0].alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <Surtitre>
              Espace {i + 1} / {ESPACES.length}
            </Surtitre>
            <h2 className="mt-3 font-serif text-sous-titre font-medium">{e.nom}</h2>
            <p className="mt-3 text-encre-douce">{e.texte}</p>
            {e.lien && (
              <LienBouton href={e.lien.href} variante="lien" fleche className="mt-5">
                {e.lien.libelle}
              </LienBouton>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * Visite 360° : maquette 3D de la boutique à faire tourner, repères numérotés,
 * barre des espaces, panneau de détail, visite guidée.
 * Clavier : flèches pour tourner, + / − pour zoomer, Échap pour fermer le panneau.
 */
export function VisiteImmersive() {
  const reduit = useMouvementReduit();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [choisi, setChoisi] = useState<number | null>(null);
  const [auto, setAuto] = useState(true);
  const [guidee, setGuidee] = useState(false);
  const [aide, setAide] = useState(true);
  const etat = useRef<EtatCamera>({ cam: { ...ORBITE_DEPART }, but: { ...ORBITE_DEPART }, auto: true, instantane: false, enMain: false });
  const cadre = useRef<HTMLDivElement>(null);
  const titrePanneau = useRef<HTMLHeadingElement>(null);
  const pointeurs = useRef(new Map<number, [number, number]>());
  const rayonDepart = useRef(ORBITE_DEPART.r);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);

  useEffect(() => {
    etat.current.auto = auto && !reduit && choisi === null;
    etat.current.instantane = reduit;
  }, [auto, reduit, choisi]);

  /* Recul de la caméra selon le format de l'écran (portrait = plus loin). */
  useEffect(() => {
    const el = cadre.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const ratio = el.clientWidth / Math.max(el.clientHeight, 1);
      rayonDepart.current = ratio < 1.3 ? Math.min(42, (15.5 * 1.35) / ratio) : 15.5;
      if (choisi === null) etat.current.but.r = rayonDepart.current;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [choisi, webgl]);

  const cacherAide = () => setAide(false);

  const choisir = useCallback((i: number, focus = true) => {
    setChoisi(i);
    const etroit = window.innerWidth < 768;
    const g = surPlan(...ESPACES[i].plan);
    Object.assign(etat.current.but, { tx: g.x + (etroit ? 0 : 1.3), tz: g.z + (etroit ? 1.4 : 0), r: etroit ? Math.max(13, rayonDepart.current * 0.6) : 8.5, ph: 0.88 });
    setAide(false);
    if (focus) requestAnimationFrame(() => titrePanneau.current?.focus({ preventScroll: true }));
  }, []);

  const fermer = useCallback(() => {
    setChoisi(null);
    setGuidee(false);
    Object.assign(etat.current.but, { tx: 0, tz: 0, r: rayonDepart.current });
  }, []);

  /* Visite guidée : un espace toutes les 6 s, la maquette tourne entre deux. */
  useEffect(() => {
    if (!guidee) return;
    let i = choisi === null ? 0 : (choisi + 1) % ESPACES.length;
    const etape = () => {
      choisir(i, false);
      etat.current.but.th += 0.9;
      i = (i + 1) % ESPACES.length;
    };
    etape();
    const t = setInterval(etape, 6000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guidee]);

  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === "Escape" && choisi !== null && fermer();
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [choisi, fermer]);

  /* Gestes : glisser pour tourner, pincer ou molette pour zoomer. */
  const surAppui = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointeurs.current.set(e.pointerId, [e.clientX, e.clientY]);
    etat.current.enMain = true;
    setGuidee(false);
    cacherAide();
  };
  const surDeplacement = (e: React.PointerEvent) => {
    const p = pointeurs.current;
    const prec = p.get(e.pointerId);
    if (!prec) return;
    const but = etat.current.but;
    if (p.size === 1) {
      but.th -= (e.clientX - prec[0]) * 0.006;
      but.ph = borne(but.ph - (e.clientY - prec[1]) * 0.005, 0.12, 1.42);
    } else if (p.size === 2) {
      const autre = [...p.entries()].find(([k]) => k !== e.pointerId)?.[1];
      if (autre) {
        const d0 = Math.hypot(prec[0] - autre[0], prec[1] - autre[1]);
        const d1 = Math.hypot(e.clientX - autre[0], e.clientY - autre[1]);
        but.r = borne((but.r * d0) / Math.max(d1, 1), R_MIN, R_MAX);
      }
    }
    p.set(e.pointerId, [e.clientX, e.clientY]);
  };
  const surRelache = (e: React.PointerEvent) => {
    pointeurs.current.delete(e.pointerId);
    if (!pointeurs.current.size) etat.current.enMain = false;
  };
  useEffect(() => {
    const el = cadre.current;
    if (!el) return;
    const molette = (e: WheelEvent) => {
      e.preventDefault();
      etat.current.but.r = borne(etat.current.but.r * (1 + e.deltaY * 0.0012), R_MIN, R_MAX);
      setAide(false);
    };
    el.addEventListener("wheel", molette, { passive: false });
    return () => el.removeEventListener("wheel", molette);
  }, [webgl]);
  const surClavier = (e: React.KeyboardEvent) => {
    const but = etat.current.but;
    const actions: Record<string, () => void> = {
      ArrowLeft: () => (but.th += 0.25),
      ArrowRight: () => (but.th -= 0.25),
      ArrowUp: () => (but.ph = borne(but.ph - 0.12, 0.12, 1.42)),
      ArrowDown: () => (but.ph = borne(but.ph + 0.12, 0.12, 1.42)),
      "+": () => (but.r = borne(but.r * 0.88, R_MIN, R_MAX)),
      "=": () => (but.r = borne(but.r * 0.88, R_MIN, R_MAX)),
      "-": () => (but.r = borne(but.r * 1.12, R_MIN, R_MAX)),
    };
    const a = actions[e.key];
    if (a) {
      e.preventDefault();
      a();
      setGuidee(false);
      cacherAide();
    }
  };

  const recentrer = () => {
    setGuidee(false);
    fermer();
    Object.assign(etat.current.but, { ...ORBITE_DEPART, r: rayonDepart.current, th: etat.current.but.th });
  };
  const vueDessus = () => {
    setGuidee(false);
    fermer();
    const but = etat.current.but;
    Object.assign(but, { ph: 0.12, r: Math.max(14, rayonDepart.current * 0.95), th: Math.round(but.th / (Math.PI * 2)) * Math.PI * 2 });
  };

  const espace = choisi !== null ? ESPACES[choisi] : null;

  if (webgl === false)
    return (
      <section aria-labelledby="titre-visite" className="pt-28 lg:pt-32">
        <div className="mx-auto max-w-3xl px-4 pb-16 text-center">
          <Surtitre>Visite de la boutique</Surtitre>
          <h1 id="titre-visite" className="mt-5 font-serif text-titre font-medium">
            Entrez dans la boutique
          </h1>
          <p className="mt-5 text-encre-douce">Votre navigateur n’affiche pas la 3D : voici les cinq espaces de la boutique en images.</p>
        </div>
        <VisiteEnImages />
      </section>
    );

  return (
    <section aria-labelledby="titre-visite" className="relative h-svh overflow-hidden bg-[radial-gradient(80%_70%_at_50%_45%,var(--ivoire-clair),var(--travertin)_80%)] pt-16 lg:pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-16 z-10 flex flex-wrap items-start justify-between gap-4 px-4 pt-5 sm:px-8 lg:top-20">
        <div>
          <Surtitre>Maquette 360°</Surtitre>
          <h1 id="titre-visite" className="mt-2 font-serif text-sous-titre font-medium">
            Entrez dans la boutique
          </h1>
        </div>
        <div className="pointer-events-auto flex flex-wrap justify-end gap-2" role="toolbar" aria-label="Commandes de la visite">
          {!reduit && (
            <Outil presse={auto} onClick={() => setAuto(!auto)} bureau>
              Rotation
            </Outil>
          )}
          <Outil presse={guidee} onClick={() => setGuidee(!guidee)}>
            {guidee ? "Arrêter la visite" : "Visite guidée"}
          </Outil>
          <Outil onClick={vueDessus} bureau>
            Vue de dessus
          </Outil>
          <Outil onClick={recentrer}>Recentrer</Outil>
        </div>
      </div>

      <div
        ref={cadre}
        tabIndex={0}
        role="application"
        aria-roledescription="maquette 3D"
        aria-label="Maquette 3D de la boutique Maison Sensa. Flèches pour tourner, plus et moins pour zoomer. Choisissez un espace dans la barre en bas de l’écran."
        onPointerDown={surAppui}
        onPointerMove={surDeplacement}
        onPointerUp={surRelache}
        onPointerCancel={surRelache}
        onKeyDown={surClavier}
        className="absolute inset-0 top-16 cursor-grab touch-none outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-dore active:cursor-grabbing lg:top-20"
      >
        {webgl && (
          <Canvas shadows dpr={[1, 2]} camera={{ fov: 36, near: 0.1, far: 200 }} gl={{ antialias: true, alpha: true }}>
            <fog attach="fog" args={["#efe4d2", 40, 90]} />
            <Suspense fallback={null}>
              <Maquette3D etat={etat} espaces={ESPACES} choisi={choisi} onChoisir={(i) => choisir(i)} />
            </Suspense>
          </Canvas>
        )}
      </div>

      <p
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-24 z-10 text-center text-surtitre uppercase tracking-[0.3em] text-encre-douce transition-opacity duration-700 ${aide ? "opacity-100" : "opacity-0"}`}
      >
        Glissez pour tourner · pincez ou molette pour zoomer
      </p>

      <nav aria-label="Espaces de la boutique" className="absolute inset-x-0 bottom-0 z-10 overflow-x-auto px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 [scrollbar-width:none] sm:px-8">
        <ul className="flex w-max gap-2">
          {ESPACES.map((e, i) => (
            <li key={e.cle}>
              <Outil presse={choisi === i} onClick={() => (choisi === i ? fermer() : choisir(i))}>
                <span className="mr-2 font-serif text-sm normal-case tracking-normal text-dore-texte aria-pressed:text-inherit">{i + 1}</span>
                {e.nom}
              </Outil>
            </li>
          ))}
        </ul>
      </nav>

      <aside
        aria-label={espace ? espace.nom : "Détail de l’espace"}
        aria-hidden={!espace}
        inert={!espace}
        className={`absolute z-20 overflow-y-auto border border-encre/10 bg-ivoire-clair/95 shadow-[0_30px_80px_-40px_rgb(28_26_23/0.5)] backdrop-blur-xl transition-transform duration-700 ease-doux max-md:inset-x-3 max-md:bottom-3 max-md:max-h-[62%] md:bottom-24 md:right-8 md:top-40 md:w-[24rem] ${
          espace ? "translate-x-0 translate-y-0" : "max-md:translate-y-[calc(100%+2rem)] md:translate-x-[calc(100%+3rem)]"
        }`}
      >
        {espace && (
          <>
            <div className="sticky top-0 z-10 h-0">
              <button
                type="button"
                onClick={fermer}
                className="absolute right-3 top-3 inline-flex size-11 cursor-pointer items-center justify-center bg-ivoire-clair/90 text-encre"
                aria-label="Fermer le détail"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="m5 5 14 14M19 5 5 19" />
                </svg>
              </button>
            </div>
            <div className={`grid gap-1.5 p-2 ${espace.images.length > 1 ? "max-md:grid-cols-2" : ""}`}>
              {espace.images.map((im) => (
                <div key={im.src} className="relative aspect-[4/3] overflow-hidden">
                  <Image src={im.src} alt={im.alt} fill sizes="(min-width: 768px) 384px, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
            <div className="px-6 pb-7 pt-3">
              <Surtitre>
                Espace {choisi! + 1} / {ESPACES.length}
              </Surtitre>
              <h2 ref={titrePanneau} tabIndex={-1} className="mt-2 font-serif text-[2rem] font-medium leading-tight outline-none">
                {espace.nom}
              </h2>
              <p className="mt-3 text-[0.9375rem] text-encre-douce">{espace.texte}</p>
              <dl className="mt-5">
                {espace.details.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-t border-encre/10 py-2.5 text-[0.875rem]">
                    <dt className="text-encre-douce">{k}</dt>
                    <dd className="text-right font-serif text-base">{v}</dd>
                  </div>
                ))}
              </dl>
              {espace.lien && (
                <LienBouton href={espace.lien.href} fleche className="mt-6 w-full justify-center">
                  {espace.lien.libelle}
                </LienBouton>
              )}
            </div>
          </>
        )}
      </aside>
    </section>
  );
}
