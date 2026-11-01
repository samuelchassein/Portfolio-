/**
 * Informations pratiques de Maison Sensa — un seul endroit à modifier.
 * Les valeurs entre crochets ou « à renseigner » sont des EXEMPLES à remplacer
 * avant la mise en ligne (liste dans le README, « À compléter avant mise en ligne »).
 */
export const SITE = {
  nom: "Maison Sensa",
  signature: "Votre identité, votre signature olfactive.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.maison-sensa.fr",

  adresse: {
    rue: "Adresse à renseigner",
    codePostal: "92100",
    ville: "Boulogne-Billancourt",
    pays: "France",
    /** Lien vers un plan (OpenStreetMap ou autre), à renseigner avec l'adresse réelle. */
    lienPlan: "https://www.openstreetmap.org/search?query=Boulogne-Billancourt",
  },
  telephone: "Téléphone à renseigner",
  /** Adresse affichée sur le site (par défaut, l'adresse EmailJS de la boutique). */
  email: process.env.NEXT_PUBLIC_MAISON_SENSA_EMAIL || "maison.sensaproject@gmail.com",

  horaires: [
    { jours: "Mardi au samedi", heures: "Horaires à renseigner" },
    { jours: "Dimanche et lundi", heures: "Fermé (à confirmer)" },
  ],

  reseaux: [
    { nom: "Instagram", url: "https://www.instagram.com/" },
    { nom: "Facebook", url: "https://www.facebook.com/" },
  ],

  atelier: {
    prix: 149,
    dureeMin: 45,
    dureeMax: 60,
    contenance: "50 ml",
    /** Délai de remise du parfum créé en atelier. */
    delaiRemise: "précisé lors de votre réservation",
    /** Créneaux proposés à la réservation (jours : 0 = dimanche … 6 = samedi). */
    jours: [2, 3, 4, 5, 6],
    creneaux: ["10:00", "11:30", "14:30", "16:00", "17:30"],
    /** Nombre de semaines ouvertes à la réservation. */
    semainesOuvertes: 8,
  },

  /** Frais de livraison en euros. null = « communiqués avant l'expédition » (à définir). */
  fraisLivraison: null as number | null,

  legal: {
    raisonSociale: "[À COMPLÉTER : raison sociale]",
    formeJuridique: "[À COMPLÉTER : forme juridique et capital]",
    siren: "[À COMPLÉTER : SIREN]",
    rcs: "[À COMPLÉTER : RCS]",
    tva: "[À COMPLÉTER : n° de TVA intracommunautaire]",
    directeurPublication: "[À COMPLÉTER : directeur ou directrice de la publication]",
    hebergeur: "[À COMPLÉTER : hébergeur (nom, adresse, téléphone)]",
  },
} as const;

export const NAVIGATION = [
  { href: "/maison", libelle: "La Maison" },
  { href: "/atelier", libelle: "L’Atelier" },
  { href: "/diagnostic", libelle: "Diagnostic" },
  { href: "/boutique", libelle: "Boutique" },
  { href: "/visite", libelle: "Visite 360°" },
  { href: "/carte-cadeau", libelle: "Carte cadeau" },
] as const;

export const adresseComplete = () =>
  `${SITE.adresse.rue}, ${SITE.adresse.codePostal} ${SITE.adresse.ville}`;

/** Prix au format français : « 149 € ». */
export const prix = (euros: number) =>
  `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2, minimumFractionDigits: euros % 1 ? 2 : 0 }).format(euros)} €`;
