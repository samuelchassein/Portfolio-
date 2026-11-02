import type { ReactNode } from "react";

/**
 * Signes graphiques récurrents tirés des affiches Maison Sensa :
 * filet doré court, cadre doré fin, surtitre en petites capitales espacées.
 */

/** Filet doré court, centré sous les titres. `long` pour les séparations de section. */
export function Filet({
  long = false,
  aligne = "centre",
  className = "",
}: {
  long?: boolean;
  aligne?: "centre" | "gauche";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`block h-px bg-dore ${long ? "w-24" : "w-12"} ${aligne === "centre" ? "mx-auto" : ""} ${className}`}
    />
  );
}

/** Titre entre deux filets dorés (« Deux espaces, une expérience »). */
export function EntreFilets({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-5 sm:gap-8 ${className}`}>
      <span aria-hidden="true" className="h-px w-10 shrink-0 bg-dore sm:w-20" />
      {children}
      <span aria-hidden="true" className="h-px w-10 shrink-0 bg-dore sm:w-20" />
    </div>
  );
}

/** Petites capitales espacées (« MAISON », surtitres, navigation). */
export function Surtitre({
  children,
  as: Balise = "p",
  ton = "dore",
  className = "",
}: {
  children: ReactNode;
  as?: "p" | "span" | "div";
  ton?: "dore" | "encre" | "ivoire";
  className?: string;
}) {
  const couleur = ton === "dore" ? "text-dore-texte" : ton === "ivoire" ? "text-dore-clair" : "text-encre-douce";
  return (
    <Balise className={`font-sans text-surtitre font-normal uppercase tracking-[0.36em] ${couleur} ${className}`}>
      {children}
    </Balise>
  );
}

/** Cadre doré fin (1 px) pour les encarts premium : carte cadeau, prix de l'atelier. */
export function CadreDore({
  children,
  className = "",
  double = false,
}: {
  children: ReactNode;
  className?: string;
  /** Second filet intérieur, comme sur l'affiche de l'atelier. */
  double?: boolean;
}) {
  return (
    <div className={`relative border border-dore ${className}`}>
      {double && <span aria-hidden="true" className="pointer-events-none absolute inset-2 border border-dore/50" />}
      {children}
    </div>
  );
}
