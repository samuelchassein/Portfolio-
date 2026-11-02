import { EnTete } from "@/components/layout/EnTete";
import { PiedDePage } from "@/components/layout/PiedDePage";
import { DefilementDoux } from "@/components/layout/DefilementDoux";
import { TiroirPanier } from "@/components/boutique/TiroirPanier";
import { BandeauCookies } from "@/components/layout/BandeauCookies";
import { SITE } from "@/content/site";

/** Données structurées LocalBusiness : uniquement des informations réelles (pas d'adresse ni d'horaires d'exemple). */
const LOCAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: SITE.nom,
  description: "Parfumerie et atelier de création olfactive.",
  url: SITE.url,
  email: SITE.email,
  address: { "@type": "PostalAddress", addressLocality: SITE.adresse.ville, postalCode: SITE.adresse.codePostal, addressCountry: "FR" },
};

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
      <BandeauCookies />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS) }} />
    </>
  );
}
