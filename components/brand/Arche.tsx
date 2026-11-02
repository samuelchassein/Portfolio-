import type { ReactNode } from "react";

/**
 * Masque en arche (niches du mur des familles, étagères de la boutique).
 * L'arche est un demi-cercle sur toute la largeur : `rounded-t-full` sur un
 * conteneur au ratio fixe, donc aucun décalage de mise en page au chargement.
 */
export function Arche({
  children,
  ratio = "3 / 4",
  filet = false,
  className = "",
}: {
  children: ReactNode;
  /** Rapport largeur / hauteur du cadre. */
  ratio?: string;
  /** Filet doré qui épouse l'arche, décalé de quelques pixels. */
  filet?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: ratio }}>
      {filet && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-2 rounded-t-full border border-dore/70"
        />
      )}
      <div className="absolute inset-0 overflow-hidden rounded-t-full">{children}</div>
    </div>
  );
}
