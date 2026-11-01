"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Lumière de la boutique : fin d'après-midi chaude, grandes softboxes
 * latérales, contre-jour qui dessine les arêtes du verre. Pas de HDRI externe :
 * tout est généré (drei Lightformer), donc déterministe et léger.
 *
 * `chaleur` (0–1) teinte les sources ; `ambiance` colore l'environnement pour
 * accorder la lumière aux familles olfactives.
 */
export function StudioLumiere({
  intensite = 1,
  ambiance = "#3a2416",
  cle = "#FFE3B8",
  resolution = 512,
}: {
  intensite?: number;
  ambiance?: string;
  cle?: string;
  resolution?: number;
}) {
  return (
    <Environment resolution={resolution} frames={1} background={false}>
      <color attach="background" args={[ambiance]} />
      {/* Softbox principale, à gauche, haute et allongée (reflets verticaux du bouchon) */}
      <Lightformer form="rect" color={cle} intensity={2.4 * intensite} position={[-3, 1.5, 2.2]} rotation-y={Math.PI / 3.2} scale={[1.1, 5, 1]} />
      {/* Softbox de droite, plus douce */}
      <Lightformer form="rect" color="#FFEBD0" intensity={1.5 * intensite} position={[3.2, 1.2, 1.6]} rotation-y={-Math.PI / 2.8} scale={[0.9, 4.5, 1]} />
      {/* Contre-jours fins pour les arêtes verticales */}
      <Lightformer form="rect" color="#FFF4E0" intensity={4.5 * intensite} position={[-1.6, 1, -2.5]} rotation-y={Math.PI * 0.85} scale={[0.25, 5, 1]} />
      <Lightformer form="rect" color="#FFF4E0" intensity={4.5 * intensite} position={[1.6, 1, -2.5]} rotation-y={-Math.PI * 0.85} scale={[0.25, 5, 1]} />
      {/* Plafonnier chaud, pour l'épaule et le dessus du bouchon */}
      <Lightformer form="circle" color="#FFD9A0" intensity={1.6 * intensite} position={[0, 5, 0.5]} rotation-x={Math.PI / 2} scale={3} />
      {/* Sol clair (travertin) qui remonte dans le fond du verre */}
      <Lightformer form="rect" color="#E9DCC6" intensity={1.2 * intensite} position={[0, -2, 0]} rotation-x={-Math.PI / 2} scale={[8, 8, 1]} />
      {/* Bande frontale fine : reflet vertical sur la face avant */}
      <Lightformer form="rect" color="#ffffff" intensity={0.9 * intensite} position={[0.9, 1, 4]} scale={[0.15, 4, 1]} />
    </Environment>
  );
}
