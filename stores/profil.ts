"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { stockageProtege } from "@/lib/stockage";
import type { CleFamille } from "@/content/familles";

/** Profil issu du diagnostic olfactif (aucune donnée de santé). */
export interface ProfilOlfactif {
  occasion: "moi" | "offrir";
  dominante: CleFamille;
  secondaire: CleFamille;
  intensite: "discrete" | "moderee" | "presente";
  usage: "quotidien" | "sortie" | "occasion";
  favorites: string[];
  aEviter: string[];
  date: string;
}

interface EtatProfil {
  profil: ProfilOlfactif | null;
  enregistrer: (p: ProfilOlfactif) => void;
  effacer: () => void;
}

export const useProfil = create<EtatProfil>()(
  persist(
    (set) => ({
      profil: null,
      enregistrer: (profil) => set({ profil }),
      effacer: () => set({ profil: null }),
    }),
    { name: "maison-sensa-profil", storage: stockageProtege },
  ),
);

const NOMS: Record<CleFamille, string> = { frais: "Frais", floral: "Floral", boise: "Boisé", ambre: "Ambré" };
const INTENSITES = { discrete: "discrète", moderee: "modérée", presente: "présente" };

/** Résumé lisible joint à la réservation et aux e-mails. */
export function resumeProfil(p: ProfilOlfactif) {
  return [
    `Famille dominante : ${NOMS[p.dominante]}, secondaire : ${NOMS[p.secondaire]}`,
    `Intensité ${INTENSITES[p.intensite]}, usage ${p.usage === "occasion" ? "pour une occasion" : p.usage}`,
    p.favorites.length ? `Senteurs appréciées : ${p.favorites.join(", ")}` : "",
    p.aEviter.length ? `À éviter : ${p.aEviter.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}
