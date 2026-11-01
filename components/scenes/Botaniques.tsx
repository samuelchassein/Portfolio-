import type { CleFamille } from "@/content/familles";

/**
 * Éléments botaniques dessinés en SVG pour chaque famille olfactive :
 * zestes et feuilles (frais), pétales blancs (floral), feuilles de chêne et
 * copeaux (boisé), gouttes d'ambre et gousses de vanille (ambré).
 * Dégradés doux, aucune silhouette « clipart ». Chaque élément porte une
 * profondeur (0 = loin et flou, 1 = proche et net) utilisée pour la parallaxe.
 */

export type Forme = "zeste" | "feuille" | "petale" | "chene" | "copeau" | "goutte" | "vanille" | "brin";

export interface Element {
  forme: Forme;
  x: number; // % de la largeur
  y: number; // % de la hauteur
  taille: number; // rem
  rotation: number;
  profondeur: number;
}

export const BOTANIQUES: Record<CleFamille, Element[]> = {
  frais: [
    { forme: "zeste", x: 14, y: 22, taille: 7, rotation: -20, profondeur: 0.9 },
    { forme: "feuille", x: 78, y: 16, taille: 9, rotation: 35, profondeur: 0.6 },
    { forme: "zeste", x: 84, y: 64, taille: 5, rotation: 60, profondeur: 0.35 },
    { forme: "feuille", x: 22, y: 72, taille: 6.5, rotation: -50, profondeur: 0.75 },
    { forme: "brin", x: 66, y: 82, taille: 8, rotation: 15, profondeur: 0.2 },
    { forme: "feuille", x: 6, y: 48, taille: 5, rotation: 80, profondeur: 0.25 },
    { forme: "zeste", x: 58, y: 8, taille: 4, rotation: 120, profondeur: 0.15 },
  ],
  floral: [
    { forme: "petale", x: 16, y: 18, taille: 6, rotation: -30, profondeur: 0.85 },
    { forme: "petale", x: 82, y: 24, taille: 7.5, rotation: 50, profondeur: 0.6 },
    { forme: "petale", x: 74, y: 70, taille: 5, rotation: 140, profondeur: 0.35 },
    { forme: "petale", x: 20, y: 66, taille: 8, rotation: 10, profondeur: 0.95 },
    { forme: "petale", x: 8, y: 42, taille: 4, rotation: -80, profondeur: 0.2 },
    { forme: "brin", x: 88, y: 46, taille: 7, rotation: -25, profondeur: 0.3 },
    { forme: "petale", x: 56, y: 10, taille: 3.5, rotation: 95, profondeur: 0.15 },
  ],
  boise: [
    { forme: "chene", x: 14, y: 20, taille: 9, rotation: -25, profondeur: 0.8 },
    { forme: "copeau", x: 80, y: 18, taille: 6.5, rotation: 30, profondeur: 0.55 },
    { forme: "chene", x: 84, y: 66, taille: 7, rotation: 110, profondeur: 0.4 },
    { forme: "copeau", x: 18, y: 72, taille: 7.5, rotation: -60, profondeur: 0.9 },
    { forme: "copeau", x: 60, y: 86, taille: 4.5, rotation: 20, profondeur: 0.2 },
    { forme: "chene", x: 6, y: 46, taille: 5, rotation: 70, profondeur: 0.25 },
  ],
  ambre: [
    { forme: "goutte", x: 16, y: 24, taille: 4.5, rotation: -10, profondeur: 0.9 },
    { forme: "vanille", x: 80, y: 20, taille: 11, rotation: 38, profondeur: 0.6 },
    { forme: "goutte", x: 82, y: 66, taille: 3.5, rotation: 20, profondeur: 0.4 },
    { forme: "vanille", x: 18, y: 70, taille: 9, rotation: -32, profondeur: 0.8 },
    { forme: "goutte", x: 62, y: 86, taille: 2.6, rotation: 0, profondeur: 0.2 },
    { forme: "goutte", x: 8, y: 46, taille: 2.4, rotation: 0, profondeur: 0.25 },
    { forme: "goutte", x: 54, y: 9, taille: 2.2, rotation: 0, profondeur: 0.15 },
  ],
};

