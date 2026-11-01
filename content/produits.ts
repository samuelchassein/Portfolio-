import type { CleFamille } from "./familles";

/**
 * Catalogue Maison Sensa. Prix TTC en euros.
 * `visuel` : rendu Blender dans public/renders (sans extension) ;
 * `galerie` : photos recadrées complémentaires (public/images).
 */
export type TypeProduit = "atelier" | "bougie" | "voyage" | "recharge" | "coffret" | "carte-cadeau";
export type Modele3D = "flacon" | "bougie" | "format-voyage" | "coffret";

export interface Produit {
  slug: string;
  type: TypeProduit;
  nom: string;
  accroche: string;
  description: string;
  contenance?: string;
  /** null = « Sur demande en boutique ». */
  prix: number | null;
  famille?: CleFamille;
  gravure?: boolean;
  modele?: Modele3D;
  visuel: string;
  galerie?: { src: string; alt: string }[];
  /** Champ obligatoire supplémentaire (recharge). */
  referenceRequise?: boolean;
}

export const PRIX = {
  atelier: 149,
  bougie: 59,
  bougieAvecAtelier: 45,
  voyage: 29,
  recharge: 89,
  gravure: 15,
  carteCadeauAtelier: 149,
  /** Prix du coffret cadeau : à définir. Laisser null pour afficher « Sur demande en boutique ». */
  coffret: null as number | null,
} as const;

const NOMS_BOUGIES: Record<CleFamille, { nom: string; evocation: string }> = {
  frais: { nom: "Bougie Frais", evocation: "Zestes, feuillages et fraîcheur verte." },
  floral: { nom: "Bougie Floral", evocation: "Fleurs blanches et douceur poudrée." },
  boise: { nom: "Bougie Boisé", evocation: "Cèdre, santal et sous-bois." },
  ambre: { nom: "Bougie Ambré", evocation: "Vanille, résines et épices douces." },
};

export const PRODUITS: Produit[] = [
  {
    slug: "atelier-signature",
    type: "atelier",
    nom: "Atelier Signature",
    accroche: "Créez votre signature olfactive.",
    description:
      "Un rendez-vous individuel avec un conseiller pour composer votre parfum selon vos goûts, parmi nos accords. Vous repartez avec votre flacon de 50 ml et une référence conservée pour vos recharges.",
    contenance: "45 à 60 minutes · parfum 50 ml",
    prix: PRIX.atelier,
    gravure: true,
    modele: "flacon",
    visuel: "flacon-trois-quarts-gauche",
    galerie: [{ src: "/images/atelier-conseil-client.jpg", alt: "Une conseillère et un client sentent une mouillette à la table de l’atelier." }],
  },
  ...(Object.keys(NOMS_BOUGIES) as CleFamille[]).map((f) => ({
    slug: `bougie-${f}`,
    type: "bougie" as const,
    nom: NOMS_BOUGIES[f].nom,
    accroche: "Prolongez l’émotion chez vous.",
    description: `Une bougie parfumée de la famille ${NOMS_BOUGIES[f].nom.replace("Bougie ", "").toLowerCase()}. ${NOMS_BOUGIES[f].evocation} Elle appartient à la même famille olfactive que votre parfum, pour prolonger son univers chez vous.`,
    prix: PRIX.bougie,
    famille: f,
    modele: "bougie" as const,
    visuel: "bougie-trois-quarts-gauche",
    galerie: [{ src: "/images/produits/bougie-affiche.jpg", alt: "La bougie parfumée Maison Sensa allumée sur un socle en travertin." }],
  })),
  {
    slug: "format-voyage",
    type: "voyage",
    nom: "Format voyage",
    accroche: "Votre parfum vous accompagne.",
    description: "Un vaporisateur de 10 ml, tube laqué vert et doré, pour emporter votre parfum partout.",
    contenance: "10 ml",
    prix: PRIX.voyage,
    modele: "format-voyage",
    visuel: "format-voyage-trois-quarts-gauche",
    galerie: [{ src: "/images/produits/voyage-affiche.jpg", alt: "Le format voyage Maison Sensa sur un socle en travertin." }],
  },
  {
    slug: "recharge",
    type: "recharge",
    nom: "Recharge 50 ml",
    accroche: "Retrouvez votre signature olfactive.",
    description:
      "La recharge de votre parfum créé en atelier. Indiquez la référence inscrite sur votre flacon : nous la retrouvons dans nos registres.",
    contenance: "50 ml",
    prix: PRIX.recharge,
    gravure: true,
    modele: "flacon",
    visuel: "flacon-face",
    referenceRequise: true,
    galerie: [{ src: "/images/produits/recharge-affiche.jpg", alt: "Le flacon et la recharge Maison Sensa à côté d’un coffret vert." }],
  },
  {
    slug: "coffret-cadeau",
    type: "coffret",
    nom: "Coffret cadeau",
    accroche: "Offrez une signature olfactive.",
    description: "Un coffret vert à marquage doré pour offrir votre création ou une sélection de la maison.",
    prix: PRIX.coffret,
    modele: "coffret",
    visuel: "coffret-trois-quarts-gauche",
  },
  {
    slug: "carte-cadeau",
    type: "carte-cadeau",
    nom: "Carte cadeau",
    accroche: "Un atelier individuel et un parfum de 50 ml.",
    description: "Offrez l’Atelier Signature ou le montant de votre choix, avec un message personnalisé.",
    prix: PRIX.carteCadeauAtelier,
    visuel: "flacon-trois-quarts-droite",
  },
];

export const produitParSlug = (slug: string) => PRODUITS.find((p) => p.slug === slug);
