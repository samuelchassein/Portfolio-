import { createJSONStorage, type StateStorage } from "zustand/middleware";

/**
 * Stockage local protégé : navigation privée, stockage bloqué ou plein ne
 * doivent jamais casser le site. En cas d'échec, l'état reste en mémoire.
 */
const memoire = new Map<string, string>();

const protege: StateStorage = {
  getItem: (k) => {
    try {
      return window.localStorage.getItem(k) ?? memoire.get(k) ?? null;
    } catch {
      return memoire.get(k) ?? null;
    }
  },
  setItem: (k, v) => {
    memoire.set(k, v);
    try {
      window.localStorage.setItem(k, v);
    } catch {
      /* stockage indisponible : on garde la copie en mémoire */
    }
  },
  removeItem: (k) => {
    memoire.delete(k);
    try {
      window.localStorage.removeItem(k);
    } catch {
      /* rien */
    }
  },
};

export const stockageProtege = createJSONStorage(() => protege);
