"use client";

import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshTransmissionMaterial } from "@react-three/drei";
import {
  COTES,
  blocArrondi,
  geometrieBague,
  geometrieBouchon,
} from "@/lib/three/geometries";
import { creerTextureEtiquette } from "@/lib/three/etiquette";

export const COULEUR_JUS_DEFAUT = "#D9A94A";

/**
 * Jus vu à travers le verre (rendu temps réel). Un vrai volume transmissif
 * imbriqué dans un verre transmissif s'assombrit fortement en temps réel ; on
 * simule donc la lumière qui traverse le liquide : teinte profonde au centre,
 * plus claire et lumineuse sur les bords (effet de Fresnel inversé) et vers le
 * haut, comme sur la photo de référence. La version « export » garde un vrai
 * matériau à transmission pour les moteurs de rendu physiques.
 */
function creerMateriauJus() {
  const m = new THREE.MeshPhysicalMaterial({
    name: "jus",
    roughness: 0.22,
    metalness: 0,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
  });
  m.userData.uniforms = {
    uProfond: { value: new THREE.Color() },
    uClair: { value: new THREE.Color() },
  };
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, m.userData.uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vHauteur;\nvarying vec2 vLat;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvHauteur = position.y;\nvLat = position.xz;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform vec3 uProfond;\nuniform vec3 uClair;\nvarying float vHauteur;\nvarying vec2 vLat;",
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        float bord = pow(1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0), 1.4);
        float haut = smoothstep(0.1, 0.75, vHauteur);
        // Plus clair près des parois verticales (lumière qui traverse le verre épais)
        float paroi = smoothstep(0.30, 0.44, abs(vLat.x)) + smoothstep(0.17, 0.25, abs(vLat.y)) * 0.5;
        vec3 lum = mix(uProfond, uClair, clamp(bord * 0.8 + paroi * 0.55 + haut * 0.12, 0.0, 1.0));
        // Liseré lumineux le long des parois intérieures de la cavité
        float lisere = smoothstep(0.405, 0.438, abs(vLat.x)) * (1.0 - smoothstep(0.438, 0.45, abs(vLat.x)));
        lum = mix(lum, uClair * 1.35, lisere * 0.7);
        totalEmissiveRadiance += lum * 1.12;
        diffuseColor.rgb = lum * 0.12;`,
      );
  };
  return m;
}

function majMateriauJus(m: THREE.MeshPhysicalMaterial, couleur: string, reflets: number) {
  const base = new THREE.Color(couleur);
  // Centre ambré profond, bords dorés lumineux (valeurs relevées sur la photo).
  m.userData.uniforms.uProfond.value.copy(base).lerp(new THREE.Color("#9A4E05"), 0.72);
  m.userData.uniforms.uClair.value.copy(base).lerp(new THREE.Color("#FFB43C"), 0.4);
  m.envMapIntensity = reflets * 0.5;
}

export type QualiteFlacon = "haute" | "mobile" | "export";

export interface FlaconProps {
  /** Teinte du jus (attenuationColor). Doré d'origine par défaut. */
  couleurJus?: string;
  /** Intensité des reflets d'environnement (1 = réglage calibré). */
  reflets?: number;
  /** Affiche l'étiquette papier. */
  etiquette?: boolean;
  /** Texte de gravure prévisualisé sur l'étiquette. */
  gravure?: string;
  /**
   * haute : verre en MeshTransmissionMaterial (site desktop) ;
   * mobile : même rendu, résolution et échantillons réduits ;
   * export : MeshPhysicalMaterial standard (GLB, rendus, film).
   */
  qualite?: QualiteFlacon;
  /** Couleur vue à travers le verre quand rien n'est derrière (ambiance). */
  fondRefraction?: string | THREE.Color;
  /**
   * Couleur de jus pilotée image par image (scène des familles) : si fournie,
   * elle est recopiée à chaque image dans le matériau du jus, pour un glissement
   * continu sans re-rendu React.
   */
  jusDynamique?: THREE.Color;
  /** Résolution du tampon de réfraction (défaut : 1 024, 512 sur mobile). */
  resolutionRefraction?: number;
  onPret?: () => void;
}

/**
 * Le flacon Maison Sensa, en unités W (largeur du corps = 1, hauteur 1,5).
 * Origine au centre de la base : on le pose directement sur un socle.
 */
export const Flacon = forwardRef<THREE.Group, FlaconProps>(function Flacon(
  {
    couleurJus = COULEUR_JUS_DEFAUT,
    reflets = 1,
    etiquette = true,
    gravure,
    qualite = "haute",
    fondRefraction = "#e9dcc4",
    resolutionRefraction,
    jusDynamique,
    onPret,
  },
  ref,
) {
  const { corps, paroi, fond, jus, tube, bague, etiquette: et } = COTES;

  const geos = useMemo(() => {
    const hCavite = corps.hauteur - jus.margeHaut - fond;
    const hJus = hCavite * jus.remplissage;
    return {
      corps: blocArrondi(corps.largeur, corps.hauteur, corps.profondeur, corps.rayonAretes, corps.rayonEpaule, 8),
      jus: blocArrondi(
        corps.largeur - 2 * paroi,
        hJus,
        corps.profondeur - 2 * paroi,
        jus.rayon,
        0.03,
        6,
      ),
      hJus,
      hCavite,
      bague: geometrieBague(),
      bouchon: geometrieBouchon(),
    };
  }, [corps, paroi, fond, jus]);

  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let annule = false;
    let t: THREE.Texture | null = null;
    creerTextureEtiquette({ gravure }).then((tex) => {
      if (annule) return tex.dispose();
      t = tex;
      setTexture(tex);
    });
    return () => {
      annule = true;
      t?.dispose();
    };
  }, [gravure]);

  useEffect(() => {
    if (texture || !etiquette) onPret?.();
  }, [texture, etiquette, onPret]);

  const couleurJusThree = useMemo(() => new THREE.Color(couleurJus), [couleurJus]);
  const jusClair = useMemo(() => new THREE.Color(couleurJus).lerp(new THREE.Color("#FFF2C8"), 0.62), [couleurJus]);

  const export_ = qualite === "export";
  const fondCouleur = useMemo(
    () => (typeof fondRefraction === "string" ? new THREE.Color(fondRefraction) : fondRefraction),
    [fondRefraction],
  );
  const refMatJus = useRef<THREE.MeshPhysicalMaterial>(null);
  const blanc = useMemo(() => new THREE.Color("#FFF2C8"), []);
  useFrame(() => {
    const m = refMatJus.current;
    if (!jusDynamique || !m) return;
    m.attenuationColor.copy(jusDynamique);
    m.emissive.copy(jusDynamique);
    m.color.copy(jusDynamique).lerp(blanc, 0.62);
  });
  // L'étiquette est posée sur le verre : elle ne doit pas apparaître dans le
  // tampon de réfraction (sinon elle se dédouble à travers la face avant).
  // Priorité -1 : avant le rendu du tampon par MeshTransmissionMaterial ;
  // priorité 0 (souscrit après l'enfant) : on la réaffiche pour l'image finale.
  const refEtiquette = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (refEtiquette.current && !export_) refEtiquette.current.visible = false;
  }, -1);
  useFrame(() => {
    if (refEtiquette.current) refEtiquette.current.visible = true;
  });
  const matJus = useMemo(() => creerMateriauJus(), []);
  useEffect(() => {
    majMateriauJus(matJus, couleurJus, reflets);
  }, [matJus, couleurJus, reflets]);
  useEffect(() => () => matJus.dispose(), [matJus]);
  const yEtiquette = corps.hauteur - et.centreDepuisEpaule * corps.hauteur;

  return (
    <group ref={ref} name="flacon-maison-sensa">
      {/* Corps en verre massif */}
      <mesh name="verre" geometry={geos.corps} castShadow renderOrder={2}>
        {export_ ? (
          <meshPhysicalMaterial
            name="verre"
            color="#ffffff"
            transmission={1}
            thickness={0.35}
            ior={1.5}
            roughness={0.02}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.02}
            attenuationColor="#EEF2E6"
            attenuationDistance={4}
            envMapIntensity={reflets * 1.2}
            specularIntensity={1}
          />
        ) : (
          <MeshTransmissionMaterial
            name="verre"
            background={fondCouleur}
            transmission={1}
            thickness={0.55}
            ior={1.5}
            roughness={0}
            chromaticAberration={0.04}
            anisotropicBlur={0.06}
            distortion={0}
            clearcoat={1}
            clearcoatRoughness={0.02}
            attenuationColor="#EEF2E6"
            attenuationDistance={4}
            envMapIntensity={reflets * 1.2}
            samples={qualite === "mobile" ? 4 : 10}
            resolution={resolutionRefraction ?? (qualite === "mobile" ? 512 : 1024)}
            backside={false}
            specularIntensity={1}
          />
        )}
      </mesh>

      {/* Jus dans la cavité : volume séparé, teinte paramétrable */}
      <mesh name="jus" geometry={geos.jus} position={[0, fond, 0]} renderOrder={1}>
        {export_ ? (
          <meshPhysicalMaterial
            name="jus"
            color={jusClair}
            transmission={1}
            thickness={0.5}
            ior={1.36}
            roughness={0.05}
            attenuationColor={couleurJusThree}
            attenuationDistance={0.9}
            envMapIntensity={reflets * 0.6}
          />
        ) : qualite === "haute" ? (
          <meshPhysicalMaterial
            ref={refMatJus}
            name="jus"
            color={jusClair}
            transmission={1}
            thickness={0.6}
            ior={1.36}
            roughness={0.03}
            attenuationColor={couleurJusThree}
            attenuationDistance={1.0}
            // Lueur de contre-jour : garde le jus lumineux devant un fond sombre
            emissive={couleurJusThree}
            emissiveIntensity={0.32}
            envMapIntensity={reflets * 0.5}
            specularIntensity={0.5}
          />
        ) : (
          <primitive object={matJus} attach="material" />
        )}
      </mesh>

      {/* Tube plongeur, très fin, légèrement vers l'avant */}
      <mesh name="tube" position={[0, fond + geos.hCavite / 2 + 0.02, tube.avance]}>
        <cylinderGeometry args={[tube.rayon, tube.rayon, geos.hCavite + 0.03, 12]} />
        <meshPhysicalMaterial
          name="tube"
          color="#f7efe0"
          transmission={0.9}
          roughness={0.1}
          thickness={0.01}
          ior={1.45}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Étiquette papier sur la face avant */}
      {etiquette && texture && (
        <mesh ref={refEtiquette} name="etiquette" position={[0, yEtiquette, corps.profondeur / 2 + 0.0015]} renderOrder={3}>
          <planeGeometry args={[et.largeur, et.hauteur]} />
          <meshStandardMaterial
            name="etiquette"
            map={texture}
            emissiveMap={texture}
            emissive="#ffffff"
            emissiveIntensity={0.42}
            roughness={0.92}
            metalness={0}
            envMapIntensity={0.6}
          />
        </mesh>
      )}

      {/* Bague en laiton poli */}
      <mesh name="bague" geometry={geos.bague} position={[0, corps.hauteur - 0.002, 0]} castShadow>
        <meshPhysicalMaterial
          name="laiton"
          color="#D4AC70"
          metalness={1}
          roughness={0.16}
          envMapIntensity={reflets * 1.8}
        />
      </mesh>

      {/* Bouchon laqué vert profond */}
      <mesh name="bouchon" geometry={geos.bouchon} position={[0, corps.hauteur + bague.hauteur - 0.004, 0]} castShadow>
        <meshPhysicalMaterial
          name="laque-verte"
          color="#245039"
          metalness={0}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.04}
          envMapIntensity={reflets * 1.8}
        />
      </mesh>
    </group>
  );
});
