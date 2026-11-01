"use client";

import { useEffect, useState } from "react";

/** Suit une media query (false au premier rendu serveur). */
export function useMedia(requete: string) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(requete);
    const f = () => setOk(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, [requete]);
  return ok;
}

export const useMouvementReduit = () => useMedia("(prefers-reduced-motion: reduce)");
export const useMobile = () => useMedia("(max-width: 767px)");
