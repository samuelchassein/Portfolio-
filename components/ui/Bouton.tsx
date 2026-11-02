import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Boutons Maison Sensa.
 * - plein : vert profond, texte ivoire (action principale : réserver, valider) ;
 * - contour : filet encre, fond transparent (action secondaire) ;
 * - dore : bandeau vert avec texte doré, pour les appels forts sur fond vert ;
 * - ivoire : plein ivoire, pour les sections vertes ;
 * - lien : texte souligné d'un filet doré qui s'allonge au survol.
 * Cible tactile ≥ 48 px de haut ; états survol, appui (classe .appui), focus, désactivé, envoi.
 */
export type VarianteBouton = "plein" | "contour" | "dore" | "ivoire" | "lien";

const BASE =
  "group/bouton relative inline-flex items-center justify-center gap-3 font-sans text-[0.8125rem] uppercase tracking-[0.24em] appui disabled:cursor-not-allowed disabled:opacity-55 aria-disabled:cursor-not-allowed aria-disabled:opacity-55 cursor-pointer select-none";

const VARIANTES: Record<VarianteBouton, string> = {
  plein: "min-h-12 px-8 bg-vert text-ivoire-clair hover:bg-vert-nuit",
  contour: "min-h-12 px-8 border border-encre/70 text-encre hover:bg-encre hover:text-ivoire-clair",
  dore: "min-h-12 px-8 border border-dore text-dore-clair bg-vert hover:bg-vert-nuit hover:text-ivoire-clair",
  ivoire: "min-h-12 px-8 bg-ivoire-clair text-vert hover:bg-ivoire",
  lien: "min-h-11 px-0 text-encre normal-case tracking-[0.08em] text-base",
};

function Contenu({ children, variante, fleche }: { children: ReactNode; variante: VarianteBouton; fleche?: boolean }) {
  return (
    <>
      <span className="relative">
        {children}
        {variante === "lien" && (
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-0 h-px w-8 bg-dore transition-[width] duration-500 ease-doux group-hover/bouton:w-full group-focus-visible/bouton:w-full"
          />
        )}
      </span>
      {fleche && (
        <svg aria-hidden="true" viewBox="0 0 24 12" className="h-3 w-6 transition-transform duration-500 ease-doux group-hover/bouton:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M0 6h22M17 1l5 5-5 5" />
        </svg>
      )}
    </>
  );
}

type Commun = { variante?: VarianteBouton; fleche?: boolean; className?: string; children: ReactNode };

export function Bouton({
  variante = "plein",
  fleche,
  className = "",
  children,
  enCours,
  ...reste
}: Commun & { enCours?: boolean } & ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...reste}
      disabled={reste.disabled || enCours}
      aria-busy={enCours || undefined}
      className={`${BASE} ${VARIANTES[variante]} ${className}`}
    >
      {enCours && (
        <span aria-hidden="true" className="size-3.5 animate-spin rounded-full border border-current border-t-transparent" />
      )}
      <Contenu variante={variante} fleche={fleche}>
        {children}
      </Contenu>
    </button>
  );
}

export function LienBouton({
  variante = "plein",
  fleche,
  className = "",
  children,
  ...reste
}: Commun & ComponentProps<typeof Link>) {
  return (
    <Link {...reste} className={`${BASE} ${VARIANTES[variante]} ${className}`}>
      <Contenu variante={variante} fleche={fleche}>
        {children}
      </Contenu>
    </Link>
  );
}
