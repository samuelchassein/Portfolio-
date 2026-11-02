import type { CleFamille } from "./familles";

/**
 * Diagnostic olfactif en ligne, transposé de supports/fiche-diagnostic-olfactif.jpg
 * et de la fiche de reference/outils-vente-communication.md.
 * Aucune donnée de santé n'est demandée. Le résultat est une piste à explorer
 * avec un conseiller, jamais la promesse d'un parfum précis.
 */
export interface ChoixEvocation {
  libelle: string;
  famille: CleFamille;
}

export const QUESTIONS_EVOCATION: { id: string; question: string; choix: ChoixEvocation[] }[] = [
  {
    id: "dimanche",
    question: "Un dimanche idéal ?",
    choix: [
      { libelle: "Un marché au petit matin, des herbes fraîches plein le panier", famille: "frais" },
      { libelle: "Un bouquet sur la table, la fenêtre ouverte sur le jardin", famille: "floral" },
      { libelle: "Une longue marche en forêt, l’odeur de la terre après la pluie", famille: "boise" },
      { libelle: "Un livre près du feu, un thé épicé à portée de main", famille: "ambre" },
    ],
  },
  {
    id: "matiere",
    question: "Une matière ?",
    choix: [
      { libelle: "Le lin, léger et frais", famille: "frais" },
      { libelle: "La soie, douce et lumineuse", famille: "floral" },
      { libelle: "Le bois brut, chaud sous la main", famille: "boise" },
      { libelle: "Le cachemire, enveloppant", famille: "ambre" },
    ],
  },
  {
    id: "moment",
    question: "Un moment de la journée ?",
    choix: [
      { libelle: "Le matin, quand tout s’éveille", famille: "frais" },
      { libelle: "Le début d’après-midi, en pleine lumière", famille: "floral" },
      { libelle: "La fin d’après-midi, quand la lumière devient oblique", famille: "boise" },
      { libelle: "Le soir, à la lueur d’une bougie", famille: "ambre" },
    ],
  },
];

/** Senteurs à choisir (favorites ou à éviter) et famille vers laquelle elles orientent. */
export const SENTEURS: { nom: string; famille?: CleFamille }[] = [
  { nom: "Agrumes", famille: "frais" },
  { nom: "Bergamote", famille: "frais" },
  { nom: "Menthe", famille: "frais" },
  { nom: "Notes vertes", famille: "frais" },
  { nom: "Rose", famille: "floral" },
  { nom: "Jasmin", famille: "floral" },
  { nom: "Iris", famille: "floral" },
  { nom: "Fleur d’oranger", famille: "floral" },
  { nom: "Cèdre", famille: "boise" },
  { nom: "Santal", famille: "boise" },
  { nom: "Vétiver", famille: "boise" },
  { nom: "Cuir", famille: "boise" },
  { nom: "Vanille", famille: "ambre" },
  { nom: "Ambre", famille: "ambre" },
  { nom: "Épices douces", famille: "ambre" },
  { nom: "Musc" },
];

export const TEXTES_RESULTAT: Record<CleFamille, string> = {
  frais: "Vous aimez la clarté et l’élan : des notes vives, des agrumes, une verdure qui réveille. Une signature lumineuse, qui accompagne le mouvement.",
  floral: "Vous êtes sensible à la douceur et à l’élégance : fleurs blanches, rose, une touche poudrée. Une signature délicate, qui reste près de la peau.",
  boise: "Vous recherchez la profondeur et le calme : cèdre, santal, vétiver. Une signature posée, chaleureuse et naturelle.",
  ambre: "Vous aimez ce qui enveloppe : vanille, résines, épices douces. Une signature chaleureuse, qui laisse un sillage tendre.",
};
