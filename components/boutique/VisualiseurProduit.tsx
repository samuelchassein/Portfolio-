"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Modele3D } from "@/content/produits";
import type { CommandeClavier } from "@/components/three/Visualiseur3D";
import { Picto } from "@/components/brand/Pictos";

const Visualiseur3D = dynamic(() => import("@/components/three/Visualiseur3D"), { ssr: false });

const NB_VUES = 36;

function webgl() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Visualiseur 360° d'un produit.
 * - 3D interactive (rotation au doigt ou à la souris, zoom limité, gravure
 *   prévisualisée sur l'étiquette du flacon) quand WebGL est disponible ;
 * - sinon, séquence de 36 rendus Blender que l'on fait défiler au glisser.
 * Clavier : flèches gauche/droite pour tourner, + / − pour zoomer.
 * La 3D n'est chargée qu'à l'activation (bouton « Voir en 360° »).
 */
export function VisualiseurProduit({ modele, visuel, nom, gravure }: { modele: Modele3D; visuel: string; nom: string; gravure?: string }) {
  const [actif, setActif] = useState(false);
  const [mode, setMode] = useState<"3d" | "sequence">("sequence");
  const [mobile, setMobile] = useState(false);
  const commande = useRef<CommandeClavier>({ tourner: 0, zoom: 0 });
  const [vue, setVue] = useState(0);
  const glisse = useRef<{ x: number; vue: number } | null>(null);

  useEffect(() => {
    setMobile(window.matchMedia("(max-width: 767px)").matches);
    setMode(webgl() ? "3d" : "sequence");
  }, []);

  // Une gravure saisie active directement la 3D pour la prévisualiser.
  useEffect(() => {
    if (gravure && modele === "flacon") setActif(true);
  }, [gravure, modele]);

  const clavier = (e: React.KeyboardEvent) => {
    const pas = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
    if (pas) {
      e.preventDefault();
      if (mode === "3d") commande.current.tourner += pas * (Math.PI / 12);
      else setVue((v) => (v + pas + NB_VUES) % NB_VUES);
    }
    if (mode === "3d" && (e.key === "+" || e.key === "-")) {
      e.preventDefault();
      commande.current.zoom += e.key === "+" ? 0.12 : -0.12;
    }
  };

  const dossier = modele;
  const src360 = (i: number) => `/renders/360/${dossier}/${String(i).padStart(2, "0")}.webp`;

  return (
    <div className="relative">
      <div
        role="img"
        aria-roledescription="visualiseur 360°"
        aria-label={`${nom} en 360°. ${actif ? "Utilisez les flèches gauche et droite pour faire tourner le produit" + (mode === "3d" ? ", plus et moins pour zoomer." : ".") : ""}`}
        tabIndex={actif ? 0 : -1}
        onKeyDown={clavier}
        className="relative aspect-[4/5] w-full overflow-hidden bg-ivoire-clair outline-none focus-visible:ring-2 focus-visible:ring-dore"
      >
        {!actif && (
          <Image src={`/renders/${visuel}.webp`} alt="" fill priority sizes="(min-width: 1024px) 46vw, 100vw" className="object-contain p-[6%]" />
        )}
        {actif && mode === "3d" && <Visualiseur3D modele={modele} gravure={gravure} commande={commande} mobile={mobile} />}
        {actif && mode === "sequence" && (
          <div
            className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
            onPointerDown={(e) => {
              glisse.current = { x: e.clientX, vue };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!glisse.current) return;
              const d = Math.round((e.clientX - glisse.current.x) / 14);
              setVue((((glisse.current.vue - d) % NB_VUES) + NB_VUES) % NB_VUES);
            }}
            onPointerUp={() => (glisse.current = null)}
          >
            {/* Toutes les vues sont empilées (préchargées), une seule est visible. */}
            {Array.from({ length: NB_VUES }).map((_, i) => (
              <Image key={i} src={src360(i)} alt="" fill sizes="(min-width: 1024px) 46vw, 100vw" className={`object-contain p-[4%] ${i === vue ? "opacity-100" : "opacity-0"}`} />
            ))}
          </div>
        )}
      </div>
      {!actif ? (
        <button
          type="button"
          onClick={() => setActif(true)}
          className="absolute bottom-5 left-1/2 inline-flex min-h-12 -translate-x-1/2 cursor-pointer items-center gap-3 rounded-full border border-dore bg-ivoire-clair/90 px-6 text-[0.75rem] uppercase tracking-[0.22em] backdrop-blur-sm hover:bg-ivoire-clair"
        >
          <Picto nom="rotation" taille={22} className="text-dore" />
          Voir en 360°
        </button>
      ) : (
        <p className="mt-3 text-center text-sm text-encre-douce">Faites glisser pour tourner{mode === "3d" ? ", pincez ou utilisez la molette pour zoomer" : ""}.</p>
      )}
    </div>
  );
}
