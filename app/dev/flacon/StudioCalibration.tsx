"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { Flacon, type QualiteFlacon } from "@/components/three/Flacon";
import { StudioLumiere } from "@/components/three/StudioLumiere";
import { Socle } from "@/components/three/Socle";

declare global {
  interface Window {
    __flaconPret?: boolean;
    __flaconGroupe?: THREE.Group;
    __flaconScene?: THREE.Scene;
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
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(1, 1);
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

function Signal({ pret }: { pret: boolean }) {
  const n = useRef(0);
  const { scene } = useThree();
  useFrame(() => {
    if (!pret) return;
    n.current++;
    (window as unknown as { __frames: number }).__frames = n.current;
    if (n.current > 8) {
      window.__flaconScene = scene;
      window.__flaconPret = true;
    }
  });
  return null;
}

export default function StudioCalibration() {
  const [params, setParams] = useState<URLSearchParams | null>(null);
  useEffect(() => setParams(new URLSearchParams(window.location.search)), []);
  const [pret, setPret] = useState(false);
  const onPret = useCallback(() => setPret(true), []);
  const groupe = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupe.current) window.__flaconGroupe = groupe.current;
  });

  if (!params) return null;
  const rotY = THREE.MathUtils.degToRad(Number(params.get("rotY") ?? 0));
  const elev = THREE.MathUtils.degToRad(Number(params.get("elev") ?? 4));
  const fond = params.get("fond") ?? "transparent";
  const qualite = (params.get("qualite") ?? "haute") as QualiteFlacon;
  const cadreH = Number(params.get("cadreH") ?? 1.62);
  const centreY = Number(params.get("centreY") ?? 0.756);
  const centreX = Number(params.get("centreX") ?? 0);
  const ombre = params.get("ombre") !== "0";
  const jus = params.get("jus") ?? undefined;
  const socle = params.get("socle") === "1";
  const dist = 20;

  return (
    <div style={{ position: "fixed", inset: 0, background: "transparent" }}>
      <Canvas
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        dpr={1}
        shadows
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Kamera elev={elev} dist={dist} cadreH={cadreH} centreY={centreY} centreX={centreX} />
        <Suspense fallback={null}>
          <StudioLumiere />
          {fond === "noyer" && <FondNoyer />}
          {fond === "ivoire" && <color attach="background" args={["#F3E8D6"]} />}
          {socle && <Socle />}
          <group rotation-y={rotY}>
            <Flacon ref={groupe} qualite={qualite} onPret={onPret} couleurJus={jus ? `#${jus}` : undefined} fondRefraction={fond === "noyer" ? "#5a301a" : "#F3E8D6"} />
          </group>
          {ombre && fond !== "noyer" && (
            <ContactShadows position={[0, 0.001, 0]} opacity={0.45} scale={3} blur={2.6} far={1.2} resolution={1024} color="#3b2a1a" />
          )}
          <Signal pret={pret} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Kamera({ elev, dist, cadreH, centreY, centreX }: { elev: number; dist: number; cadreH: number; centreY: number; centreX: number }) {
  const { size } = useThree();
  const zoom = size.height / cadreH;
  const pos: [number, number, number] = [centreX, centreY + Math.sin(elev) * dist, Math.cos(elev) * dist];
  const ref = useRef<THREE.OrthographicCamera>(null);
  useEffect(() => {
    ref.current?.lookAt(centreX, centreY, 0);
  });
  return <OrthographicCamera ref={ref} makeDefault position={pos} zoom={zoom} near={0.1} far={100} />;
}
