import type { Metadata } from "next";
import { SITE } from "@/content/site";

export const metadata: Metadata = { title: "Conditions générales de vente" };

export default function CGV() {
  return (
    <>
      <h1>Conditions générales de vente</h1>
      <p>Gabarit à faire valider avant la mise en ligne. Vendeur : {SITE.legal.raisonSociale}.</p>
      <h2>1. Objet</h2>
      <p>Les présentes conditions régissent les ventes de produits (bougies, formats voyage, recharges, coffrets, cartes cadeaux) et les réservations de l’Atelier Signature effectuées sur ce site.</p>
      <h2>2. Prix</h2>
      <p>Les prix sont indiqués en euros, toutes taxes comprises. Une bougie achetée avec un Atelier Signature bénéficie du prix atelier de 45&nbsp;€ au lieu de 59&nbsp;€. Frais de livraison : [À COMPLÉTER].</p>
      <h2>3. Atelier Signature</h2>
      <p>
        Rendez-vous individuel de {SITE.atelier.dureeMin} à {SITE.atelier.dureeMax} minutes, parfum de {SITE.atelier.contenance} inclus, au prix de {SITE.atelier.prix}&nbsp;€. Le parfum est composé selon vos goûts, parmi nos accords ; aucune formule exclusive n’est garantie. Délai de remise : {SITE.atelier.delaiRemise}. Modification et annulation : [À COMPLÉTER : délai et conditions].
      </p>
      <h2>4. Commande et paiement</h2>
      <p>La commande est validée après acceptation des présentes conditions. Le paiement est assuré par un prestataire sécurisé : [À COMPLÉTER : prestataire].</p>
      <h2>5. Retrait et livraison</h2>
      <p>Retrait gratuit en boutique. Livraison : [À COMPLÉTER : zones, délais, transporteur].</p>
      <h2>6. Droit de rétractation</h2>
      <p>[À COMPLÉTER : conditions de rétractation, et exceptions pour les produits personnalisés (gravure, parfum composé en atelier).]</p>
      <h2>7. Cartes cadeaux</h2>
      <p>[À COMPLÉTER : durée de validité, conditions d’utilisation.]</p>
      <h2>8. Réclamations et médiation</h2>
      <p>Contact : {SITE.email}. Médiateur de la consommation : [À COMPLÉTER].</p>
    </>
  );
}
