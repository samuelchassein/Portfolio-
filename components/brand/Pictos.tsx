/**
 * Pictogrammes au trait doré fin, d'après affiche-atelier-creation.jpg.
 * Trait de 1,25 px à 32 px, extrémités arrondies, aucun remplissage.
 * Décoratifs par défaut (le texte voisin porte le sens).
 */
type Nom =
  | "personnes"
  | "horloge"
  | "flacon"
  | "etiquette"
  | "bougie"
  | "voyage"
  | "coffret"
  | "cadeau"
  | "recharge"
  | "boutique"
  | "calendrier"
  | "lieu"
  | "telephone"
  | "courriel"
  | "panier"
  | "fleche"
  | "rotation";

const TRACES: Record<Nom, React.ReactNode> = {
  personnes: (
    <>
      <circle cx="11.5" cy="10.5" r="3.6" />
      <path d="M4.5 25.5c0-4.3 3.1-7.3 7-7.3s7 3 7 7.3" />
      <circle cx="21.5" cy="11.5" r="3.1" />
      <path d="M19.6 18.6c.6-.2 1.2-.3 1.9-.3 3.4 0 6 2.6 6 6.3" />
    </>
  ),
  horloge: (
    <>
      <circle cx="16" cy="16" r="10.5" />
      <path d="M16 9.5V16l4.2 2.6" />
    </>
  ),
  flacon: (
    <>
      <rect x="13" y="4.5" width="6" height="4.2" rx=".8" />
      <path d="M14 8.7v2h4v-2" />
      <rect x="8.5" y="10.7" width="15" height="16.8" rx="2" />
      <rect x="12.4" y="15.5" width="7.2" height="6.4" rx=".4" />
    </>
  ),
  etiquette: (
    <>
      <path d="M17.6 5.5h7.9a1 1 0 0 1 1 1v7.9a1 1 0 0 1-.3.7L14.4 26.9a1 1 0 0 1-1.4 0L5.1 19a1 1 0 0 1 0-1.4L16.9 5.8a1 1 0 0 1 .7-.3Z" />
      <circle cx="21.6" cy="10.4" r="1.6" />
    </>
  ),
  bougie: (
    <>
      <path d="M16 6.5c1.6 1.8 1.9 3.4 0 4.8-1.9-1.4-1.6-3 0-4.8Z" />
      <path d="M16 11.3v2.4" />
      <path d="M8.5 13.7h15v12.3a1.5 1.5 0 0 1-1.5 1.5H10a1.5 1.5 0 0 1-1.5-1.5Z" />
      <path d="M8.5 16.5h15" />
    </>
  ),
  voyage: (
    <>
      <rect x="12.5" y="4.5" width="7" height="23" rx="2" />
      <path d="M12.5 11h7M12.5 12.8h7" />
    </>
  ),
  coffret: (
    <>
      <path d="M5.5 11.5h21v15h-21z" />
      <path d="M4.5 7.5h23v4h-23z" />
      <path d="M13 17.5h6" />
    </>
  ),
  cadeau: (
    <>
      <rect x="5.5" y="12" width="21" height="14.5" rx=".5" />
      <path d="M4.5 8.5h23V12h-23zM16 8.5v18" />
      <path d="M16 8.5c-1.5-3.6-6-4.4-6-1.5 0 1.4 2.6 1.5 6 1.5Zm0 0c1.5-3.6 6-4.4 6-1.5 0 1.4-2.6 1.5-6 1.5Z" />
    </>
  ),
  recharge: (
    <>
      <path d="M24.8 13A9.5 9.5 0 0 0 7.3 11" />
      <path d="M7 5.8V11h5.2" />
      <path d="M7.2 19a9.5 9.5 0 0 0 17.5 2" />
      <path d="M25 26.2V21h-5.2" />
    </>
  ),
  boutique: (
    <>
      <path d="M5 12.5 7 6.5h18l2 6" />
      <path d="M5 12.5c0 1.9 1.6 3 3.3 3s3.3-1.1 3.3-3c0 1.9 1.6 3 3.3 3h2.2c1.7 0 3.3-1.1 3.3-3 0 1.9 1.6 3 3.3 3S27 14.4 27 12.5" />
      <path d="M6.8 15.4v11.1h18.4V15.4M13 26.5v-6.5h6v6.5" />
    </>
  ),
  calendrier: (
    <>
      <rect x="5.5" y="7.5" width="21" height="19" rx="1.5" />
      <path d="M5.5 12.5h21M11 5v5M21 5v5" />
    </>
  ),
  lieu: (
    <>
      <path d="M16 27.5s8.5-7.6 8.5-14.2a8.5 8.5 0 1 0-17 0c0 6.6 8.5 14.2 8.5 14.2Z" />
      <circle cx="16" cy="13.2" r="3" />
    </>
  ),
  telephone: (
    <path d="M9.6 5.5h3.2l1.6 5.2-2.3 1.7a14 14 0 0 0 7.5 7.5l1.7-2.3 5.2 1.6v3.2a2.6 2.6 0 0 1-2.8 2.6C14.1 24.5 7.5 17.9 7 8.3a2.6 2.6 0 0 1 2.6-2.8Z" />
  ),
  courriel: (
    <>
      <rect x="4.5" y="8" width="23" height="16" rx="1.5" />
      <path d="m5 9 11 8.5L27 9" />
    </>
  ),
  panier: (
    <>
      <path d="M7.5 11.5h17l-1.4 14.3a1.5 1.5 0 0 1-1.5 1.4H10.4a1.5 1.5 0 0 1-1.5-1.4Z" />
      <path d="M12 11.5V9.5a4 4 0 0 1 8 0v2" />
    </>
  ),
  fleche: <path d="M5 16h21m-6-6 6 6-6 6" />,
  rotation: (
    <>
      <ellipse cx="16" cy="16" rx="11" ry="4.5" />
      <path d="m24.2 9.6 2.5 3-3.7 1" />
      <path d="M16 6v20" strokeDasharray="1.5 2.5" />
    </>
  ),
};

export type NomPicto = Nom;

export function Picto({
  nom,
  taille = 32,
  className = "",
  titre,
}: {
  nom: Nom;
  taille?: number;
  className?: string;
  /** Si présent, le picto est annoncé (sinon décoratif). */
  titre?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={taille}
      height={taille}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      role={titre ? "img" : undefined}
      aria-label={titre}
      aria-hidden={titre ? undefined : true}
      focusable="false"
      vectorEffect="non-scaling-stroke"
    >
      {TRACES[nom]}
    </svg>
  );
}
