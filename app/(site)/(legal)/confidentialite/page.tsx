import type { Metadata } from "next";
import { SITE } from "@/content/site";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function Confidentialite() {
  return (
    <>
      <h1>Politique de confidentialité</h1>
      <p>Responsable du traitement : {SITE.legal.raisonSociale}, joignable à {SITE.email}.</p>
      <h2>Données collectées et finalités</h2>
      <ul>
        <li>Réservation d’atelier : prénom, nom, e-mail, téléphone, message facultatif et, si vous le choisissez, votre profil olfactif. Finalité : organiser votre rendez-vous.</li>
        <li>Commande : coordonnées et adresse de livraison. Finalité : traiter et livrer votre commande.</li>
        <li>Contact : nom, e-mail, message. Finalité : vous répondre.</li>
        <li>Lettre d’information : e-mail, uniquement avec votre accord explicite, retirable à tout moment.</li>
      </ul>
      <p>Aucune donnée de santé n’est demandée. Le diagnostic olfactif reste dans votre navigateur tant que vous ne le joignez pas à une réservation.</p>
      <h2>Sous-traitants</h2>
      <ul>
        <li>EmailJS (envoi des e-mails de confirmation et de notification).</li>
        <li>Hébergeur du site : [À COMPLÉTER].</li>
        <li>Prestataire de paiement : [À COMPLÉTER].</li>
      </ul>
      <h2>Durées de conservation</h2>
      <p>[À COMPLÉTER : durées par type de données.]</p>
      <h2>Vos droits</h2>
      <p>Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition et de portabilité. Écrivez à {SITE.email}. Vous pouvez aussi saisir la CNIL.</p>
      <h2>Stockage dans votre navigateur</h2>
      <p>Le panier, le profil de diagnostic et vos réservations simulées sont conservés dans votre navigateur (stockage local), sans être transmis à des tiers.</p>
    </>
  );
}
