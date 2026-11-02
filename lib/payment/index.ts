/**
 * Paiement de la boutique.
 *
 * `PaymentProvider` isole le site du prestataire de paiement. L'implémentation
 * actuelle est simulée (aucune donnée bancaire n'est demandée ni stockée).
 * Pour Stripe : créer une route serveur qui ouvre une session Checkout et
 * renvoie son URL, puis implémenter `payer` pour y rediriger (voir README).
 */
export interface LigneCommande {
  nom: string;
  quantite: number;
  prixUnitaire: number;
  details?: string;
}

export interface Commande {
  lignes: LigneCommande[];
  total: number;
  client: { prenom: string; nom: string; email: string; telephone: string };
  livraison: { mode: "retrait" | "livraison"; adresse?: string };
}

export interface ResultatPaiement {
  statut: "valide" | "refuse";
  numero: string;
}

export interface PaymentProvider {
  payer(commande: Commande): Promise<ResultatPaiement>;
}

export class PaiementSimule implements PaymentProvider {
  async payer(): Promise<ResultatPaiement> {
    await new Promise((r) => setTimeout(r, 900));
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    const numero = `CMD-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    return { statut: "valide", numero };
  }
}

export const fournisseurPaiement: PaymentProvider = new PaiementSimule();
