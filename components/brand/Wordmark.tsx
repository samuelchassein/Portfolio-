import { WORDMARK } from "./wordmark-paths";

export type TeinteWordmark = "encre" | "ivoire" | "dore" | "vert";

const TEINTES: Record<TeinteWordmark, string> = {
  encre: "var(--encre)",
  ivoire: "var(--ivoire-clair)",
  dore: "var(--dore)",
  vert: "var(--vert-profond)",
};

/**
 * Wordmark Maison Sensa en tracés vectoriels (« MAISON » en Jost espacé,
 * « SENSA » en Cormorant Garamond). Jamais l'image du logo.
 * La taille se règle par la largeur (className ou style) : la hauteur suit.
 */
export function Wordmark({
  teinte = "encre",
  className,
  titre = "Maison Sensa",
  decoratif = false,
  style,
}: {
  teinte?: TeinteWordmark;
  className?: string;
  /** Nom accessible ; ignoré si `decoratif`. */
  titre?: string;
  /** Vrai quand le nom est déjà donné à côté (lien, titre de page). */
  decoratif?: boolean;
  style?: React.CSSProperties;
}) {
  const marge = 2;
  return (
    <svg
      viewBox={`${-marge} ${-marge} ${WORDMARK.largeur + marge * 2} ${WORDMARK.hauteur + marge * 2}`}
      className={className}
      style={{ color: TEINTES[teinte], ...style }}
      fill="currentColor"
      role={decoratif ? undefined : "img"}
      aria-hidden={decoratif || undefined}
      aria-label={decoratif ? undefined : titre}
      focusable="false"
    >
      <path d={WORDMARK.maison} data-mot="maison" />
      <path d={WORDMARK.sensa} data-mot="sensa" />
    </svg>
  );
}
