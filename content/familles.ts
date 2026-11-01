/**
 * Les quatre familles olfactives de Maison Sensa (n'en ajoutez pas d'autres).
 * Couleurs : ambiance de fond de la scène du flacon et teinte légère du jus.
 */
export type CleFamille = "frais" | "floral" | "boise" | "ambre";

export interface Famille {
  cle: CleFamille;
  nom: string;
  univers: string;
  notes: [string, string, string];
  evocation: string;
  /** Dégradé d'ambiance : du haut vers le bas. */
  ambiance: [string, string];
  /** Couleur du texte sur l'ambiance. */
  encre: string;
  /** Teinte du jus : glisse légèrement depuis le doré d'origine. */
  jus: string;
  /** Lumière de la scène 3D. */
  lumiere: string;
}

export const FAMILLES: Famille[] = [
  {
    cle: "frais",
    nom: "Frais",
    univers: "Agrumes, notes vertes, eaux, aromatiques",
    notes: ["Bergamote", "Feuille de figuier", "Menthe poivrée"],
    evocation: "La lumière du matin sur un jardin encore humide.",
    ambiance: ["#EEF0DC", "#D9E2C2"],
    encre: "#1F3A2E",
    jus: "#D8B24E",
    lumiere: "#FFF4D6",
  },
  {
    cle: "floral",
    nom: "Floral",
    univers: "Fleurs blanches, rose, jasmin, poudré",
    notes: ["Jasmin", "Rose", "Iris poudré"],
    evocation: "Un bouquet de fleurs blanches posé près d’une fenêtre.",
    ambiance: ["#F8EEE6", "#EFDCD2"],
    encre: "#3A2A24",
    jus: "#DDAE58",
    lumiere: "#FFEDE2",
  },
  {
    cle: "boise",
    nom: "Boisé",
    univers: "Cèdre, santal, vétiver, mousses",
    notes: ["Cèdre", "Santal", "Vétiver"],
    evocation: "Un sous-bois à l’heure où la lumière devient oblique.",
    ambiance: ["#E3DACA", "#B9A88C"],
    encre: "#1F3A2E",
    jus: "#D29B45",
    lumiere: "#FFE2BC",
  },
  {
    cle: "ambre",
    nom: "Ambré",
    univers: "Résines, vanille, épices douces",
    notes: ["Vanille", "Benjoin", "Cardamome"],
    evocation: "La chaleur dorée d’une fin d’après-midi.",
    ambiance: ["#F2DFBF", "#DDB97E"],
    encre: "#3A2414",
    jus: "#CF8F3A",
    lumiere: "#FFD49A",
  },
];

export const familleParCle = (cle: CleFamille) => FAMILLES.find((f) => f.cle === cle)!;
