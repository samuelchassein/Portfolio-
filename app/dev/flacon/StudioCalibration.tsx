"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { Flacon, type QualiteFlacon } from "@/components/three/Flacon";
import { StudioLumiere } from "@/components/three/StudioLumiere";
import { Socle } from "@/components/three/Socle";
import { Bougie } from "@/components/three/Bougie";
import { FormatVoyage } from "@/components/three/FormatVoyage";
import { Coffret } from "@/components/three/Coffret";

/**
 * Studio interne : calibration, rendus HD, séquence 360° et export GLB.
 * Pilotable depuis Playwright (scripts/flacon-*.mjs) :
 *   window.__vue = { rotY, elev } (degrés), lu à chaque image ;
 *   window.__setFond("#rrggbb" | "transparent") ;
 *   window.__frames : compteur d'images rendues ;
 *   window.__exporterGLB() : GLB en base64 (page chargée avec qualite=export).
 */
declare global {
  interface Window {
    __flaconPret?: boolean;
    __frames?: number;
    __vue?: { rotY: number; elev: number };
    __setFond?: (c: string) => void;
    __exporterGLB?: () => Promise<string>;
  }
}

/** Fond de noyer cannelé procédural (uniquement pour comparer à la photo). */
function FondNoyer() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 8;
    const g = c.getContext("2d")!;
    for (let x = 0; x < 1024; x++) {
      const p = (x % 64) / 64;
      const v = 0.55 + 0.45 * Math.sin(p * Math.PI);
      g.fillStyle = `rgb(${Math.round(92 * v)},${Math.round(48 * v)},${Math.round(22 * v)})`;
      g.fillRect(x, 0, 1, 8);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <>
      <mesh position={[0, 1, -1.6]}>
        <planeGeometry args={[6, 5]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.001, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#E7D9C2" roughness={0.35} />
      </mesh>
    </>
  );
}

/** Applique window.__vue à chaque image et compte les images. */
function Controleur({
  groupe,
  cadreH,
  centreY,
  centreX,
  pret,
}: {
  groupe: React.RefObject<THREE.Group | null>;
  cadreH: number;
  centreY: number;
  centreX: number;
  pret: boolean;
}) {
  const { camera, size } = useThree();
  const n = useRef(0);
  useFrame(() => {
    const vue = window.__vue ?? { rotY: 0, elev: 4 };
    if (groupe.current) groupe.current.rotation.y = THREE.MathUtils.degToRad(vue.rotY);
    const e = THREE.MathUtils.degToRad(vue.elev);
    const dist = 20;
    camera.position.set(centreX, centreY + Math.sin(e) * dist, Math.cos(e) * dist);
    camera.lookAt(centreX, centreY, 0);
    const cam = camera as THREE.OrthographicCamera;
    const zoom = size.height / cadreH;
    if (cam.zoom !== zoom) {
      cam.zoom = zoom;
      cam.updateProjectionMatrix();
    }
    if (!pret) return;
    n.current++;
    window.__frames = n.current;
    if (n.current > 8) window.__flaconPret = true;
  }, -2);
  return null;
}

export default function StudioCalibration() {
  const [params, setParams] = useState<URLSearchParams | null>(null);
  const [pret, setPret] = useState(false);
  const onPret = useCallback(() => setPret(true), []);
  const groupe = useRef<THREE.Group>(null);
  const [fond, setFond] = useState("transparent");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setParams(p);
    setFond(p.get("fond") ?? "transparent");
    window.__vue = { rotY: Number(p.get("rotY") ?? 0), elev: Number(p.get("elev") ?? 4) };
    window.__setFond = setFond;
    window.__exporterGLB = async () => {
      if (!groupe.current) throw new Error("flacon absent");
      const clone = groupe.current.clone(true);
      clone.rotation.set(0, 0, 0);
      clone.updateMatrixWorld(true);
      // Étiquette en JPEG : le grain du papier rend le PNG très lourd (≈ 6 Mo).
      clone.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
        for (const t of [m?.map, m?.emissiveMap]) if (t) t.userData.mimeType = "image/jpeg";
      });
      const res = await new GLTFExporter().parseAsync(clone, { binary: true, onlyVisible: true, maxTextureSize: 4096 });
      const bytes = new Uint8Array(res as ArrayBuffer);
      let s = "";
      for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      return btoa(s);
    };
  }, []);

  if (!params) return null;
  const qualite = (params.get("qualite") ?? "haute") as QualiteFlacon;
  const produit = params.get("produit") ?? "flacon";
  const cadreH = Number(params.get("cadreH") ?? 1.62);
  const centreY = Number(params.get("centreY") ?? 0.756);
  const centreX = Number(params.get("centreX") ?? 0);
  const ombre = params.get("ombre") !== "0";
  const socle = params.get("socle") === "1";
  const jus = params.get("jus") ?? undefined;
  const resolution = params.get("res") ? Number(params.get("res")) : undefined;
  const couleurFond = fond === "noyer" ? "#5a301a" : fond === "transparent" ? "#F3E8D6" : fond;
  const fondUni = fond !== "noyer" && fond !== "transparent";

  return (
    <div style={{ position: "fixed", inset: 0, background: "transparent" }}>
      <Canvas
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        dpr={1}
        shadows
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <OrthographicCamera makeDefault position={[0, 0, 20]} near={0.1} far={100} />
        <Suspense fallback={null}>
          <StudioLumiere />
          {fond === "noyer" && <FondNoyer />}
          {fondUni && <color attach="background" args={[couleurFond]} />}
          {socle && <Socle />}
          {produit === "bougie" ? (
            <Bougie ref={groupe} onPret={onPret} qualite={qualite} allumee={params.get("flamme") !== "0"} />
          ) : produit === "voyage" ? (
            <FormatVoyage ref={groupe} onPret={onPret} />
          ) : produit === "coffret" ? (
            <Coffret ref={groupe} onPret={onPret} />
          ) : (
            <Flacon
              ref={groupe}
              qualite={qualite}
              onPret={onPret}
              couleurJus={jus ? `#${jus}` : undefined}
              fondRefraction={couleurFond}
              resolutionRefraction={resolution}
            />
          )}
          {ombre && fond !== "noyer" && (
            <ContactShadows position={[0, 0.001, 0]} opacity={0.42} scale={3} blur={2.6} far={1.2} resolution={1024} color="#3b2a1a" />
          )}
          <Controleur groupe={groupe} cadreH={cadreH} centreY={centreY} centreX={centreX} pret={pret} />
        </Suspense>
      </Canvas>
    </div>
  );
}
