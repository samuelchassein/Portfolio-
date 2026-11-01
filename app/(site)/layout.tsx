import { EnTete } from "@/components/layout/EnTete";
import { PiedDePage } from "@/components/layout/PiedDePage";
import { DefilementDoux } from "@/components/layout/DefilementDoux";
import { TiroirPanier } from "@/components/boutique/TiroirPanier";

/** Habillage des pages publiques : en-tête, contenu, pied de page, panier. */
export default function MiseEnPageSite({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DefilementDoux />
      <EnTete />
      <main id="contenu" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <PiedDePage />
      <TiroirPanier />
    </>
  );
}
