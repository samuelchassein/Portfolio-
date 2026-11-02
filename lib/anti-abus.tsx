"use client";

import { useRef } from "react";

/**
 * Protection anti-abus des formulaires : champ piège invisible (honeypot) et
 * délai minimum entre l'affichage et l'envoi (les robots remplissent tout,
 * tout de suite). Le bouton est désactivé pendant l'envoi par le formulaire.
 */
export const DELAI_MINIMUM_MS = 3000;

export function useAntiAbus() {
  const debut = useRef(Date.now());
  const piege = useRef<HTMLInputElement>(null);
  return {
    /** À placer dans le formulaire : invisible pour les personnes, ignoré par les lecteurs d'écran. */
    champPiege: (
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Ne pas remplir
          <input ref={piege} type="text" name="site_web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
    ),
    /** Faux = envoi suspect (on simule un succès sans rien envoyer). */
    estHumain: () => !piege.current?.value && Date.now() - debut.current >= DELAI_MINIMUM_MS,
  };
}
