"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Flacon } from "./Flacon";
import { Socle } from "./Socle";
import { StudioLumiere } from "./StudioLumiere";
import { FAMILLES } from "@/content/familles";

/**
 * Scène 3D du flacon héros. Pilotée par un objet partagé `etat` mis à jour
 * par le défilement (aucun re-rendu React pendant le scroll) :
 *  - entree (0→1) : le flacon descend et se pose sur le socle ;
 *  - rotation (en tours) : un tour complet à chaque passage de famille, puis
 *    une pose de face (étiquette lisible au moment où le nom apparaît) ;
 *  - famille (0→3, continu) : teinte du jus, lumière, fond de réfraction ;
 *  - sortie (0→1) : le flacon recule et s'efface.
 */
export interface EtatScene {
  entree: number;
  rotation: number;
  famille: number;
  sortie: number;
  sourisX: number;
  sourisY: number;
}

const COULEURS = FAMILLES.map((f) => ({
  jus: new THREE.Color(f.jus),
  fond: new THREE.Color(f.ambiance[0]),
  lumiere: new THREE.Color(f.lumiere),
}));

function melanger(cible: THREE.Color, cle: "jus" | "fond" | "lumiere", f: number) {
  const i = Math.max(0, Math.min(COULEURS.length - 1, Math.floor(f)));
  const j = Math.min(COULEURS.length - 1, i + 1);
  const t = THREE.MathUtils.smoothstep(f - i, 0.15, 0.85);
  return cible.copy(COULEURS[i][cle]).lerp(COULEURS[j][cle], t);
}

function Contenu({ etat, mobile }: { etat: React.RefObject<EtatScene>; mobile: boolean }) {
  const flacon = useRef<THREE.Group>(null);
  const support = useRef<THREE.Group>(null);
  const lumiere = useRef<THREE.DirectionalLight>(null);
  const jus = useMemo(() => new THREE.Color(FAMILLES[0].jus), []);
  const fond = useMemo(() => new THREE.Color(FAMILLES[0].ambiance[0]), []);
  const inclinaison = useRef({ x: 0, z: 0 });
  const { invalidate } = useThree();

  useFrame(({ clock }) => {
    const e = etat.current;
    if (!e || !flacon.current || !support.current) return;
    const t = clock.elapsedTime;
    const entree = THREE.MathUtils.smootherstep(e.entree, 0, 1);
    const sortie = THREE.MathUtils.smootherstep(e.sortie, 0, 1);

    // Descente sur le socle, respiration verticale très légère.
    flacon.current.position.y = (1 - entree) * 1.6 + Math.sin(t * 0.9) * 0.012 * entree;
    flacon.current.rotation.y = THREE.MathUtils.degToRad(-8) - e.rotation * Math.PI * 2;
    // Inclinaisons douces + réaction à la souris (desktop).
    const cibleX = (mobile ? 0 : e.sourisY * 0.06) + Math.sin(e.rotation * Math.PI * 4) * 0.035;
    const cibleZ = (mobile ? 0 : -e.sourisX * 0.05) + Math.sin(e.rotation * Math.PI * 2) * 0.02;
    inclinaison.current.x += (cibleX - inclinaison.current.x) * 0.06;
    inclinaison.current.z += (cibleZ - inclinaison.current.z) * 0.06;
    flacon.current.rotation.x = inclinaison.current.x;
    flacon.current.rotation.z = inclinaison.current.z;

    // Sortie : recule et s'efface.
    support.current.position.z = -sortie * 3.5;
    support.current.position.y = -sortie * 0.4;

    melanger(jus, "jus", e.famille);
    melanger(fond, "fond", e.famille);
    if (lumiere.current) melanger(lumiere.current.color, "lumiere", e.famille);
    invalidate();
  });

  return (
    <>
      <StudioLumiere resolution={mobile ? 256 : 512} />
      <directionalLight ref={lumiere} position={[-3, 4, 3]} intensity={1.6} />
      <group ref={support}>
        <group ref={flacon}>
          <Flacon qualite={mobile ? "mobile" : "haute"} jusDynamique={jus} fondRefraction={fond} />
        </group>
        <Socle largeur={1.9} profondeur={1.3} hauteur={0.22} />
        <ContactShadows position={[0, 0.002, 0]} opacity={0.5} scale={2.6} blur={2.4} far={1.4} resolution={mobile ? 256 : 512} color="#3b2a1a" />
      </group>
    </>
  );
}

export default function SceneFlacon({ etat, mobile }: { etat: React.RefObject<EtatScene>; mobile: boolean }) {
  const conteneur = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Pause du rendu hors écran.
  useEffect(() => {
    const el = conteneur.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={conteneur} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={mobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        camera={{ position: [0, 1.0, mobile ? 7.4 : 6.2], fov: 28, near: 0.1, far: 50 }}
        onCreated={({ camera }) => camera.lookAt(0, 0.62, 0)}
        aria-hidden="true"
      >
        <Contenu etat={etat} mobile={mobile} />
      </Canvas>
    </div>
  );
}
