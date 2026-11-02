import type { Metadata } from "next";
import { VisiteImmersive } from "@/components/visite/VisiteImmersive";

export const metadata: Metadata = {
  title: "Visite 360°",
  description: "Visitez la boutique Maison Sensa en 360° : la vitrine, l’espace découverte, le mur des familles, l’atelier olfactif et l’accueil.",
};

/** Visite 360° : maquette 3D de la boutique (repli en images sans WebGL). */
export default function PageVisite() {
  return <VisiteImmersive />;
}
