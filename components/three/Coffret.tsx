"use client";

import { forwardRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { blocArrondi } from "@/lib/three/geometries";
import { creerTextureMarquage } from "@/lib/three/etiquette";
import { useTextureAsync } from "@/lib/three/useTextureAsync";

/**
 * Coffret cadeau : carton rigide vert profond à grain cuir, filet doré à la
 * base, marquage à chaud doré « MAISON SENSA ».
 * Unités W du flacon : ≈ 1,9 × 1,66 × 1,6 W (trio-socles-travertin.jpg).
 * Origine au centre de la base.
 */
export const COTES_COFFRET = { largeur: 1.9, hauteur: 1.66, profondeur: 1.6 } as const;

function textureGrain(taille = 512) {
  const c = document.createElement("canvas");
  c.width = c.height = taille;
  const g = c.getContext("2d")!;
  const d = g.createImageData(taille, taille);
  let seed = 3;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < d.data.length; i += 4) {
    const v = 128 + (rnd() - 0.5) * 60;
    d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
    d.data[i + 3] = 255;
  }
  g.putImageData(d, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 4);
  return t;
}

export const Coffret = forwardRef<THREE.Group, { onPret?: () => void }>(function Coffret({ onPret }, ref) {
  const { largeur: L, hauteur: H, profondeur: P } = COTES_COFFRET;
  const geo = useMemo(() => blocArrondi(L, H, P, 0.014, 0.008, 3), [L, H, P]);
  const grain = useMemo(() => (typeof document === "undefined" ? null : textureGrain()), []);
  const marquage = useTextureAsync(() => creerTextureMarquage({ couleur: "#E2BE7E", ratio: 1.6, largeurSensa: 0.6 }), []);
  useEffect(() => {
    if (marquage) onPret?.();
  }, [marquage, onPret]);

  const carton = (
    <meshPhysicalMaterial
      name="carton-vert"
      color="#2C5444"
      roughness={0.58}
      bumpMap={grain ?? undefined}
      bumpScale={0.6}
      sheen={0.4}
      sheenColor="#4f7a63"
      sheenRoughness={0.7}
      envMapIntensity={1.2}
    />
  );

  return (
    <group ref={ref} name="coffret-maison-sensa">
      <mesh name="boite" geometry={geo} castShadow receiveShadow>
        {carton}
      </mesh>
      {/* Filet doré à la base, comme sur les photos */}
      <mesh name="filet-dore" position={[0, 0.01, P / 2 - 0.001]}>
        <boxGeometry args={[L - 0.02, 0.02, 0.004]} />
        <meshPhysicalMaterial name="laiton" color="#D4AC70" metalness={1} roughness={0.25} />
      </mesh>
      {marquage && (
        <mesh name="marquage-coffret" position={[0, H * 0.47, P / 2 + 0.0015]}>
          <planeGeometry args={[0.8, 0.5]} />
          <meshPhysicalMaterial
            name="marquage-dore"
            map={marquage}
            emissiveMap={marquage}
            emissive="#B8925A"
            emissiveIntensity={0.55}
            transparent
            metalness={0.55}
            roughness={0.3}
            envMapIntensity={1.4}
          />
        </mesh>
      )}
    </group>
  );
});
