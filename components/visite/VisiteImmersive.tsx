"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";

/** Visite 360° en plein écran sous l'en-tête, avec écran de chargement et solution sans WebGL. */
export function VisiteImmersive({ src }: { src: string }) {
  const [charge, setCharge] = useState(false);
  const [webgl, setWebgl] = useState(true);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);
  return (
    <section aria-label="Visite 360° de la boutique" className="relative h-svh pt-16 lg:pt-20">
      <h1 className="sr-only">Visite 360° de la boutique Maison Sensa</h1>
      {webgl ? (
        <iframe src={src} title="Visite 360° de la boutique Maison Sensa : faites glisser pour regarder autour de vous" className="size-full border-0" onLoad={() => setCharge(true)} allow="fullscreen; gyroscope; accelerometer" />
      ) : (
        <p className="mx-auto max-w-lg px-4 pt-24 text-center text-lg">Votre navigateur n’affiche pas la 3D. Découvrez la boutique en images sur la page « La Maison ».</p>
      )}
      {webgl && !charge && (
        <div aria-hidden="true" className="absolute inset-0 top-16 flex flex-col items-center justify-center bg-ivoire lg:top-20">
          <Wordmark decoratif className="w-40 animate-pulse" />
          <span className="mt-6 text-surtitre uppercase tracking-[0.36em] text-encre-douce">Ouverture des portes…</span>
        </div>
      )}
    </section>
  );
}
