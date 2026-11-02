"use client";

import { forwardRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { creerTextureMarquage } from "@/lib/three/etiquette";
import { useTextureAsync } from "@/lib/three/useTextureAsync";

/**
 * Format voyage 10 ml : tube laqué vert profond, bague dorée au tiers
 * supérieur (jonction capot / corps), fine base dorée, wordmark doré.
 * Unités W du flacon : diamètre ≈ 0,32 W, hauteur ≈ 1,5 W
 * (gamme-sur-comptoir.jpg). Origine au centre de la base.
 */
export const COTES_VOYAGE = { rayon: 0.16, hauteur: 1.5, bague: { bas: 1.05, haut: 1.13 }, base: 0.03 } as const;

/** Segment de révolution (rayon constant) avec arrondis aux extrémités. */
function profilSegment(r: number, y0: number, y1: number, arrondiBas: number, arrondiHaut: number, fermerBas: boolean, fermerHaut: boolean) {
  const p: THREE.Vector2[] = [];
  if (fermerBas) p.push(new THREE.Vector2(0, y0));
  for (let i = 0; i <= 6; i++) {
    const t = (i / 6) * (Math.PI / 2);
    p.push(new THREE.Vector2(r - arrondiBas + arrondiBas * Math.sin(t), y0 + arrondiBas - arrondiBas * Math.cos(t)));
  }
  for (let i = 0; i <= 6; i++) {
    const t = (i / 6) * (Math.PI / 2);
    p.push(new THREE.Vector2(r - arrondiHaut + arrondiHaut * Math.cos(t), y1 - arrondiHaut + arrondiHaut * Math.sin(t)));
  }
  if (fermerHaut) p.push(new THREE.Vector2(0, y1));
  return new THREE.LatheGeometry(p, 96);
}

export const FormatVoyage = forwardRef<THREE.Group, { onPret?: () => void }>(function FormatVoyage({ onPret }, ref) {
  const { rayon: R, hauteur: H, bague, base } = COTES_VOYAGE;
  const geos = useMemo(
    () => ({
      base: profilSegment(R, 0, base, 0.004, 0.001, true, false),
      corps: profilSegment(R - 0.002, base, bague.bas, 0.001, 0.003, true, true),
      bague: profilSegment(R + 0.003, bague.bas - 0.002, bague.haut + 0.002, 0.003, 0.003, false, false),
      capot: profilSegment(R - 0.002, bague.haut, H, 0.003, 0.02, true, true),
    }),
    [R, H, bague, base],
  );
  // Marquage doré sur le corps : arc de 1,8 rad (≈ 0,29 W) sur 0,16 W de haut.
  const marquage = useTextureAsync(
    () => creerTextureMarquage({ couleur: "#E2BE7E", ratio: 0.288 / 0.16, largeurSensa: 0.82, largeur: 1024 }),
    [],
  );
  useEffect(() => {
    if (marquage) onPret?.();
  }, [marquage, onPret]);

  const laque = (
    <meshPhysicalMaterial name="laque-verte" color="#2A5743" roughness={0.24} clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1.7} />
  );
  const or = <meshPhysicalMaterial name="laiton" color="#D4AC70" metalness={1} roughness={0.18} envMapIntensity={1.8} />;

  return (
    <group ref={ref} name="format-voyage-maison-sensa">
      <mesh name="base" geometry={geos.base} castShadow>
        {or}
      </mesh>
      <mesh name="corps" geometry={geos.corps} castShadow>
        {laque}
      </mesh>
      <mesh name="bague" geometry={geos.bague} castShadow>
        {or}
      </mesh>
      <mesh name="capot" geometry={geos.capot} castShadow>
        {laque}
      </mesh>
      {marquage && (
        <mesh name="marquage-voyage" position={[0, 0.6, 0]}>
          <cylinderGeometry args={[R + 0.0012, R + 0.0012, 0.16, 64, 1, true, -0.9, 1.8]} />
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
