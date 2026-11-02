"use client";

import { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { creerTextureMarquage } from "@/lib/three/etiquette";
import { useTextureAsync } from "@/lib/three/useTextureAsync";

/**
 * Bougie parfumée Maison Sensa : verre épais transparent, cire ivoire,
 * mèche et flamme, wordmark sérigraphié noir sur le verre.
 * Unités W du flacon (la bougie mesure ≈ 1,25 W de large et de haut, d'après
 * trio-socles-travertin.jpg). Origine au centre de la base.
 */
export const COTES_BOUGIE = { rayon: 0.62, hauteur: 1.22, paroi: 0.035, fond: 0.09, remplissage: 0.86 } as const;

function profilVerre() {
  const { rayon: R, hauteur: H, paroi: e, fond: f } = COTES_BOUGIE;
  const p: THREE.Vector2[] = [];
  const v = (x: number, y: number) => p.push(new THREE.Vector2(x, y));
  v(0, 0);
  v(R - 0.03, 0);
  v(R - 0.008, 0.008);
  v(R, 0.03);
  v(R, H - 0.006);
  v(R - 0.004, H);
  v(R - e + 0.004, H);
  v(R - e, H - 0.006);
  v(R - e, f + 0.02);
  v(R - e - 0.02, f);
  v(0, f);
  return p;
}

export interface BougieProps {
  /** Flamme allumée (animée en temps réel, absente du GLB). */
  allumee?: boolean;
  qualite?: "haute" | "mobile" | "export";
  onPret?: () => void;
}

export const Bougie = forwardRef<THREE.Group, BougieProps>(function Bougie({ allumee = true, qualite = "haute", onPret }, ref) {
  const { rayon: R, hauteur: H, paroi: e, fond: f, remplissage } = COTES_BOUGIE;
  const geoVerre = useMemo(() => new THREE.LatheGeometry(profilVerre(), 128), []);
  const hCire = (H - f) * remplissage;
  const marquage = useTextureAsync(
    () => creerTextureMarquage({ couleur: "#1E1B17", ratio: 1.67, largeurSensa: 0.72 }),
    [],
  );
  useEffect(() => {
    if (marquage) onPret?.();
  }, [marquage, onPret]);

  // Flamme : deux sprites additifs (cœur clair, halo chaud), légère oscillation.
  const flamme = useRef<THREE.Group>(null);
  const texFlamme = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 256;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 170, 4, 64, 150, 110);
    grad.addColorStop(0, "rgba(255,250,235,1)");
    grad.addColorStop(0.25, "rgba(255,214,140,0.95)");
    grad.addColorStop(0.6, "rgba(255,150,60,0.35)");
    grad.addColorStop(1, "rgba(255,120,40,0)");
    g.fillStyle = grad;
    g.beginPath();
    g.moveTo(64, 8);
    g.bezierCurveTo(96, 90, 112, 200, 64, 248);
    g.bezierCurveTo(16, 200, 32, 90, 64, 8);
    g.fill();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useFrame(({ clock }) => {
    if (!flamme.current) return;
    const t = clock.elapsedTime;
    flamme.current.scale.set(1 + Math.sin(t * 7.3) * 0.04, 1 + Math.sin(t * 5.1) * 0.06, 1);
    flamme.current.rotation.z = Math.sin(t * 3.7) * 0.04;
  });

  const export_ = qualite === "export";

  return (
    <group ref={ref} name="bougie-maison-sensa">
      <mesh name="verre-bougie" geometry={geoVerre} castShadow>
        <meshPhysicalMaterial
          name="verre-bougie"
          color="#ffffff"
          transmission={1}
          thickness={0.08}
          ior={1.5}
          roughness={0.02}
          clearcoat={1}
          clearcoatRoughness={0.03}
          attenuationColor="#F1F3EA"
          attenuationDistance={3}
          envMapIntensity={1.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cire ivoire, légèrement translucide et éclairée par la flamme */}
      <mesh name="cire" position={[0, f + hCire / 2, 0]}>
        <cylinderGeometry args={[R - e - 0.002, R - e - 0.002, hCire, 96]} />
        <meshPhysicalMaterial
          name="cire"
          color="#FBF3E4"
          roughness={0.5}
          sheen={0.3}
          sheenColor="#FFF4DE"
          sheenRoughness={0.6}
          emissive="#FFE2B4"
          emissiveIntensity={allumee ? 0.42 : 0.2}
          envMapIntensity={0.8}
        />
      </mesh>
      {/* Légère cuvette de cire fondue autour de la mèche */}
      <mesh name="cire-fondue" position={[0, f + hCire + 0.001, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[R * 0.55, 64]} />
        <meshPhysicalMaterial color="#EFE3CC" roughness={0.12} clearcoat={0.8} emissive="#FFD9A0" emissiveIntensity={allumee ? 0.2 : 0} />
      </mesh>

      {/* Mèche */}
      <mesh name="meche" position={[0, f + hCire + 0.04, 0]}>
        <cylinderGeometry args={[0.008, 0.01, 0.09, 8]} />
        <meshStandardMaterial color="#2a2018" roughness={0.9} />
      </mesh>

      {allumee && !export_ && texFlamme && (
        <group ref={flamme} position={[0, f + hCire + 0.09, 0]}>
          <sprite scale={[0.075, 0.2, 1]} position={[0, 0.06, 0]}>
            <spriteMaterial map={texFlamme} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
          </sprite>
          <pointLight color="#FFB866" intensity={0.6} distance={1.6} decay={2} position={[0, 0.06, 0]} />
        </group>
      )}

      {/* Wordmark sérigraphié sur la face avant du verre */}
      {marquage && (
        <mesh name="marquage-bougie" position={[0, H * 0.5, 0]}>
          <cylinderGeometry args={[R + 0.0015, R + 0.0015, 0.45, 96, 1, true, -0.6, 1.2]} />
          <meshStandardMaterial name="marquage-bougie" map={marquage} transparent roughness={0.4} side={THREE.FrontSide} />
        </mesh>
      )}
    </group>
  );
});
