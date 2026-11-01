"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { prix } from "@/content/site";
import { produitParSlug } from "@/content/produits";
import { prixLigne, totalPanier, usePanier } from "@/stores/panier";

/** Panier en tiroir latéral (dialogue modal : focus contenu, Échap pour fermer). */
export function TiroirPanier() {
  const { lignes, ouvert, fermer, changerQuantite, retirer } = usePanier();
  const reduit = useReducedMotion();
  const panneau = useRef<HTMLDivElement>(null);
  const declencheur = useRef<Element | null>(null);

  useEffect(() => {
    if (!ouvert) return;
    declencheur.current = document.activeElement;
    const echap = (e: KeyboardEvent) => e.key === "Escape" && fermer();
    document.addEventListener("keydown", echap);
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => panneau.current?.focus(), 30);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", echap);
      document.documentElement.style.overflow = "";
      (declencheur.current as HTMLElement | null)?.focus?.();
    };
  }, [ouvert, fermer]);

  // Garde le focus dans le tiroir.
  const pieger = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !panneau.current) return;
    const f = panneau.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input");
    if (!f.length) return;
    const premier = f[0];
    const dernier = f[f.length - 1];
    if (e.shiftKey && document.activeElement === premier) {
      e.preventDefault();
      dernier.focus();
    } else if (!e.shiftKey && document.activeElement === dernier) {
      e.preventDefault();
      premier.focus();
    }
  };

  const total = totalPanier(lignes);
  const duree = reduit ? 0 : 0.45;

  return (
    <AnimatePresence>
      {ouvert && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            className="absolute inset-0 bg-encre/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duree }}
            onClick={fermer}
            aria-hidden="true"
          />
          <motion.div
            ref={panneau}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-panier"
            tabIndex={-1}
            onKeyDown={pieger}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivoire-clair shadow-2xl outline-none"
            initial={{ x: reduit ? 0 : "100%", opacity: reduit ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduit ? 0 : "100%", opacity: reduit ? 0 : 1 }}
            transition={{ duration: duree, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-encre/10 px-6 py-5">
              <h2 id="titre-panier" className="font-serif text-3xl font-medium">
                Votre panier
              </h2>
              <button type="button" onClick={fermer} className="inline-flex size-11 cursor-pointer items-center justify-center" aria-label="Fermer le panier">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="m5 5 14 14M19 5 5 19" />
                </svg>
              </button>
            </div>

            {lignes.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <p className="font-serif text-2xl">Votre panier est vide.</p>
                <p className="mt-3 text-encre-douce">Découvrez nos bougies, le format voyage ou offrez un atelier.</p>
                <Link
                  href="/boutique"
                  onClick={fermer}
                  className="mt-8 inline-flex min-h-12 items-center bg-vert px-8 text-[0.8125rem] uppercase tracking-[0.24em] text-ivoire-clair hover:bg-vert-nuit"
                >
                  Voir la boutique
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-encre/10 overflow-y-auto px-6" aria-live="polite">
                  {lignes.map((l) => {
                    const p = produitParSlug(l.slug);
                    const { unitaire, total: tl, prixAtelier } = prixLigne(l, lignes);
                    return (
                      <li key={l.id} className="flex gap-4 py-5">
                        <div className="relative size-20 shrink-0 bg-ivoire">
                          {p && (
                            <Image src={`/renders/${p.visuel}.webp`} alt="" fill sizes="80px" className="object-contain p-1" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-serif text-lg leading-tight">{l.nom}</p>
                            <p className="shrink-0 tabular-nums">{prix(tl)}</p>
                          </div>
                          {prixAtelier && <p className="mt-1 text-sm text-dore-texte">Prix atelier : {prix(unitaire)} au lieu de 59 €</p>}
                          {l.options?.gravure && <p className="mt-1 text-sm text-encre-douce">Gravure : « {l.options.gravure} » (+15 €)</p>}
                          {l.options?.reference && <p className="mt-1 text-sm text-encre-douce">Référence : {l.options.reference}</p>}
                          {l.options?.carte && (
                            <p className="mt-1 text-sm text-encre-douce">
                              Pour {l.options.carte.pour}, de la part de {l.options.carte.de}
                            </p>
                          )}
                          <div className="mt-3 flex items-center gap-4">
                            <div className="flex items-center border border-encre/20">
                              <button
                                type="button"
                                className="size-9 cursor-pointer"
                                aria-label={`Retirer un ${l.nom}`}
                                onClick={() => changerQuantite(l.id, l.quantite - 1)}
                              >
                                −
                              </button>
                              <span className="w-8 text-center tabular-nums" aria-label={`Quantité : ${l.quantite}`}>
                                {l.quantite}
                              </span>
                              <button
                                type="button"
                                className="size-9 cursor-pointer"
                                aria-label={`Ajouter un ${l.nom}`}
                                onClick={() => changerQuantite(l.id, l.quantite + 1)}
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              className="min-h-9 cursor-pointer text-sm text-encre-douce underline underline-offset-4 hover:text-encre"
                              onClick={() => retirer(l.id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="border-t border-encre/10 px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="uppercase tracking-[0.2em] text-[0.8125rem] text-encre-douce">Total TTC</span>
                    <span className="font-serif text-3xl tabular-nums">{prix(total)}</span>
                  </div>
                  <Link
                    href="/panier"
                    onClick={fermer}
                    className="mt-5 flex min-h-12 w-full items-center justify-center bg-vert text-[0.8125rem] uppercase tracking-[0.24em] text-ivoire-clair hover:bg-vert-nuit"
                  >
                    Passer commande
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
