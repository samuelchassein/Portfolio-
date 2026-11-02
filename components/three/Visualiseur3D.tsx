"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OC } from "three-stdlib";
import { Flacon } from "./Flacon";
import { Bougie } from "./Bougie";
import { FormatVoyage } from "./FormatVoyage";
import { Coffret } from "./Coffret";
import { StudioLumiere } from "./StudioLumiere";
import type { Modele3D } from "@/content/produits";

const CADRAGE: Record<Modele3D, { cible: number; distance: number }> = {
  flacon: { cible: 0.72, distance: 5.2 },
  bougie: { cible: 0.6, distance: 5.6 },
  "format-voyage": { cible: 0.75, distance: 5.2 },
  coffret: { cible: 0.85, distance: 8.2 },
};

/** Rotation au clavier, transmise par le composant parent (flèches). */
export interface CommandeClavier {
  tourner: number;
  zoom: number;
}

function Pilote({ commande, modele }: { commande: React.RefObject<CommandeClavier>; modele: Modele3D }) {
  const controles = useRef<OC>(null);
  const { camera } = useThree();
  useFrame(() => {
    const c = controles.current;
    const k = commande.current;
    if (!c || !k) return;
    if (k.tourner) {
      const off = camera.position.clone().sub(c.target);
      off.applyAxisAngle(new THREE.Vector3(0, 1, 0), k.tourner);
      camera.position.copy(c.target).add(off);
      k.tourner = 0;
    }
    if (k.zoom) {
      const off = camera.position.clone().sub(c.target);
      const d = THREE.MathUtils.clamp(off.length() * (1 - k.zoom), c.minDistance, c.maxDistance);
      camera.position.copy(c.target).add(off.setLength(d));
      k.zoom = 0;
    }
    c.update();
  });
  const cad = CADRAGE[modele];
  return (
    <OrbitControls
      ref={controles}
      target={[0, cad.cible, 0]}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.7}
      minDistance={cad.distance * 0.7}
      maxDistance={cad.distance * 1.2}
      minPolarAngle={Math.PI * 0.28}
      maxPolarAngle={Math.PI * 0.52}
      autoRotate={!window.matchMedia("(prefers-reduced-motion: reduce)").matches}
      autoRotateSpeed={0.6}
    />
  );
}

export default function Visualiseur3D({
  modele,
  gravure,
  commande,
  mobile,
}: {
  modele: Modele3D;
  gravure?: string;
  commande: React.RefObject<CommandeClavier>;
  mobile: boolean;
}) {
  const cad = CADRAGE[modele];
  return (
    <Canvas
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      camera={{ position: [0, cad.cible + 1.1, cad.distance], fov: 28 }}
      className="cursor-grab active:cursor-grabbing"
    >
      <Suspense fallback={null}>
        <StudioLumiere resolution={mobile ? 256 : 512} />
        {modele === "flacon" && <Flacon qualite={mobile ? "mobile" : "haute"} gravure={gravure || undefined} fondRefraction="#F6EDDD" />}
        {modele === "bougie" && <Bougie qualite={mobile ? "mobile" : "haute"} />}
        {modele === "format-voyage" && <FormatVoyage />}
        {modele === "coffret" && <Coffret />}
        <ContactShadows position={[0, 0.001, 0]} opacity={0.4} scale={modele === "coffret" ? 5 : 3} blur={2.6} far={1.5} resolution={512} color="#3b2a1a" />
        <Pilote commande={commande} modele={modele} />
      </Suspense>
    </Canvas>
  );
}
