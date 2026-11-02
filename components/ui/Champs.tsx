"use client";

import { useId, type ComponentProps, type ReactNode } from "react";

/**
 * Contrôles de formulaire : libellé toujours visible au-dessus, aide sous le
 * champ, erreur juste sous le champ (liée par aria-describedby), cible ≥ 44 px.
 */

const CHAMP =
  "block w-full min-h-12 border-0 border-b border-encre/35 bg-transparent px-0 py-2.5 text-[1.0625rem] text-encre placeholder:text-encre-douce/70 transition-colors duration-300 hover:border-encre/60 focus:border-dore focus:outline-none focus-visible:shadow-none aria-[invalid=true]:border-erreur";

function Entete({ id, libelle, requis, optionnel }: { id: string; libelle: ReactNode; requis?: boolean; optionnel?: boolean }) {
  return (
    <label htmlFor={id} className="block text-[0.8125rem] uppercase tracking-[0.18em] text-encre-douce">
      {libelle}
      {requis && (
        <span className="text-dore-texte" aria-hidden="true">
          {" "}
          *
        </span>
      )}
      {optionnel && <span className="normal-case tracking-normal"> (facultatif)</span>}
    </label>
  );
}

function Pied({ idAide, aide, idErreur, erreur }: { idAide: string; aide?: ReactNode; idErreur: string; erreur?: ReactNode }) {
  return (
    <>
      {aide && (
        <p id={idAide} className="mt-1.5 text-sm text-encre-douce">
          {aide}
        </p>
      )}
      {erreur && (
        <p id={idErreur} className="mt-1.5 text-sm text-erreur" role="alert">
          {erreur}
        </p>
      )}
    </>
  );
}

type Base = { libelle: ReactNode; aide?: ReactNode; erreur?: ReactNode; optionnel?: boolean; className?: string };

export function Champ({ libelle, aide, erreur, optionnel, className = "", id, ...reste }: Base & ComponentProps<"input">) {
  const auto = useId();
  const i = id ?? auto;
  const decrit = [aide && `${i}-aide`, erreur && `${i}-erreur`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <Entete id={i} libelle={libelle} requis={reste.required} optionnel={optionnel} />
      <input id={i} {...reste} aria-invalid={erreur ? true : undefined} aria-describedby={decrit} className={CHAMP} />
      <Pied idAide={`${i}-aide`} aide={aide} idErreur={`${i}-erreur`} erreur={erreur} />
    </div>
  );
}

export function ZoneTexte({ libelle, aide, erreur, optionnel, className = "", id, ...reste }: Base & ComponentProps<"textarea">) {
  const auto = useId();
  const i = id ?? auto;
  const decrit = [aide && `${i}-aide`, erreur && `${i}-erreur`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <Entete id={i} libelle={libelle} requis={reste.required} optionnel={optionnel} />
      <textarea
        id={i}
        rows={4}
        {...reste}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={decrit}
        className={`${CHAMP} resize-y`}
      />
      <Pied idAide={`${i}-aide`} aide={aide} idErreur={`${i}-erreur`} erreur={erreur} />
    </div>
  );
}

/** Case à cocher (consentements : jamais cochée par défaut). */
export function Case({
  children,
  erreur,
  className = "",
  id,
  ...reste
}: { children: ReactNode; erreur?: ReactNode; className?: string } & Omit<ComponentProps<"input">, "type">) {
  const auto = useId();
  const i = id ?? auto;
  return (
    <div className={className}>
      <label htmlFor={i} className="flex min-h-11 cursor-pointer items-start gap-3.5 py-1.5 text-[0.9375rem] leading-relaxed text-encre">
        <input
          id={i}
          type="checkbox"
          {...reste}
          aria-invalid={erreur ? true : undefined}
          aria-describedby={erreur ? `${i}-erreur` : undefined}
          className="peer mt-1 size-[1.125rem] shrink-0 cursor-pointer appearance-none border border-encre/60 bg-ivoire-clair transition-colors checked:border-vert checked:bg-vert checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22 stroke=%22%23FBF6EE%22 stroke-width=%221.6%22><path d=%22M3.5 8.5l3 3 6-7%22/></svg>')] aria-[invalid=true]:border-erreur"
        />
        <span>{children}</span>
      </label>
      {erreur && (
        <p id={`${i}-erreur`} className="ml-8 text-sm text-erreur" role="alert">
          {erreur}
        </p>
      )}
    </div>
  );
}

/** Puce sélectionnable (senteurs, choix multiples). Bouton à bascule annoncé. */
export function Puce({
  selectionnee,
  onBasculer,
  children,
  className = "",
}: {
  selectionnee: boolean;
  onBasculer: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selectionnee}
      onClick={onBasculer}
      className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-5 text-[0.9375rem] transition-colors duration-300 ${
        selectionnee
          ? "border-vert bg-vert text-ivoire-clair"
          : "border-encre/30 bg-transparent text-encre hover:border-dore hover:bg-ivoire-clair"
      } ${className}`}
    >
      {selectionnee && (
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3.5 8.5l3 3 6-7" />
        </svg>
      )}
      {children}
    </button>
  );
}
