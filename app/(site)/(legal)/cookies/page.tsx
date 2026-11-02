import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookies" };

export default function Cookies() {
  return (
    <>
      <h1>Cookies</h1>
      <p>Ce site n’utilise pas de cookie publicitaire ni de mesure d’audience à ce jour.</p>
      <h2>Stockage nécessaire</h2>
      <p>Votre panier, votre choix concernant ce bandeau, votre profil de diagnostic et vos réservations simulées sont conservés dans votre navigateur (stockage local). Ils sont nécessaires au fonctionnement du site.</p>
      <h2>Mesure d’audience</h2>
      <p>Si un outil de mesure d’audience est ajouté plus tard, il ne sera activé qu’après votre accord, et vous pourrez le refuser aussi simplement que l’accepter. [À COMPLÉTER le cas échéant.]</p>
      <h2>Modifier votre choix</h2>
      <p>Effacez les données du site dans votre navigateur : le bandeau s’affichera de nouveau.</p>
    </>
  );
}
