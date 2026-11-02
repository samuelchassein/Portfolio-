import { FAMILLES } from "./familles";
import { PRIX } from "./produits";
import { SITE, prix } from "./site";

/**
 * Visite 360° : les espaces de la boutique, dans l'ordre du parcours client.
 * `plan` : position sur le plan de la boutique (pixels du plan 1270 × 580).
 * Textes destinés au visiteur : rien d'interne (stocks, réassort, merchandising).
 */
export interface EspaceVisite {
  cle: string;
  nom: string;
  plan: [number, number];
  texte: string;
  images: { src: string; alt: string }[];
  details: [string, string][];
  lien?: { href: string; libelle: string };
}

const prixOuDemande = (p: number | null) => (p === null ? "sur demande" : prix(p));

export const ESPACES_VISITE: EspaceVisite[] = [
  {
    cle: "vitrine",
    nom: "La vitrine",
    plan: [120, 205],
    texte: "Depuis la rue, une seule mise en scène sur des socles de travertin : un flacon, une bougie et la lumière.",
    images: [
      { src: "/images/visite/facade.jpg", alt: "La façade en pierre de la boutique, vitrine éclairée et grandes baies vitrées." },
      { src: "/images/visite/vitrine.jpg", alt: "La vitrine : un flacon et une bougie sur des blocs de travertin, entre des branches d’olivier." },
    ],
    details: [
      ["À voir", "flacon et bougie de la maison"],
      ["Matières", "travertin, laiton, olivier"],
    ],
    lien: { href: "/contact", libelle: "Nous trouver" },
  },
  {
    cle: "decouverte",
    nom: "L’espace découverte",
    plan: [470, 295],
    texte: "L’îlot central en travertin et laiton. On en fait le tour, on sent, on teste, on prend en main librement.",
    images: [
      { src: "/images/visite/ilot.jpg", alt: "L’îlot central en travertin sur pieds en laiton, garni de bougies, de flacons et de coffrets." },
      { src: "/images/visite/interieur.jpg", alt: "Vue large de la boutique : l’îlot au centre, le comptoir et les étagères éclairées." },
    ],
    details: [
      ["Bougie parfumée", prix(PRIX.bougie)],
      ["Format voyage 10 ml", prix(PRIX.voyage)],
      ["Coffret cadeau", prixOuDemande(PRIX.coffret)],
    ],
    lien: { href: "/boutique", libelle: "Voir la boutique" },
  },
  {
    cle: "mur",
    nom: "Le mur des familles",
    plan: [430, 95],
    texte: "La gamme rangée par famille olfactive, un module par famille, dans une lumière chaude.",
    images: [{ src: "/images/mur-familles-haut.jpg", alt: "Le mur des familles olfactives : étagères éclairées, flacons, bougies et diffuseurs." }],
    details: [
      ["Familles", FAMILLES.map((f) => f.nom).join(", ")],
      ["Recharge 50 ml", prix(PRIX.recharge)],
    ],
    lien: { href: "/diagnostic", libelle: "Trouver ma famille" },
  },
  {
    cle: "atelier",
    nom: "L’atelier olfactif",
    plan: [1000, 215],
    texte: `Le rendez-vous individuel de ${SITE.atelier.dureeMin} à ${SITE.atelier.dureeMax} minutes, derrière des parois vitrées : on y compose son parfum avec un conseiller.`,
    images: [{ src: "/images/visite/atelier.jpg", alt: "L’atelier olfactif derrière ses parois vitrées : table en travertin, fauteuils et suspensions en laiton." }],
    details: [
      [`Atelier Signature, parfum ${SITE.atelier.contenance}`, prix(PRIX.atelier)],
      ["Avec une bougie", prix(PRIX.atelier + PRIX.bougieAvecAtelier)],
    ],
    lien: { href: "/atelier#reserver", libelle: "Réserver l’atelier" },
  },
  {
    cle: "accueil",
    nom: "L’accueil",
    plan: [875, 430],
    texte: "Le comptoir en travertin : conseil, gravure de votre flacon et cartes cadeaux.",
    images: [{ src: "/images/visite/caisse.jpg", alt: "Le comptoir d’accueil incurvé en travertin, avec une lampe en laiton." }],
    details: [
      ["Gravure du flacon", prix(PRIX.gravure)],
      ["Carte cadeau atelier", prix(PRIX.carteCadeauAtelier)],
    ],
    lien: { href: "/carte-cadeau", libelle: "Offrir une carte cadeau" },
  },
];
