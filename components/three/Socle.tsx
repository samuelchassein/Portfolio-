"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * Socle en travertin (matière procédurale : fond crème, veines horizontales
 * douces et petites alvéoles caractéristiques). Dessus à y = 0 : le flacon
 * se pose directement dessus.
 */
function textureTravertin(taille = 1024) {
  const c = document.createElement("canvas");
  c.width = c.height = taille;
  const g = c.getContext("2d")!;
  g.fillStyle = "#E6D8C0";
  g.fillRect(0, 0, taille, taille);
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  // Veines horizontales
  for (let i = 0; i < 90; i++) {
    const y = rnd() * taille;
    const h = 2 + rnd() * 14;
    g.fillStyle = `rgba(${190 + rnd() * 30},${165 + rnd() * 25},${125 + rnd() * 25},${0.04 + rnd() * 0.06})`;
    g.beginPath();
    g.moveTo(0, y);
    for (let x = 0; x <= taille; x += 32) g.lineTo(x, y + Math.sin(x * 0.01 + i) * 6 + (rnd() - 0.5) * 3);
    g.lineTo(taille, y + h);
    g.lineTo(0, y + h);
    g.fill();
  }
  // Alvéoles
  for (let i = 0; i < 900; i++) {
    const x = rnd() * taille;
    const y = rnd() * taille;
    const r = 0.6 + rnd() * rnd() * 5;
    g.fillStyle = `rgba(${120 + rnd() * 40},${95 + rnd() * 30},${65 + rnd() * 25},${0.18 + rnd() * 0.3})`;
    g.beginPath();
    g.ellipse(x, y, r * (1 + rnd()), r, 0, 0, Math.PI * 2);
    g.fill();
  }
  // Grain fin
  const d = g.getImageData(0, 0, taille, taille);
  for (let i = 0; i < d.data.length; i += 4) {
    const n = (rnd() - 0.5) * 10;
    d.data[i] += n;
    d.data[i + 1] += n;
    d.data[i + 2] += n;
  }
  g.putImageData(d, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

export function Socle({
  largeur = 1.7,
  hauteur = 0.2,
  profondeur = 1.15,
}: {
  largeur?: number;
  hauteur?: number;
  profondeur?: number;
}) {
  const tex = useMemo(() => textureTravertin(), []);
  return (
    <mesh name="socle" position={[0, -hauteur / 2, 0]} receiveShadow>
      <boxGeometry args={[largeur, hauteur, profondeur]} />
      <meshPhysicalMaterial map={tex} roughness={0.42} clearcoat={0.2} clearcoatRoughness={0.45} envMapIntensity={1.3} />
    </mesh>
  );
}
