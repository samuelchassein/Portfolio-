"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { EspaceVisite } from "@/content/visite";

/* Plan de la boutique : 1270 × 580 px → 12,7 × 5,8 unités (1 unité ≈ 1 m sur la maquette). */
export const surPlan = (px: number, py: number, h = 0) => new THREE.Vector3((px - 635) / 100, h, (py - 290) / 100);

export interface Orbite {
  tx: number;
  tz: number;
  r: number;
  th: number;
  ph: number;
}
export const ORBITE_DEPART: Orbite = { tx: 0, tz: 0, r: 15.5, th: 0.55, ph: 0.95 };

export interface EtatCamera {
  cam: Orbite;
  but: Orbite;
  auto: boolean;
  instantane: boolean;
  enMain: boolean;
}

/* Matériaux aux couleurs du design system. */
function useMateriaux() {
  return useMemo(
    () => ({
      mur: new THREE.MeshStandardMaterial({ color: "#efe5d4", roughness: 0.85 }),
      murSombre: new THREE.MeshStandardMaterial({ color: "#d9cbb3", roughness: 0.8 }),
      travertin: new THREE.MeshStandardMaterial({ color: "#e8dcc8", roughness: 0.6 }),
      sol: new THREE.MeshStandardMaterial({ color: "#f3e9d8", roughness: 0.9 }),
      socle: new THREE.MeshStandardMaterial({ color: "#d8c8ae", roughness: 0.95 }),
      laiton: new THREE.MeshStandardMaterial({ color: "#c9a26a", metalness: 0.35, roughness: 0.35 }),
      verre: new THREE.MeshStandardMaterial({ color: "#f6eddd", transparent: true, opacity: 0.18, roughness: 0.05, metalness: 0.1, depthWrite: false }),
      bois: new THREE.MeshStandardMaterial({ color: "#c7ad87", roughness: 0.7 }),
      led: new THREE.MeshStandardMaterial({ color: "#ffe2b0", emissive: "#ffc77a", emissiveIntensity: 1.4 }),
      jus: new THREE.MeshStandardMaterial({ color: "#d9a650", roughness: 0.15, metalness: 0.1 }),
      vert: new THREE.MeshStandardMaterial({ color: "#1f3a2e", roughness: 0.45 }),
      assise: new THREE.MeshStandardMaterial({ color: "#8f7f6c", roughness: 0.85 }),
      tapis: new THREE.MeshStandardMaterial({ color: "#e2d3bb", roughness: 1 }),
    }),
    [],
  );
}
type Materiaux = ReturnType<typeof useMateriaux>;

function Mur({ a, b, h = 1.15, e = 0.12, mat, chapeau = true, m }: { a: [number, number]; b: [number, number]; h?: number; e?: number; mat: THREE.Material; chapeau?: boolean; m: Materiaux }) {
  const A = surPlan(...a);
  const B = surPlan(...b);
  const long = A.distanceTo(B);
  const verre = mat === m.verre;
  return (
    <group position={[(A.x + B.x) / 2, 0, (A.z + B.z) / 2]} rotation-y={-Math.atan2(B.z - A.z, B.x - A.x)}>
      <mesh position-y={h / 2} castShadow={!verre} receiveShadow material={mat}>
        <boxGeometry args={[long, h, e]} />
      </mesh>
      {chapeau && (
        <mesh position-y={h} material={m.laiton}>
          <boxGeometry args={[long + e, 0.02, e + 0.01]} />
        </mesh>
      )}
    </group>
  );
}