/** Contour lobé d'une feuille de chêne (5 lobes arrondis de chaque côté). */
const CHENE = (() => {
  const lobes = 5;
  const pts: string[] = ["M50 96"];
  const cote = (s: 1 | -1) => {
    const seg: string[] = [];
    for (let i = 0; i < lobes; i++) {
      const y0 = 88 - i * 16;
      const y1 = y0 - 16;
      const ampl = 16 + Math.sin(((i + 0.5) / lobes) * Math.PI) * 18;
      seg.push(`C${50 + s * ampl * 0.35} ${y0 - 2} ${50 + s * ampl} ${y0 - 4} ${50 + s * ampl} ${y0 - 9}`);
      seg.push(`C${50 + s * ampl} ${y1 + 2} ${50 + s * 7} ${y1 + 3} ${50 + s * 6} ${y1}`);
    }
    return seg;
  };
  pts.push(...cote(1));
  pts.push("C54 4 46 4 44 8");
  // Côté gauche : symétrique, retracé du haut vers le bas.
  const gauche: string[] = [];
  for (let i = lobes - 1; i >= 0; i--) {
    const y0 = 88 - i * 16;
    const y1 = y0 - 16;
    const ampl = 16 + Math.sin(((i + 0.5) / lobes) * Math.PI) * 18;
    gauche.push(`C${50 - 7} ${y1 + 3} ${50 - ampl} ${y1 + 2} ${50 - ampl} ${y0 - 9}`);
    gauche.push(`C${50 - ampl} ${y0 - 4} ${50 - ampl * 0.35} ${y0 - 2} ${50 - 4} ${y0}`);
  }
  pts.push(...gauche, "Z");
  return pts.join(" ");
})();

