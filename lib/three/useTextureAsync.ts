"use client";

import { useEffect, useState } from "react";
import type * as THREE from "three";

/** Charge une texture générée de façon asynchrone (canvas + polices) et la libère au démontage. */
export function useTextureAsync(fabrique: () => Promise<THREE.Texture>, deps: unknown[]) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let annule = false;
    let t: THREE.Texture | null = null;
    fabrique().then((r) => {
      if (annule) return r.dispose();
      t = r;
      setTex(r);
    });
    return () => {
      annule = true;
      t?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return tex;
}
