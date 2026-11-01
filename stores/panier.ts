"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { stockageProtege } from "@/lib/stockage";
import { PRIX } from "@/content/produits";

export interface LignePanier {
  /** Identifiant unique de la ligne (un même produit peut avoir des options différentes). */
  id: string;
  slug: string;
  nom: string;
  type: "atelier" | "bougie" | "voyage" | "recharge" | "coffret" | "carte-cadeau";
  prixUnitaire: number;
  quantite: number;
  options?: {
    gravure?: string;
    reference?: string;
    carte?: { pour: string; de: string; message?: string; formule: "atelier" | "montant" };
  };
}

interface EtatPanier {
  lignes: LignePanier[];
  ouvert: boolean;
  ajouter: (l: Omit<LignePanier, "id" | "quantite"> & { quantite?: number }) => void;
  changerQuantite: (id: string, quantite: number) => void;
  retirer: (id: string) => void;
  vider: () => void;
  ouvrir: () => void;
  fermer: () => void;
}

const cle = (l: Omit<LignePanier, "id" | "quantite">) => `${l.slug}|${JSON.stringify(l.options ?? {})}`;

export const usePanier = create<EtatPanier>()(
  persist(
    (set) => ({
      lignes: [],
      ouvert: false,
      ajouter: ({ quantite = 1, ...l }) =>
        set((s) => {
          const id = cle(l);
          const existe = s.lignes.find((x) => x.id === id);
          // Les cartes cadeaux et les ateliers personnalisés restent des lignes distinctes.
          const lignes = existe
            ? s.lignes.map((x) => (x.id === id ? { ...x, quantite: x.quantite + quantite } : x))
            : [...s.lignes, { ...l, id, quantite }];
          return { lignes, ouvert: true };
        }),
      changerQuantite: (id, quantite) =>
        set((s) => ({
          lignes: quantite <= 0 ? s.lignes.filter((x) => x.id !== id) : s.lignes.map((x) => (x.id === id ? { ...x, quantite } : x)),
        })),
      retirer: (id) => set((s) => ({ lignes: s.lignes.filter((x) => x.id !== id) })),
      vider: () => set({ lignes: [] }),
      ouvrir: () => set({ ouvert: true }),
      fermer: () => set({ ouvert: false }),
    }),
    { name: "maison-sensa-panier", storage: stockageProtege, partialize: (s) => ({ lignes: s.lignes }) },
  ),
);

/**
 * Règle de panier : si un Atelier Signature est dans le panier, chaque bougie
 * passe de 59 € à 45 € (« Prix atelier »).
 */
export function prixLigne(l: LignePanier, lignes: LignePanier[]) {
  const atelier = lignes.some((x) => x.type === "atelier");
  const prixAtelier = l.type === "bougie" && atelier;
  const unitaire = prixAtelier ? PRIX.bougieAvecAtelier : l.prixUnitaire;
  const gravure = l.options?.gravure ? PRIX.gravure : 0;
  return { unitaire: unitaire + gravure, total: (unitaire + gravure) * l.quantite, prixAtelier };
}

export function totalPanier(lignes: LignePanier[]) {
  return lignes.reduce((t, l) => t + prixLigne(l, lignes).total, 0);
}

export const nombreArticles = (lignes: LignePanier[]) => lignes.reduce((n, l) => n + l.quantite, 0);