export function DessinBotanique({ forme }: { forme: Forme }) {
  switch (forme) {
    case "zeste":
      return (
        <svg viewBox="0 0 100 100">
          <defs>
            <radialGradient id="g-zeste" cx="40%" cy="35%" r="70%">
              <stop offset="0" stopColor="#F7E9A6" />
              <stop offset=".7" stopColor="#E9C95A" />
              <stop offset="1" stopColor="#C99A2E" />
            </radialGradient>
          </defs>
          <path d="M8 62C14 30 46 12 78 20c6 2 8 8 3 11C60 40 38 52 22 74c-4 6-15 2-14-12Z" fill="url(#g-zeste)" />
          <path d="M14 63C22 40 44 26 72 25" stroke="#FFF6CF" strokeWidth="2.2" fill="none" opacity=".7" strokeLinecap="round" />
        </svg>
      );
    case "feuille":
      return (
        <svg viewBox="0 0 100 100">
          <defs>
            <linearGradient id="g-feuille" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#9DB57C" />
              <stop offset="1" stopColor="#4E6B45" />
            </linearGradient>
          </defs>
          <path d="M10 88C14 46 46 14 92 10 86 54 56 86 10 88Z" fill="url(#g-feuille)" />
          <path d="M12 86C38 62 62 38 90 12" stroke="#E7EDD2" strokeWidth="1.4" fill="none" opacity=".75" />
        </svg>
      );
    case "brin":
      return (
        <svg viewBox="0 0 100 100" fill="none">
          <path d="M50 96C48 70 52 40 60 6" stroke="#5E7350" strokeWidth="1.6" />
          {[18, 32, 46, 60, 74].map((y, i) => (
            <path
              key={y}
              d={i % 2 ? `M${55 - y / 30} ${y}c10-6 20-6 26 0-8 6-18 6-26 0Z` : `M${53 - y / 30} ${y}c-10-6-20-6-26 0 8 6 18 6 26 0Z`}
              fill={i % 2 ? "#7F9667" : "#93A97A"}
            />
          ))}
        </svg>
      );
    case "petale":
      return (
        <svg viewBox="0 0 100 100">
          <defs>
            <radialGradient id="g-petale" cx="35%" cy="30%" r="80%">
              <stop offset="0" stopColor="#FFFDF8" />
              <stop offset=".65" stopColor="#F6EBDF" />
              <stop offset="1" stopColor="#E3CDBE" />
            </radialGradient>
          </defs>
          <path d="M50 6C78 18 92 48 76 74 66 92 34 92 24 74 8 48 22 18 50 6Z" fill="url(#g-petale)" />
          <path d="M50 14C48 40 48 64 50 86" stroke="#E9D8C8" strokeWidth="1.2" fill="none" />
        </svg>
      );
    case "chene":
      return (
        <svg viewBox="0 0 100 100">
          <defs>
            <linearGradient id="g-chene" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#8C8556" />
              <stop offset="1" stopColor="#4F5A3A" />
            </linearGradient>
          </defs>
          <path d={CHENE} fill="url(#g-chene)" />
          <path d="M50 96V10M50 70l14-8M50 54l-14-8M50 38l12-8" stroke="#C9C1A0" strokeWidth="1" fill="none" opacity=".7" />

        </svg>
      );
    case "copeau":
      return (
        <svg viewBox="0 0 100 100" fill="none">
          <defs>
            <linearGradient id="g-copeau" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#C89A6A" />
              <stop offset=".5" stopColor="#E7C9A2" />
              <stop offset="1" stopColor="#9E6D42" />
            </linearGradient>
          </defs>
          <path d="M12 70C20 30 70 18 84 40c10 16-6 34-24 30-16-4-14-24 0-24" stroke="url(#g-copeau)" strokeWidth="9" strokeLinecap="round" />
        </svg>
      );
    case "goutte":
      return (
        <svg viewBox="0 0 100 100">
          <defs>
            <radialGradient id="g-goutte" cx="38%" cy="58%" r="60%">
              <stop offset="0" stopColor="#FCE2A2" />
              <stop offset=".55" stopColor="#E0A443" />
              <stop offset="1" stopColor="#A9661F" />
            </radialGradient>
          </defs>
          <path d="M50 6C62 30 80 46 80 66a30 30 0 0 1-60 0C20 46 38 30 50 6Z" fill="url(#g-goutte)" />
          <ellipse cx="40" cy="58" rx="6" ry="10" fill="#FFF3D2" opacity=".6" />
        </svg>
      );
    case "vanille":
      return (
        <svg viewBox="0 0 100 100" fill="none">
          <path d="M18 88C34 64 58 34 86 10" stroke="#3B2618" strokeWidth="6.5" strokeLinecap="round" />
          <path d="M24 86C40 62 62 34 88 12" stroke="#6B4529" strokeWidth="2" strokeLinecap="round" opacity=".8" />
          <path d="M82 12c4-4 8-4 10-2" stroke="#3B2618" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}

/** Couche d'éléments d'une famille. Les positions bougent avec `decalage` (−1…1). */
export function CoucheBotanique({ famille, mobile = false }: { famille: CleFamille; mobile?: boolean }) {
  const elements = mobile ? BOTANIQUES[famille].filter((e) => e.profondeur >= 0.55) : BOTANIQUES[famille];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {elements.map((e, i) => (
        <div
          key={i}
          data-botanique
          data-profondeur={e.profondeur}
          className="absolute will-change-transform"
          style={{
            left: `${e.x}%`,
            top: `${e.y}%`,
            width: `${e.taille * (mobile ? 0.6 : 1)}rem`,
            height: `${e.taille * (mobile ? 0.6 : 1)}rem`,
            transform: `translate(-50%, -50%) rotate(${e.rotation}deg)`,
            filter: `blur(${((1 - e.profondeur) * 5).toFixed(1)}px)`,
            opacity: 0.55 + e.profondeur * 0.45,
            zIndex: e.profondeur > 0.7 ? 3 : 1,
          }}
        >
          <DessinBotanique forme={e.forme} />
        </div>
      ))}
    </div>
  );
}