function Etagere({ x0, x1, z, profondeur, niveaux, h, m }: { x0: number; x1: number; z: number; profondeur: number; niveaux: number; h: number; m: Materiaux }) {
  const A = surPlan(x0, z);
  const B = surPlan(x1, z);
  const long = B.x - A.x;
  const sens = z < 290 ? 1 : -1;
  const flacons = Math.floor(long / 0.22);
  return (
    <group position={[(A.x + B.x) / 2, 0, A.z]}>
      <mesh position-y={h / 2} castShadow receiveShadow material={m.bois}>
        <boxGeometry args={[long, h, profondeur]} />
      </mesh>
      {Array.from({ length: niveaux }, (_, i) => {
        const y = (h * (i + 1)) / (niveaux + 1);
        return (
          <group key={i} position-y={y}>
            <mesh position-z={profondeur * 0.21 * sens} material={m.led}>
              <boxGeometry args={[long * 0.98, 0.015, profondeur * 0.55]} />
            </mesh>
            {Array.from({ length: flacons }, (_, j) => (
              <mesh key={j} position={[-long / 2 + 0.12 + j * 0.22, 0.07, profondeur * 0.3 * sens + 0.06 * sens]} castShadow material={j % 4 === 3 ? m.vert : m.jus}>
                <boxGeometry args={[0.07, 0.12, 0.05]} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

function OblongTravertin({ rx, rz, epaisseur, m }: { rx: number; rz: number; epaisseur: number; m: Materiaux }) {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.absarc(-rx + rz, 0, rz, Math.PI / 2, Math.PI * 1.5, false);
    s.lineTo(rx - rz, -rz);
    s.absarc(rx - rz, 0, rz, -Math.PI / 2, Math.PI / 2, false);
    s.lineTo(-rx + rz, rz);
    return new THREE.ExtrudeGeometry(s, { depth: epaisseur, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2 });
  }, [rx, rz, epaisseur]);
  return <mesh geometry={geo} rotation-x={Math.PI / 2} castShadow receiveShadow material={m.travertin} />;
}

function Comptoir({ m }: { m: Materiaux }) {
  const geo = useMemo(() => {
    const courbe = new THREE.CatmullRomCurve3([new THREE.Vector3(-1.1, 0, -0.35), new THREE.Vector3(-0.3, 0, 0.05), new THREE.Vector3(0.5, 0, 0.12), new THREE.Vector3(1.1, 0, 0.3)]);
    const pts = courbe.getPoints(30);
    const s = new THREE.Shape();
    pts.forEach((p, i) => (i ? s.lineTo(p.x, p.z - 0.2) : s.moveTo(p.x, p.z - 0.2)));
    [...pts].reverse().forEach((p) => s.lineTo(p.x, p.z + 0.2));
    return new THREE.ExtrudeGeometry(s, { depth: 0.95, bevelEnabled: false });
  }, []);
  const c = surPlan(875, 440);
  return (
    <group position={[c.x, 0, c.z]}>
      <mesh geometry={geo} rotation-x={-Math.PI / 2} castShadow receiveShadow material={m.travertin} />
      <mesh position={[0.7, 1.1, 0.1]} material={m.laiton}>
        <cylinderGeometry args={[0.015, 0.015, 0.3]} />
      </mesh>
      <mesh position={[0.7, 1.25, 0.1]} material={m.laiton}>
        <sphereGeometry args={[0.13, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
    </group>
  );
}

function Suspension({ x, y, m }: { x: number; y: number; m: Materiaux }) {
  const p = surPlan(x, y);
  return (
    <group position={[p.x, 0, p.z]}>
      <mesh position-y={2.65} material={m.laiton}>
        <cylinderGeometry args={[0.005, 0.005, 1.2]} />
      </mesh>
      <mesh position-y={2.05} material={m.laiton}>
        <cylinderGeometry args={[0.34, 0.34, 0.03, 40]} />
      </mesh>
      <mesh position-y={1.97} material={m.led}>
        <sphereGeometry args={[0.07, 16, 16]} />
      </mesh>
      <pointLight position-y={1.9} color="#ffd29a" intensity={2.2} distance={5} decay={2} />
    </group>
  );
}

/** Repère d'un espace : anneau doré au sol, tige et pastille cliquable. */
function Repere({ espace, n, actif, attenue, onChoisir }: { espace: EspaceVisite; n: number; actif: boolean; attenue: boolean; onChoisir: () => void }) {
  const anneau = useRef<THREE.Mesh>(null);
  const g = surPlan(...espace.plan);
  useFrame(({ clock }) => {
    anneau.current?.scale.setScalar(1 + 0.16 * Math.sin(clock.elapsedTime * 2.5 + n));
  });
  return (
    <group position={[g.x, 0, g.z]}>
      <mesh ref={anneau} position-y={0.02} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.18, 0.24, 40]} />
        <meshBasicMaterial color="#c9a26a" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position-y={0.78}>
        <cylinderGeometry args={[0.006, 0.006, 1.5]} />
        <meshBasicMaterial color="#c9a26a" transparent opacity={0.6} />
      </mesh>
      <Html position={[0, 1.6, 0]} center zIndexRange={[20, 0]}>
        {/* Doublon visuel de la barre des espaces (seule version annoncée aux lecteurs d'écran). */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={onChoisir}
          className={`group flex cursor-pointer items-center gap-2 whitespace-nowrap transition-opacity duration-300 ${attenue ? "opacity-30" : ""}`}
        >
          <span
            className={`grid size-8 place-items-center rounded-full bg-dore font-serif text-base text-encre transition-shadow duration-300 ${
              actif ? "shadow-[0_0_0_6px_rgb(201_162_106/0.45),0_0_24px_rgb(201_162_106/0.7)]" : "shadow-[0_0_0_6px_rgb(201_162_106/0.25)]"
            }`}
          >
            {n}
          </span>
          <span className={`border border-encre/10 bg-ivoire-clair/90 px-3 py-1 text-[0.6875rem] uppercase tracking-[0.2em] text-encre backdrop-blur-md ${actif ? "block" : "hidden md:block"}`}>
            {espace.nom}
          </span>
        </button>
      </Html>
    </group>
  );
}

/** Caméra en orbite amortie, pilotée par l'état partagé (glisser, molette, clavier, choix d'un espace). */
function Pilote({ etat }: { etat: React.RefObject<EtatCamera> }) {
  useFrame(({ camera }, dt) => {
    const e = etat.current;
    if (!e) return;
    const { cam, but } = e;
    if (e.auto && !e.enMain) but.th += Math.min(dt, 0.05) * 0.14;
    const k = e.instantane ? 1 : 1 - Math.pow(0.0015, Math.min(dt, 0.05));
    (Object.keys(but) as (keyof Orbite)[]).forEach((c) => (cam[c] += (but[c] - cam[c]) * k));
    const s = Math.sin(cam.ph);
    camera.position.set(cam.tx + cam.r * s * Math.sin(cam.th), cam.r * Math.cos(cam.ph), cam.tz + cam.r * s * Math.cos(cam.th));
    camera.lookAt(cam.tx, 0, cam.tz);
  });
  return null;
}

export function Maquette3D({
  etat,
  espaces,
  choisi,
  onChoisir,
}: {
  etat: React.RefObject<EtatCamera>;
  espaces: EspaceVisite[];
  choisi: number | null;
  onChoisir: (i: number) => void;
}) {
  const m = useMateriaux();
  const ilot = surPlan(470, 295);
  const atelier = surPlan(1000, 215);
  const orgue = surPlan(1010, 60);
  return (
    <>
      <Pilote etat={etat} />
      <hemisphereLight args={["#fff4e2", "#b8a68a", 0.9]} />
      <directionalLight
        position={[-6, 10, 7]}
        intensity={1.6}
        color="#fff0d6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[6, 4, -8]} intensity={0.35} color="#e9cf9f" />

      {/* Socle de la maquette et sol */}
      <mesh position-y={-0.18} receiveShadow material={m.socle}>
        <boxGeometry args={[13.1, 0.35, 6.2]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.001} receiveShadow material={m.sol}>
        <planeGeometry args={[12.7, 5.8]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[ilot.x, 0.004, ilot.z]} receiveShadow material={m.tapis}>
        <circleGeometry args={[1.9, 64]} />
      </mesh>

      {/* Murs (coupe « maison de poupée ») et cloisons */}
      <Mur a={[40, 40]} b={[1240, 40]} mat={m.mur} m={m} />
      <Mur a={[1240, 40]} b={[1240, 520]} mat={m.mur} m={m} />
      <Mur a={[990, 520]} b={[1240, 520]} h={0.63} mat={m.mur} m={m} />
      <Mur a={[30, 500]} b={[680, 500]} h={0.4} mat={m.mur} m={m} />
      <Mur a={[40, 40]} b={[40, 500]} e={0.06} mat={m.verre} m={m} />
      <Mur a={[785, 40]} b={[785, 330]} e={0.08} mat={m.mur} m={m} />
      <Mur a={[785, 330]} b={[1040, 330]} h={1.03} e={0.04} mat={m.verre} m={m} />
      <Mur a={[1040, 330]} b={[1040, 520]} h={0.92} e={0.08} mat={m.murSombre} m={m} />
      <Mur a={[1040, 330]} b={[1240, 330]} h={0.92} e={0.08} mat={m.murSombre} m={m} />
      {/* Claustra en lames de laiton devant l'atelier */}
      {Array.from({ length: 9 }, (_, i) => {
        const p = surPlan(800, 70 + i * 28);
        return (
          <mesh key={i} position={[p.x + 0.07, 0.55, p.z]} castShadow material={m.laiton}>
            <boxGeometry args={[0.03, 1.1, 0.06]} />
          </mesh>
        );
      })}

      {/* Mur des familles et étagère basse */}
      <Etagere x0={140} x1={720} z={95} profondeur={0.32} niveaux={3} h={1} m={m} />
      <Etagere x0={200} x1={650} z={470} profondeur={0.26} niveaux={1} h={0.45} m={m} />

      {/* Vitrine : socles en travertin, flacon et bougie */}
      {(
        [
          [95, 140, 0.32],
          [125, 230, 0.22],
          [95, 300, 0.4],
        ] as const
      ).map(([x, y, h], i) => {
        const p = surPlan(x, y);
        return (
          <group key={i} position={[p.x, 0, p.z]}>
            <mesh position-y={h / 2} castShadow receiveShadow material={m.travertin}>
              <boxGeometry args={[0.38, h, 0.38]} />
            </mesh>
            {i !== 1 && (
              <mesh position-y={h + 0.08} castShadow material={i === 0 ? m.jus : m.mur}>
                {i === 0 ? <boxGeometry args={[0.1, 0.16, 0.06]} /> : <cylinderGeometry args={[0.07, 0.07, 0.1, 24]} />}
              </mesh>
            )}
          </group>
        );
      })}

      {/* Îlot de découverte : plateau en travertin sur fûts en laiton */}
      <group position={[ilot.x, 0, ilot.z]}>
        <group position-y={0.82}>
          <OblongTravertin rx={1.45} rz={0.55} epaisseur={0.07} m={m} />
        </group>
        {[-0.7, 0, 0.7].map((dx) => (
          <mesh key={dx} position={[dx, 0.375, 0]} castShadow material={m.laiton}>
            <cylinderGeometry args={[0.24, 0.24, 0.75, 40]} />
          </mesh>
        ))}
        {Array.from({ length: 14 }, (_, i) => (
          <mesh key={i} position={[-1.1 + i * 0.17, 0.9, i % 2 ? 0.18 : -0.18]} castShadow material={i % 5 === 2 ? m.vert : i % 3 ? m.jus : m.mur}>
            {i % 3 === 0 ? <cylinderGeometry args={[0.05, 0.05, 0.09, 20]} /> : <boxGeometry args={[0.07, 0.13 + (i % 4) * 0.02, 0.07]} />}
          </mesh>
        ))}
      </group>

      <Comptoir m={m} />

      {/* Atelier : table oblongue, fauteuils, orgue à parfums */}
      <group position={[atelier.x, 0, atelier.z]}>
        <group position-y={0.78}>
          <OblongTravertin rx={1.2} rz={0.38} epaisseur={0.05} m={m} />
        </group>
        <mesh position-y={0.365} material={m.laiton}>
          <cylinderGeometry args={[0.18, 0.22, 0.73, 32]} />
        </mesh>
        {[-0.75, 0, 0.75].flatMap((dx) =>
          [-1, 1].map((s) => (
            <group key={`${dx}${s}`} position={[dx, 0, s * 0.62]}>
              <mesh position-y={0.225} castShadow material={m.assise}>
                <boxGeometry args={[0.32, 0.45, 0.32]} />
              </mesh>
              <mesh position={[0, 0.6, s * 0.16]} castShadow material={m.assise}>
                <boxGeometry args={[0.32, 0.4, 0.06]} />
              </mesh>
            </group>
          )),
        )}
      </group>
      <group position={[orgue.x, 0, orgue.z]}>
        <mesh position-y={0.45} castShadow material={m.bois}>
          <boxGeometry args={[3.6, 0.9, 0.18]} />
        </mesh>
        <mesh position={[0, 0.6, 0.08]} material={m.led}>
          <boxGeometry args={[3.5, 0.02, 0.05]} />
        </mesh>
      </group>

      {/* Réserve (fermée au public) */}
      {[1080, 1200].map((x) => {
        const p = surPlan(x, 425);
        return (
          <mesh key={x} position={[p.x, 0.4, p.z]} castShadow material={m.bois}>
            <boxGeometry args={[0.25, 0.8, 1.5]} />
          </mesh>
        );
      })}

      <Suspension x={435} y={295} m={m} />
      <Suspension x={1000} y={215} m={m} />

      {espaces.map((e, i) => (
        <Repere key={e.cle} espace={e} n={i + 1} actif={choisi === i} attenue={choisi !== null && choisi !== i} onChoisir={() => onChoisir(i)} />
      ))}
    </>
  );
}
